import { HiOutlineExclamationTriangle } from "react-icons/hi2";

import useUIStore from "../../store/useUIStore";

function ConfirmDialog() {
  const confirmState = useUIStore((state) => state.confirmState);
  const resolveConfirm = useUIStore((state) => state.resolveConfirm);

  if (!confirmState) {
    return null;
  }

  const { title, message, confirmText, cancelText, danger } = confirmState;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
      onClick={() => resolveConfirm(false)}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-6 text-center shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
            danger ? "bg-red-500/10" : "bg-amber-500/10"
          }`}
        >
          <HiOutlineExclamationTriangle
            className={`text-2xl ${danger ? "text-red-400" : "text-amber-400"}`}
          />
        </div>

        <h2 className="mt-4 text-lg font-black text-white">{title}</h2>

        {message && (
          <p className="mt-2 text-sm leading-6 text-slate-400">{message}</p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => resolveConfirm(false)}
            className="rounded-2xl bg-white/5 px-5 py-3 font-bold text-slate-300 transition hover:bg-white/10"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => resolveConfirm(true)}
            className={`rounded-2xl px-5 py-3 font-black transition active:scale-95 ${
              danger
                ? "bg-red-500 text-white hover:bg-red-400"
                : "bg-amber-500 text-slate-950 hover:bg-amber-400"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
