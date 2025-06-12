import { useRef, useState, useEffect, useContext } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { InstanceIdContext } from '../utils';

import type { GridState } from '../types';

// ----------------------------------------------------------------------

export default function useDndGridChildren<T extends { id: string }>({ item }: { item: T }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setstate] = useState<GridState>('IDLE');
  const instanceId = useContext(InstanceIdContext);

  // useEffect ---------------------------------------------------------------

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    // eslint-disable-next-line consistent-return
    return combine(
      draggable({
        element,
        getInitialData: () => ({ type: 'grid-item', item, instanceId }),
        onDragStart: () => setstate('DRAGGING'),
        onDrop: () => setstate('IDLE'),
      }),
      dropTargetForElements({
        element,
        getData: () => ({ item }),
        getIsSticky: () => true,
        canDrop: ({ source }) => {
          const sourceData = source.data as {
            type?: string;
            instanceId?: symbol;
            item?: T;
          };

          if (!sourceData.item || !sourceData.item.id) {
            return false;
          }

          return (
            sourceData.instanceId === instanceId &&
            sourceData.type === 'grid-item' &&
            sourceData.item.id !== item.id
          );
        },
        onDragEnter: () => setstate('OVER'),
        onDragLeave: () => setstate('IDLE'),
        onDrop: () => setstate('IDLE'),
      })
    );
  }, [instanceId, item]);

  // ----------------------------------------------------------------------

  return {
    ref,
    state,
  };
}
