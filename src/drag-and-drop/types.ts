import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';

export type TItem = {
  id: string;
  label: string;
};

export type TItemData<T> = {
  itemKey: true;
  item: T;
  index: number;
  instanceId: symbol;
};

export type TCleanupFn = () => void;

export type TItemEntry = { itemId: string; element: HTMLElement };

export type TListContextValue = {
  getListLength: () => number;
  registerItem: (entry: TItemEntry) => TCleanupFn;
  reorderItem: (args: {
    startIndex: number;
    indexOfTarget: number;
    closestEdgeOfTarget: Edge | null;
  }) => void;
  instanceId: symbol;
};

export type TListState<T extends { id: string }> = {
  items: T[];
  lastCardMoved: {
    item: T;
    previousIndex: number;
    currentIndex: number;
    numberOfItems: number;
  } | null;
};

export type TDraggableState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'dragging' };

// Grid ---------------------------------------------------------------

export type GridState = 'IDLE' | 'DRAGGING' | 'OVER';
