import { Box, Card, Stack } from "@mui/material";
import ReactDOM from "react-dom";
import useDndChildren from "./drag-and-drop/hooks/use-dnd-children";
import { ListContext } from "./drag-and-drop/utils";
import useDndParent from "./drag-and-drop/hooks/use-dnd-parent";
import type { TDraggableState } from "./drag-and-drop/types";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types";

const MOCK_ITEM_LIST = [
  { id: "1", label: "Item 1" },
  { id: "2", label: "Item 2" },
  { id: "3", label: "Item 3" },
  { id: "4", label: "Item 4" },
  { id: "5", label: "Item 5" },
  { id: "6", label: "Item 6" },
  { id: "7", label: "Item 7" },
  { id: "8", label: "Item 8" },
  { id: "9", label: "Item 9" },
  { id: "10", label: "Item 10" },
];

export default function ProfileDnd() {
  const { contextValue, items, scrollableRef } = useDndParent({
    itemList: MOCK_ITEM_LIST,
  });

  return (
    <ListContext value={contextValue}>
      <Stack ref={scrollableRef} spacing={2}>
        {items.map((item, index) => (
          <ProfileCard key={item.id} item={item} index={index} />
        ))}
      </Stack>
    </ListContext>
  );
}

// ----------------------------------------------------------------------

function ProfileCard({
  item,
  index,
}: {
  item: { id: string; label: string };
  index: number;
}) {
  const { ref, draggableState, closestEdge } = useDndChildren({ item, index });

  return (
    <>
      <Box ref={ref}>
        <RenderItem item={item} />

        <RenderDivideTag closestEdge={closestEdge} />
      </Box>

      <PreviewOnDrag draggableState={draggableState} item={item} />
    </>
  );
}

// ---------------------------------------------------------------------------------

const RenderItem = ({ item }: { item: { id: string; label: string } }) => {
  return (
    <Card
      sx={{
        display: "flex",
        padding: 1,
        alignItems: "center",
        gap: 1,
        cursor: "move",
      }}
    >
      <img
        src={`https://picsum.photos/200?${item.id}`}
        height={100}
        width={100}
      />
      <p>{item.label}</p>
    </Card>
  );
};

// ---------------------------------------------------------------------------------

const RenderDivideTag = ({ closestEdge }: { closestEdge: Edge | null }) => {
  if (!closestEdge) {
    return null;
  }

  return <p>hello man</p>;
};

// ---------------------------------------------------------------------------------

type TPreviewOnDragProps = {
  draggableState: TDraggableState;
  item: { id: string; label: string };
};

const PreviewOnDrag = ({ draggableState, item }: TPreviewOnDragProps) => {
  if (draggableState.type !== "preview") {
    return null;
  }

  return ReactDOM.createPortal(
    <Card
      sx={{
        display: "flex",
        padding: 1,
      }}
    >
      <Box>{item.label} test</Box>
    </Card>,
    draggableState.container
  );
};
