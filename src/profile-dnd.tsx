import { Card, Stack } from "@mui/material";

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
  return (
    <Stack spacing={2}>
      {MOCK_ITEM_LIST.map((item) => (
        <ProfileCard key={item.id} item={item} />
      ))}
    </Stack>
  );
}

// ----------------------------------------------------------------------

function ProfileCard({ item }: { item: { id: string; label: string } }) {
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
}
