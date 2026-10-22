import { create } from "zustand";

const KEY = "maddahyar_setlists";

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function save(lists) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lists));
  } catch (error) {
    console.error("Setlist save error:", error);
  }
}

const update = (set, get, fn) => {
  const lists = fn(get().lists);
  save(lists);
  set({ lists });
};

const useSetlistStore = create((set, get) => ({
  lists: load(),

  createList: (name) => {
    const id = createId();

    update(set, get, (lists) => [
      { id, name, createdAt: new Date().toISOString(), items: [] },
      ...lists,
    ]);

    return id;
  },

  removeList: (id) =>
    update(set, get, (lists) => lists.filter((list) => list.id !== id)),

  addItems: (id, items) =>
    update(set, get, (lists) =>
      lists.map((list) => {
        if (list.id !== id) return list;

        const known = new Set(list.items.map((item) => item.contentId));
        const fresh = items.filter((item) => !known.has(item.contentId));

        return { ...list, items: [...list.items, ...fresh] };
      }),
    ),

  removeItem: (id, index) =>
    update(set, get, (lists) =>
      lists.map((list) =>
        list.id === id
          ? { ...list, items: list.items.filter((_, i) => i !== index) }
          : list,
      ),
    ),

  moveItem: (id, index, direction) =>
    update(set, get, (lists) =>
      lists.map((list) => {
        if (list.id !== id) return list;

        const target = index + direction;
        if (target < 0 || target >= list.items.length) return list;

        const items = [...list.items];
        [items[index], items[target]] = [items[target], items[index]];

        return { ...list, items };
      }),
    ),
}));

export default useSetlistStore;
