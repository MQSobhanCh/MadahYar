import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineArrowDown,
  HiOutlineArrowRight,
  HiOutlineArrowUp,
  HiOutlinePlay,
  HiOutlinePlus,
  HiOutlineXMark,
} from "react-icons/hi2";

import PerformanceMode from "../components/PerformanceMode";
import useMaddahStore from "../store/useMaddahStore";
import useSetlistStore from "../store/useSetlistStore";
import useUIStore from "../store/useUIStore";
import { loadContentImages } from "../utils/loadContentImages";

const typeTitles = { noheh: "نوحه", sher: "شعر", roozeh: "روضه" };

const findContent = (folders, item) =>
  folders
    .find((folder) => folder.id === item.folderId)
    ?.contents?.[item.type]?.find((content) => content.id === item.contentId) ||
  null;

function SetlistDetail() {
  const navigate = useNavigate();
  const { setlistId } = useParams();

  const folders = useMaddahStore((state) => state.folders);
  const list = useSetlistStore((state) =>
    state.lists.find((item) => item.id === setlistId),
  );
  const addItems = useSetlistStore((state) => state.addItems);
  const removeItem = useSetlistStore((state) => state.removeItem);
  const moveItem = useSetlistStore((state) => state.moveItem);

  const showToast = useUIStore((state) => state.showToast);

  const [picking, setPicking] = useState(false);
  const [selected, setSelected] = useState({});
  const [running, setRunning] = useState(false);
  const [loadingRun, setLoadingRun] = useState(false);
  const [runImages, setRunImages] = useState([]);

  const available = useMemo(() => {
    if (!list) return [];

    const inList = new Set(list.items.map((item) => item.contentId));
    const result = [];

    folders.forEach((folder) => {
      Object.entries(folder.contents || {}).forEach(([type, contents]) => {
        (contents || []).forEach((content) => {
          if (!inList.has(content.id)) {
            result.push({
              key: content.id,
              folderId: folder.id,
              folderName: folder.name,
              type,
              contentId: content.id,
              title: content.title,
            });
          }
        });
      });
    });

    return result;
  }, [folders, list]);

  if (!list) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white"
      >
        <div className="text-center">
          <p className="font-black">این لیست پیدا نشد.</p>
          <button
            type="button"
            onClick={() => navigate("/setlists")}
            className="mt-5 rounded-2xl bg-amber-500 px-6 py-3 font-bold text-slate-950"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    const chosen = available
      .filter((entry) => selected[entry.key])
      .map(({ folderId, type, contentId }) => ({ folderId, type, contentId }));

    if (chosen.length) {
      addItems(list.id, chosen);
      showToast(`${chosen.length} محتوا به لیست اضافه شد.`, "success");
    }

    setSelected({});
    setPicking(false);
  };

  const handleRun = async () => {

    const contents = list.items
      .map((item) => findContent(folders, item))
      .filter(Boolean);

    if (!contents.length) {
      showToast("لیست خالی است.", "info");
      return;
    }

    setLoadingRun(true);

    try {
      const images = [];

      for (const content of contents) {
        const loaded = await loadContentImages(content);

        loaded.forEach((image, index) => {
          images.push({
            ...image,
            heading: index === 0 ? content.title : undefined,
          });
        });
      }

      if (!images.length) {
        showToast("هیچ‌کدام از محتواهای این لیست تصویر ندارند.", "info");
        return;
      }

      setRunImages(images);
      setRunning(true);
    } finally {
      setLoadingRun(false);
    }
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 pb-32 text-white">
      {running && (
        <PerformanceMode
          title={list.name}
          images={runImages}
          onClose={() => setRunning(false)}
        />
      )}

      <header className="border-b border-white/10 bg-slate-900">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-5">
          <button
            type="button"
            onClick={() => navigate("/setlists")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl transition hover:bg-white/10"
            title="بازگشت"
          >
            <HiOutlineArrowRight />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-black">{list.name}</h1>
            <p className="mt-1 text-xs text-slate-500">
              {list.items.length} محتوا
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleRun}
            disabled={loadingRun || list.items.length === 0}
            className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3.5 font-black text-slate-950 transition hover:bg-amber-400 disabled:opacity-40"
          >
            <HiOutlinePlay className="text-xl" />
            {loadingRun ? "در حال آماده‌سازی..." : "شروع اجرا"}
          </button>

          <button
            type="button"
            onClick={() => setPicking(true)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900 py-3.5 font-bold transition hover:bg-slate-800"
          >
            <HiOutlinePlus className="text-xl" />
            افزودن محتوا
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {list.items.length === 0 && (
            <p className="mt-10 text-center text-sm text-slate-500">
              لیست خالی است. از «افزودن محتوا» نوحه‌هایت را اضافه کن.
            </p>
          )}

          {list.items.map((item, index) => {
            const content = findContent(folders, item);

            return (
              <div
                key={item.contentId}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 p-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-sm font-black text-amber-400">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-black ${content ? "" : "text-slate-600"}`}
                  >
                    {content ? content.title : "این محتوا حذف شده است"}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {typeTitles[item.type] || ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => moveItem(list.id, index, -1)}
                  disabled={index === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-white/10 disabled:opacity-20"
                  title="بالا"
                >
                  <HiOutlineArrowUp />
                </button>

                <button
                  type="button"
                  onClick={() => moveItem(list.id, index, 1)}
                  disabled={index === list.items.length - 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-white/10 disabled:opacity-20"
                  title="پایین"
                >
                  <HiOutlineArrowDown />
                </button>

                <button
                  type="button"
                  onClick={() => removeItem(list.id, index)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                  title="حذف از لیست"
                >
                  <HiOutlineXMark />
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {picking && (
        <div
          className="fixed inset-0 z-[300] flex items-end bg-black/70 backdrop-blur-sm sm:items-center sm:justify-center"
          onClick={() => setPicking(false)}
        >
          <div
            className="flex max-h-[80vh] w-full flex-col rounded-t-3xl border border-white/10 bg-slate-900 sm:max-w-md sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="font-black">انتخاب محتوا</h2>
              <button
                type="button"
                onClick={() => setPicking(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 hover:bg-white/10"
              >
                <HiOutlineXMark />
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto px-5 pb-3">
              {available.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-500">
                  محتوای دیگری برای اضافه کردن وجود ندارد.
                </p>
              )}

              {available.map((entry) => (
                <label
                  key={entry.key}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950 px-3 py-3"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(selected[entry.key])}
                    onChange={(event) =>
                      setSelected((current) => ({
                        ...current,
                        [entry.key]: event.target.checked,
                      }))
                    }
                    className="h-5 w-5 accent-amber-500"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">
                      {entry.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">
                      {typeTitles[entry.type]} — {entry.folderName}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <div className="border-t border-white/10 p-4">
              <button
                type="button"
                onClick={handleAdd}
                disabled={selectedCount === 0}
                className="w-full rounded-2xl bg-amber-500 py-3 font-black text-slate-950 disabled:opacity-40"
              >
                {selectedCount ? `افزودن ${selectedCount} مورد` : "افزودن"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SetlistDetail;
