import { createFavoritesStore, FAVORITES_STORAGE_KEY } from "./favorites-store";

function throwingStorage() {
  const throwBlocked = () => {
    throw new Error("Storage is blocked");
  };
  return { getItem: throwBlocked, setItem: throwBlocked } as unknown as Storage;
}

function storageEventFromAnotherTab(newValue: string | null) {
  window.dispatchEvent(
    new StorageEvent("storage", { key: FAVORITES_STORAGE_KEY, newValue }),
  );
}

describe("favorites store", () => {
  beforeEach(() => window.localStorage.clear());

  it("starts empty", () => {
    const store = createFavoritesStore();

    expect(store.list()).toEqual([]);
    expect(store.has("13")).toBe(false);
  });

  it("adds teams in the order they were followed, without duplicates", () => {
    const store = createFavoritesStore();

    store.add("13");
    store.add("18");
    store.add("13");

    expect(store.list()).toEqual(["13", "18"]);
    expect(store.has("18")).toBe(true);
  });

  it("removes a team", () => {
    const store = createFavoritesStore();
    store.add("13");
    store.add("18");

    store.remove("13");

    expect(store.list()).toEqual(["18"]);
  });

  it("toggles a team on and off", () => {
    const store = createFavoritesStore();

    store.toggle("13");
    expect(store.has("13")).toBe(true);

    store.toggle("13");
    expect(store.has("13")).toBe(false);
  });

  it("keeps the same list between changes, as React snapshots require", () => {
    const store = createFavoritesStore();
    store.add("13");

    expect(store.list()).toBe(store.list());
  });

  it("remembers favorites in a new store instance", () => {
    createFavoritesStore().add("13");

    const reopenedStore = createFavoritesStore();

    expect(reopenedStore.list()).toEqual(["13"]);
    expect(reopenedStore.isPersisted()).toBe(true);
  });

  it.each([
    ["invalid JSON", "{not json"],
    ["a wrong shape", JSON.stringify({ version: 1, teamIds: "13" })],
    ["an unknown version", JSON.stringify({ version: 99, teamIds: ["13"] })],
    ["a bare list", JSON.stringify(["13"])],
  ])("treats %s as no favorites", (_case, savedValue) => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, savedValue);

    expect(createFavoritesStore().list()).toEqual([]);
  });

  it("keeps favorites in memory and reports them unpersisted when storage throws", () => {
    const store = createFavoritesStore(throwingStorage);

    store.add("13");

    expect(store.list()).toEqual(["13"]);
    expect(store.isPersisted()).toBe(false);
  });

  it("works in memory when storage is unavailable", () => {
    const store = createFavoritesStore(() => {
      throw new Error("No localStorage");
    });

    store.toggle("13");

    expect(store.list()).toEqual(["13"]);
    expect(store.isPersisted()).toBe(false);
  });

  it("notifies subscribers on each change and not after unsubscribing", () => {
    const store = createFavoritesStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.add("13");
    store.remove("13");
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    store.add("18");
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("does not notify when nothing changes", () => {
    const store = createFavoritesStore();
    store.add("13");
    const listener = vi.fn();
    store.subscribe(listener);

    store.add("13");
    store.remove("18");

    expect(listener).not.toHaveBeenCalled();
  });

  it("picks up changes from another tab and notifies subscribers", () => {
    const store = createFavoritesStore();
    const listener = vi.fn();
    store.subscribe(listener);

    const otherTab = createFavoritesStore();
    otherTab.add("18");
    storageEventFromAnotherTab(
      window.localStorage.getItem(FAVORITES_STORAGE_KEY),
    );

    expect(store.list()).toEqual(["18"]);
    expect(listener).toHaveBeenCalledOnce();
  });

  it("empties the list when another tab clears the storage", () => {
    const store = createFavoritesStore();
    store.add("13");
    store.subscribe(vi.fn());

    storageEventFromAnotherTab(null);

    expect(store.list()).toEqual([]);
  });
});
