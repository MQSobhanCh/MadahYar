import { create } from "zustand";

import { loadStorage, saveStorage } from "../database/storage";

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const useMaddahStore = create((set, get) => ({
  folders: [],

  loading: false,

  initialized: false,

  initialize: async () => {
    if (get().initialized) {
      return;
    }

    set({
      loading: true,
    });

    try {
      const data = loadStorage();

      set({
        folders: data.folders || [],
        initialized: true,
        loading: false,
      });
    } catch (error) {
      console.error("Store initialization error:", error);

      set({
        loading: false,
      });
    }
  },

  addFolder: async (name) => {
    const folder = {
      id: createId(),

      name,

      createdAt: new Date().toISOString(),

      contents: {
        noheh: [],
        sher: [],
        roozeh: [],
      },
    };

    set((state) => {
      const folders = [folder, ...state.folders];

      saveStorage({
        folders,
      });

      return {
        folders,
      };
    });

    return folder;
  },

  removeFolder: async (folderId) => {
    set((state) => {
      const folders = state.folders.filter(
        (folder) => String(folder.id) !== String(folderId),
      );

      saveStorage({
        folders,
      });

      return {
        folders,
      };
    });
  },

  addContent: async (folderId, type, contentData) => {
    const content = {
      id: createId(),

      folderId,

      type,

      title: contentData.title,

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),

      attachments: contentData.attachments || [],

      isFavorite: false,
    };

    set((state) => {
      const folders = state.folders.map((folder) => {
        if (String(folder.id) !== String(folderId)) {
          return folder;
        }

        return {
          ...folder,

          contents: {
            ...folder.contents,

            [type]: [...(folder.contents?.[type] || []), content],
          },
        };
      });

      saveStorage({
        folders,
      });

      return {
        folders,
      };
    });

    return content;
  },

  updateContent: async (folderId, type, contentId, data) => {
    set((state) => {
      const folders = state.folders.map((folder) => {
        if (String(folder.id) !== String(folderId)) {
          return folder;
        }

        return {
          ...folder,

          contents: {
            ...folder.contents,

            [type]: (folder.contents?.[type] || []).map((item) => {
              if (String(item.id) !== String(contentId)) {
                return item;
              }

              return {
                ...item,

                ...data,

                updatedAt: new Date().toISOString(),
              };
            }),
          },
        };
      });

      saveStorage({
        folders,
      });

      return {
        folders,
      };
    });
  },

  deleteContent: async (folderId, type, contentId) => {
    set((state) => {
      const folders = state.folders.map((folder) => {
        if (String(folder.id) !== String(folderId)) {
          return folder;
        }

        return {
          ...folder,

          contents: {
            ...folder.contents,

            [type]: (folder.contents?.[type] || []).filter(
              (item) => String(item.id) !== String(contentId),
            ),
          },
        };
      });

      saveStorage({
        folders,
      });

      return {
        folders,
      };
    });
  },

  toggleFavorite: async (folderId, type, contentId) => {
    set((state) => {
      const folders = state.folders.map((folder) => {
        if (String(folder.id) !== String(folderId)) {
          return folder;
        }

        return {
          ...folder,

          contents: {
            ...folder.contents,

            [type]: (folder.contents?.[type] || []).map((item) => {
              if (String(item.id) !== String(contentId)) {
                return item;
              }

              return {
                ...item,

                isFavorite: !item.isFavorite,

                updatedAt: new Date().toISOString(),
              };
            }),
          },
        };
      });

      saveStorage({
        folders,
      });

      return {
        folders,
      };
    });
  },

  getFavorites: () => {
    const favorites = [];

    get().folders.forEach((folder) => {
      const contents = folder.contents || {};

      Object.entries(contents).forEach(([type, items]) => {
        (items || []).forEach((item) => {
          if (item.isFavorite === true) {
            favorites.push({
              ...item,
              folderId: folder.id,
              folderName: folder.name,
              type,
            });
          }
        });
      });
    });

    return favorites;
  },

  getFolderById: (folderId) => {
    return get().folders.find(
      (folder) => String(folder.id) === String(folderId),
    );
  },

  getContentById: (folderId, type, contentId) => {
    const folder = get().folders.find(
      (item) => String(item.id) === String(folderId),
    );

    if (!folder) {
      return null;
    }

    return (folder.contents?.[type] || []).find(
      (item) => String(item.id) === String(contentId),
    );
  },
}));

export default useMaddahStore;
