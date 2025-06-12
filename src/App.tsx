import { Divider, Stack, Typography } from "@mui/material";
import "./App.css";
import CustomDragAndDrop from "./drag-and-drop/custom-drag-and-drop";
import CustomDragAndDropGrid from "./drag-and-drop/custom-drag-and-drop-grid";
import ProfileDnd from "./profile-dnd";

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

function App() {
  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Column Drag and Drop Example
        </Typography>
        <CustomDragAndDrop itemList={MOCK_ITEM_LIST} />
        <Typography variant="h4" sx={{ mb: 2 }}>
          Grid Drag and Drop Example
        </Typography>
        <Stack alignItems="center">
          <CustomDragAndDropGrid itemList={MOCK_ITEM_LIST} />
        </Stack>
      </Stack>

      <Divider sx={{ my: 5, backgroundColor: "white" }} />

      <Stack spacing={2}>
        <Typography variant="h4">Try it yourself</Typography>

        <ProfileDnd />
      </Stack>
    </>
  );
}

export default App;
