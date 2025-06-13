import { createContext, use } from "react";

import type { TItemData, TItemEntry, TListContextValue } from "./types";

export function getItemRegistry() {
  const registry = new Map<string, HTMLElement>();

  function register({ itemId, element }: TItemEntry) {
    registry.set(itemId, element);

    return function unregister() {
      registry.delete(itemId);
    };
  }

  function getElement(itemId: string): HTMLElement | null {
    return registry.get(itemId) ?? null;
  }

  return { register, getElement };
}

export function isItemData<T>(
  data: Record<string | symbol, unknown>
): data is TItemData<T> {
  return data.itemKey === true;
}

export function getItemData<T>({
  item,
  index,
  instanceId,
}: {
  item: T;
  index: number;
  instanceId: symbol;
}): TItemData<T> {
  return {
    itemKey: true,
    item,
    index,
    instanceId,
  };
}

export function useListContext() {
  const listContext = use(ListContext);

  if (!listContext) {
    throw Error('listContext must be use listContextProvider')
  }

  return listContext;
}

export const ListContext = createContext<TListContextValue | null>({
  getListLength: () => 0,
  registerItem: () => () => {},
  reorderItem: () => {},
  instanceId: Symbol("instance-id"),
});

// Grid ---------------------------------------------------------------

export const InstanceIdContext = createContext<symbol | null>(null);
