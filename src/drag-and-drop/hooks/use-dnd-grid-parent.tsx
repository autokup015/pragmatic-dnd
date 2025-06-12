import { useState, useEffect } from "react";
import { autoScroller } from "@atlaskit/pragmatic-drag-and-drop-autoscroll";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import type { TItem } from "../types";

// ----------------------------------------------------------------------

export default function useDndGridParent<T extends { id: string }>({
  itemList,
}: {
  itemList: T[];
}) {
  const [items, setItems] = useState<T[]>(itemList);

  const [instanceId] = useState(() => Symbol("instance-id"));

  // useEffect ---------------------------------------------------------------

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
          return source.data.instanceId === instanceId;
        },
        onDrop({ source, location }) {
          autoScroller.stop();

          const destination = location.current.dropTargets[0];

          if (!destination) return;

          const sourceItem = source.data.item as TItem;
          const destinationItem = destination.data.item as TItem;

          if (!destinationItem || !sourceItem) return;

          const updated = [...items];
          const sourceIndex = items.findIndex(
            (item) => item.id === sourceItem.id
          );
          const destIndex = items.findIndex(
            (item) => item.id === destinationItem.id
          );

          // swapping item positions
          // [updated[sourceIndex], updated[destIndex]] = [updated[destIndex], updated[sourceIndex]];

          // Remove the source item
          const [movedItem] = updated.splice(sourceIndex, 1);
          // Insert it at the destination index
          updated.splice(destIndex, 0, movedItem);

          setItems(updated);
        },
      }),
    [instanceId, items]
  );

  useEffect(() => {
    setItems(itemList);
  }, [itemList]);

  // ----------------------------------------------------------------------

  return {
    items,
    instanceId,
  };
}
