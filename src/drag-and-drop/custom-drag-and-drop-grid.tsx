import { Typography } from '@mui/material';

import { InstanceIdContext } from './utils';
import { StyledCard, GridContainer } from './styles';
import useDndGridParent from './hooks/use-dnd-grid-parent';
import useDndGridChildren from './hooks/use-dnd-grid-children';

// ----------------------------------------------------------------------

export default function CustomDragAndDropGrid<T extends { id: string }>({
  itemList,
}: Readonly<{ itemList: T[] }>) {
  const { items, instanceId } = useDndGridParent({ itemList });

  return (
    <InstanceIdContext.Provider value={instanceId}>
      <GridContainer>
        {items.map((item) => (
          <ListItem item={item} key={item.id} />
        ))}
      </GridContainer>
    </InstanceIdContext.Provider>
  );
}

// ----------------------------------------------------------------------

function ListItem<T extends { id: string }>({ item }: Readonly<{ item: T }>) {
  const { ref, state } = useDndGridChildren({ item });

  return (
    <StyledCard ref={ref} state={state}>
      <Typography variant="h4">{item.id}</Typography>
    </StyledCard>
  );
}
