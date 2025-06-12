import { Box, Card } from '@mui/material';
import { styled } from '@mui/material/styles';

import type { GridState } from './types';

// Styled ----------------------------------------------------------------------

export const GridContainer = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 110px)',
  gap: 20,
}));

// Styled component
export const StyledCard = styled(Card)<{ state: GridState }>(({ state }) => {
  const baseStyles = {
    width: 110,
    height: 110,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const stateStyles = (() => {
    switch (state) {
      case 'IDLE':
        return {
          '&:hover': {
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          },
        };
      case 'DRAGGING':
        return {
          opacity: 0.5,
        };
      case 'OVER':
        return {
          transform: 'scale(1.1) rotate(4deg)',
          filter: 'brightness(1.15)',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        };
      default:
        return {};
    }
  })();

  return {
    ...baseStyles,
    ...stateStyles,
  };
});

export const StyledDropIndicator = styled(Box)(({ theme }) => ({
  height: '2px',
  backgroundColor: theme.palette.primary.main,
  mt: 1,
  mb: 0.5,
}));
