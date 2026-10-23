"use client";

import { useSyncExternalStore } from "react";
import { createFavoritesStore, type FavoritesStore } from "./favorites-store";

let browserFavoritesStore: FavoritesStore | null = null;

// Created on first use in the browser, so the server never touches localStorage.
export function favoritesStore(): FavoritesStore {
  browserFavoritesStore ??= createFavoritesStore();
  return browserFavoritesStore;
}

const subscribe = (listener: () => void) =>
  favoritesStore().subscribe(listener);
// Server-rendered pages never depend on favorites, so they stay cacheable; favorites fill in after hydration.
const NO_FAVORITE_TEAM_IDS: string[] = [];

export function useFavoriteTeamIds(): string[] {
  return useSyncExternalStore(
    subscribe,
    () => favoritesStore().list(),
    () => NO_FAVORITE_TEAM_IDS,
  );
}

export function useAreFavoritesPersisted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => favoritesStore().isPersisted(),
    () => true,
  );
}
