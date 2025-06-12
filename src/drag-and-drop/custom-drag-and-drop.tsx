import ReactDOM from "react-dom";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";

import { Box, Card, Stack } from "@mui/material";

// import { Image } from "../image";
import { ListContext } from "./utils";
import useDndParent from "./hooks/use-dnd-parent";
import useDndChildren from "./hooks/use-dnd-children";

import type { TItem } from "./types";

// ----------------------------------------------------------------------

export default function CustomDragAndDrop({ itemList }: { itemList: TItem[] }) {
  const { contextValue, items, scrollableRef } = useDndParent({ itemList });

  return (
    <ListContext.Provider value={contextValue}>
      <Stack
        ref={scrollableRef}
        sx={{
          overflowY: "auto",
          maxHeight: 455,
        }}
      >
        {items.map((item, index) => (
          <ListItem key={item.id} item={item} index={index} />
        ))}
      </Stack>
    </ListContext.Provider>
  );
}

// ----------------------------------------------------------------------

function ListItem({ item, index }: { item: TItem; index: number }) {
  const { ref, draggableState, closestEdge } = useDndChildren({ item, index });

  return (
    <>
      <Stack ref={ref} sx={{ position: "relative", py: 1 }}>
        <Card
          sx={{
            display: "flex",
            padding: 1,
            opacity: draggableState.type === "dragging" ? 0.4 : 1,
          }}
        >
          <Box>{item.label}</Box>
        </Card>
        {closestEdge && <DropIndicator edge={closestEdge} />}
      </Stack>
      {draggableState.type === "preview" &&
        ReactDOM.createPortal(
          <Card
            sx={{
              display: "flex",
              padding: 1,
            }}
          >
            <Box>{item.label}</Box>
          </Card>,
          draggableState.container
        )}
    </>
  );
}
