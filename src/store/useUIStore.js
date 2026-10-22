import { create } from "zustand";

const useUIStore = create((set, get) => ({

  toast: {
    message: "",
    type: "info",
  },

  showToast: (message, type = "info") => {
    set({
      toast: {
        message,
        type,
      },
    });
  },

  hideToast: () => {
    set({
      toast: {
        message: "",
        type: "info",
      },
    });
  },

  confirmState: null,

  confirm: (options = {}) => {
    return new Promise((resolve) => {

      const current = get().confirmState;
      if (current?.resolve) {
        current.resolve(false);
      }

      set({
        confirmState: {
          title: options.title || "مطمئنی؟",
          message: options.message || "",
          confirmText: options.confirmText || "بله، مطمئنم",
          cancelText: options.cancelText || "انصراف",
          danger: options.danger !== false,
          resolve,
        },
      });
    });
  },

  resolveConfirm: (result) => {
    const current = get().confirmState;

    set({
      confirmState: null,
    });

    current?.resolve?.(result);
  },
}));

export default useUIStore;
