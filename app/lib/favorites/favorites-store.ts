export const FAVORITES_STORAGE_KEY = "nba-next:favorite-teams";
// Bumped when the saved shape changes, so older values are discarded instead of misread.
const FAVORITES_STORAGE_VERSION = 1;

type SavedFavorites = {
  version: typeof FAVORITES_STORAGE_VERSION;
  teamIds: string[];
};

export type FavoritesStore = {
  // ESPN team ids in the order they were followed; the same array until the next change.
  list: () => string[];
  has: (teamId: string) => boolean;
  add: (teamId: string) => void;
  remove: (teamId: string) => void;
  toggle: (teamId: string) => void;
  // Listeners also hear changes made in other tabs.
  subscribe: (listener: () => void) => () => void;
  // False once storage is blocked or throws, so favorites only last the visit.
  isPersisted: () => boolean;
};

function parseSavedFavorites(savedValue: string | null): string[] {
  if (savedValue === null) return [];
  try {
    const saved: unknown = JSON.parse(savedValue);
    if (
      typeof saved !== "object" ||
      saved === null ||
      (saved as SavedFavorites).version !== FAVORITES_STORAGE_VERSION
    ) {
      return [];
    }
    const { teamIds } = saved as SavedFavorites;
    if (
      !Array.isArray(teamIds) ||
      !teamIds.every((teamId) => typeof teamId === "string")
    ) {
      return [];
    }
    return [...new Set(teamIds)];
  } catch {
    return [];
  }
}

export function createFavoritesStore(
  getStorage: () => Storage = () => window.localStorage,
): FavoritesStore {
  let isPersisted = true;
  const listeners = new Set<() => void>();

  const readSaved = () => {
    try {
      return parseSavedFavorites(getStorage().getItem(FAVORITES_STORAGE_KEY));
    } catch {
      isPersisted = false;
      return [];
    }
  };

  let teamIds = readSaved();

  const notify = () => listeners.forEach((listener) => listener());

  const save = (nextTeamIds: string[]) => {
    teamIds = nextTeamIds;
    if (isPersisted) {
      try {
        const saved: SavedFavorites = {
          version: FAVORITES_STORAGE_VERSION,
          teamIds,
        };
        getStorage().setItem(FAVORITES_STORAGE_KEY, JSON.stringify(saved));
      } catch {
        isPersisted = false;
      }
    }
    notify();
  };

  const has = (teamId: string) => teamIds.includes(teamId);
  const add = (teamId: string) => {
    if (!has(teamId)) save([...teamIds, teamId]);
  };
  const remove = (teamId: string) => {
    if (has(teamId)) save(teamIds.filter((savedId) => savedId !== teamId));
  };

  // The storage event only fires in the other tabs, never in the one that wrote.
  const syncFromOtherTab = (event: StorageEvent) => {
    if (event.key !== FAVORITES_STORAGE_KEY && event.key !== null) return;
    teamIds = parseSavedFavorites(event.newValue);
    notify();
  };

  return {
    list: () => teamIds,
    has,
    add,
    remove,
    toggle: (teamId) => (has(teamId) ? remove(teamId) : add(teamId)),
    subscribe: (listener) => {
      if (listeners.size === 0) {
        window.addEventListener("storage", syncFromOtherTab);
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          window.removeEventListener("storage", syncFromOtherTab);
        }
      };
    },
    isPersisted: () => isPersisted,
  };
}
