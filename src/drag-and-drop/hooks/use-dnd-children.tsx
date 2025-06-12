import { useRef, useState, useEffect } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  type Edge,
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import {
  draggable,
  dropTargetForElements,
  type ElementDropTargetEventBasePayload,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";

import { isItemData, getItemData, useListContext } from "../utils";

import type { TDraggableState } from "../types";

// ----------------------------------------------------------------------

const idleState: TDraggableState = { type: "idle" };
const draggingState: TDraggableState = { type: "dragging" };

// ----------------------------------------------------------------------

export default function useDndChildren<T extends { id: string }>({
  item,
  index,
}: {
  item: T;
  index: number;
}) {
  const { registerItem, instanceId } = useListContext();

  const ref = useRef<HTMLDivElement>(null);

  const [draggableState, setDraggableState] =
    useState<TDraggableState>(idleState);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const data = getItemData({ item, index, instanceId });

    function onChange({ source, self }: ElementDropTargetEventBasePayload) {
      const isSource = source.element === element;
      if (isSource) {
        setClosestEdge(null);
        return;
      }

      const newClosestEdge = extractClosestEdge(self.data);

      const sourceIndex = source.data.index ?? 0;

      if (typeof sourceIndex !== "number") {
        return;
      }

      const isItemBeforeSource = index === sourceIndex - 1;
      const isItemAfterSource = index === sourceIndex + 1;

      const isDropIndicatorHidden =
        (isItemBeforeSource && newClosestEdge === "bottom") ||
        (isItemAfterSource && newClosestEdge === "top");

      if (isDropIndicatorHidden) {
        setClosestEdge(null);
        return;
      }

      setClosestEdge(newClosestEdge);
    }

    return combine(
      registerItem({ itemId: item.id, element }),
      draggable({
        element,
        getInitialData: () => data,
        // for custom preview
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: "8px",
              y: "8px",
            }),
            render({ container }) {
              setDraggableState({ type: "preview", container });
              return () => setDraggableState(draggingState);
            },
          });
        },
        onDragStart() {
          setDraggableState(draggingState);
        },
        onDrop() {
          setDraggableState(idleState);
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return (
            isItemData(source.data) && source.data.instanceId === instanceId
          );
        },
        getData({ input }) {
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["bottom", "top"],
          });
        },
        onDragEnter: onChange,
        onDrag: onChange,
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop() {
          setClosestEdge(null);
        },
      })
    );
  }, [instanceId, item, index, registerItem]);

  return {
    ref,
    draggableState,
    closestEdge,
  };
}
