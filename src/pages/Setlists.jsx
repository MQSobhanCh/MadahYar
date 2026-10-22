import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlinePlus,
  HiOutlineQueueList,
  HiOutlineTrash,
} from "react-icons/hi2";

import useSetlistStore from "../store/useSetlistStore";
import useUIStore from "../store/useUIStore";

function Setlists() {
  const navigate = useNavigate();

  const lists = useSetlistStore((state) => state.lists);
  const createList = useSetlistStore((state) => state.createList);
  const removeList = useSetlistStore((state) => state.removeList);

  const showToast = useUIStore((state) => state.showToast);
  const confirmDialog = useUIStore((state) => state.confirm);

  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const handleStartCreate = () => {

    setCreating(true);
  };

  const handleCreate = () => {
    const clean = name.trim();

    if (!clean) {
      return;
    }

    const id = createList(clean);
    setName("");
    setCreating(false);
    navigate(`/setlists/${id}`);
  };

  const handleRemove = async (event, list) => {
    event.stopPropagation();

    const confirmed = await confirmDialog({
      title: `حذف لیست «${list.name}»؟`,
      message: "فقط خود لیست حذف می‌شود؛ نوحه‌ها و محتواها سر جایشان می‌مانند.",
      confirmText: "بله، حذف کن",
      cancelText: "انصراف",
    });

    if (!confirmed) {
      return;
    }

    removeList(list.id);
    showToast(`لیست «${list.name}» حذف شد.`, "success");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 pb-28 text-white">
      <header className="border-b border-white/10 bg-slate-900">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-5">
          <h1 className="text-xl font-black">لیست‌های اجرا</h1>

          <button
            type="button"
            onClick={handleStartCreate}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-400"
          >
            <HiOutlinePlus className="text-lg" />
            لیست جدید
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-6">
        {creating && (
          <div className="mb-5 rounded-2xl border border-white/10 bg-slate-900 p-4">
            <input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleCreate()}
              placeholder="نام لیست، مثلاً: مجلس شب جمعه"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-amber-500"
            />

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setCreating(false);
                  setName("");
                }}
                className="rounded-xl bg-white/5 py-2.5 text-sm font-bold text-slate-300"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!name.trim()}
                className="rounded-xl bg-amber-500 py-2.5 text-sm font-black text-slate-950 disabled:opacity-40"
              >
                ساخت
              </button>
            </div>
          </div>
        )}

        {lists.length === 0 && !creating ? (
          <div className="mt-16 text-center">
            <HiOutlineQueueList className="mx-auto text-6xl text-slate-700" />
            <h2 className="mt-4 text-lg font-black">هنوز لیستی نساختی</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
              برای هر مجلس یک لیست بساز، نوحه‌هایش را به ترتیب بچین و موقع اجرا
              همه را یک‌جا و پشت سر هم ببین.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {lists.map((list) => (
              <div
                key={list.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/setlists/${list.id}`)}
                onKeyDown={(event) =>
                  event.key === "Enter" && navigate(`/setlists/${list.id}`)
                }
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 p-4 transition hover:bg-slate-800"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-2xl text-amber-400">
                  <HiOutlineQueueList />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-black">{list.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {list.items.length} محتوا
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(event) => handleRemove(event, list)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                  title="حذف لیست"
                >
                  <HiOutlineTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Setlists;
