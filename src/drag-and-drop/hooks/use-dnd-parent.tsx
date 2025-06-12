import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { autoScroller } from '@atlaskit/pragmatic-drag-and-drop-autoscroll';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import {
  type Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';

import { isItemData, getItemRegistry } from '../utils';

import type { TListState, TListContextValue } from '../types';

export default function useDndParent<T extends { id: string }>({ itemList }: { itemList: T[] }) {
  const scrollableRef = useRef<HTMLDivElement | null>(null);

  const [{ items, lastCardMoved }, setListState] = useState<TListState<T>>({
    items: itemList,
    lastCardMoved: null,
  });

  const [registry] = useState(getItemRegistry);

  const [instanceId] = useState(() => Symbol('instance-id'));

  const reorderItem = useCallback(
    ({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    }: {
      startIndex: number;
      indexOfTarget: number;
      closestEdgeOfTarget: Edge | null;
    }) => {
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        closestEdgeOfTarget,
        indexOfTarget,
        axis: 'vertical',
      });

      if (finishIndex === startIndex) {
        // If there would be no change, we skip the update
        return;
      }

      setListState((listState) => {
        const item = listState.items[startIndex];

        return {
          items: reorder({
            list: listState.items,
            startIndex,
            finishIndex,
          }),
          lastCardMoved: {
            item,
            previousIndex: startIndex,
            currentIndex: finishIndex,
            numberOfItems: listState.items.length,
          },
        };
      });
    },
    []
  );

  const getListLength = useCallback(() => items.length, [items.length]);

  // order item after drop
  useEffect(
    () =>
      monitorForElements({
        onDragStart({ location }) {
          autoScroller.start({ input: location.current.input });
        },
        onDrag({ location }) {
          autoScroller.updateInput({ input: location.current.input });
        },
        canMonitor({ source }) {
          return isItemData(source.data) && source.data.instanceId === instanceId;
        },
        onDrop({ location, source }) {
          autoScroller.stop();

          const target = location.current.dropTargets[0];
          if (!target) {
            return;
          }

          const sourceData = source.data;
          const targetData = target.data;
          if (
            !isItemData(sourceData) ||
            !isItemData<Record<string | symbol, unknown>>(targetData)
          ) {
            return;
          }

          const indexOfTarget = items.findIndex((item) => item.id === targetData.item.id);
          if (indexOfTarget < 0) {
            return;
          }

          const closestEdgeOfTarget = extractClosestEdge(targetData);

          reorderItem({
            startIndex: sourceData.index,
            indexOfTarget,
            closestEdgeOfTarget,
          });
        },
      }),
    [instanceId, items, reorderItem]
  );

  // flashing animation after drop
  useEffect(() => {
    if (lastCardMoved === null) {
      return;
    }
    const { item } = lastCardMoved;
    const element = registry.getElement(item.id);
    if (element) {
      triggerPostMoveFlash(element);
    }
  }, [lastCardMoved, registry]);

  useEffect(() => {
    setListState({
      items: itemList,
      lastCardMoved: null,
    });
  }, [itemList]);

  const contextValue: TListContextValue = useMemo(
    () => ({
      registerItem: registry.register,
      reorderItem,
      instanceId,
      getListLength,
    }),
    [registry.register, reorderItem, instanceId, getListLength]
  );

  return {
    scrollableRef,
    items,
    contextValue,
  };
}
