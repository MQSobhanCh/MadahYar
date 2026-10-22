import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  HiOutlineArrowRight,
  HiOutlinePhoto,
  HiOutlineMusicalNote,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineDocumentText,
} from "react-icons/hi2";

import useMaddahStore from "../store/useMaddahStore";
import useUIStore from "../store/useUIStore";
import { saveFileToDevice } from "../utils/fileStorage";

const typeTitles = {
  noheh: "نوحه",
  sher: "شعر",
  roozeh: "روضه",
};

function AddContent() {
  const navigate = useNavigate();

  const { folderId, type } = useParams();

  const addContent = useMaddahStore((state) => state.addContent);
  const showToast = useUIStore((state) => state.showToast);

  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const [title, setTitle] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const pageTitle = typeTitles[type] || "محتوا";

  const handleImagesSelect = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newFiles = imageFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,

      file,

      preview: URL.createObjectURL(file),

      kind: "image",
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    event.target.value = "";
  };

  const handleAudioSelect = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const audioFiles = files.filter((file) => file.type.startsWith("audio/"));

    const newFiles = audioFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,

      file,

      preview: URL.createObjectURL(file),

      kind: "audio",
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    event.target.value = "";
  };

  const handleRemoveFile = (fileId) => {
    setSelectedFiles((prev) => {
      const target = prev.find((item) => item.id === fileId);

      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }

      return prev.filter((item) => item.id !== fileId);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError("لطفاً عنوان محتوا را وارد کنید.");

      return;
    }

    if (!folderId || !type) {
      setError("اطلاعات مسیر محتوا ناقص است.");

      return;
    }

    setSaving(true);

    try {

      const attachments = [];

      for (const selected of selectedFiles) {
        const savedFile = await saveFileToDevice(selected.file);

        attachments.push(savedFile);
      }

      await addContent(folderId, type, {
        title: cleanTitle,

        attachments,
      });

      selectedFiles.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });

      showToast(`«${cleanTitle}» اضافه شد.`, "success");

      navigate(`/folder/${folderId}/${type}`);
    } catch (error) {
      console.error("Add content error:", error);

      setError(error?.message || "ذخیره محتوا انجام نشد.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    selectedFiles.forEach((item) => {
      if (item.preview) {
        URL.revokeObjectURL(item.preview);
      }
    });

    navigate(-1);
  };

  const imageFiles = selectedFiles.filter((item) => item.kind === "image");

  const audioFiles = selectedFiles.filter((item) => item.kind === "audio");

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-white/10 bg-slate-900">
        <div className="mx-auto max-w-3xl px-5 py-5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl transition hover:bg-white/10"
            >
              <HiOutlineArrowRight />
            </button>

            <div>
              <h1 className="text-xl font-black">افزودن {pageTitle}</h1>

              <p className="mt-1 text-sm text-slate-500">
                محتوای جدید اضافه کنید
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                <HiOutlineDocumentText className="text-xl text-amber-400" />
              </div>

              <div>
                <h2 className="font-black">اطلاعات {pageTitle}</h2>

                <p className="text-xs text-slate-500">
                  عنوان محتوا را وارد کنید
                </p>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-300">
                عنوان
              </span>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={`مثلاً ${pageTitle} شب عاشورا`}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-500"
              />
            </label>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <div className="mb-5">
              <h2 className="font-black">فایل‌های محتوا</h2>

              <p className="mt-1 text-sm text-slate-500">
                می‌توانید چند عکس و چند فایل صوتی انتخاب کنید.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center justify-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-4 font-bold text-blue-400 transition hover:bg-blue-500/20"
              >
                <HiOutlinePhoto className="text-2xl" />

                <span>افزودن عکس</span>

                <HiOutlinePlus />
              </button>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImagesSelect}
              />

              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                className="flex items-center justify-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-4 font-bold text-green-400 transition hover:bg-green-500/20"
              >
                <HiOutlineMusicalNote className="text-2xl" />

                <span>افزودن صوت</span>

                <HiOutlinePlus />
              </button>

              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                multiple
                hidden
                onChange={handleAudioSelect}
              />
            </div>
          </section>

          {imageFiles.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HiOutlinePhoto className="text-xl text-blue-400" />

                  <h2 className="font-black">تصاویر انتخاب‌شده</h2>
                </div>

                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                  {imageFiles.length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {imageFiles.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950"
                  >
                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="aspect-square w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(item.id)}
                      className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/90 text-white shadow-lg transition hover:bg-red-500"
                    >
                      <HiOutlineTrash />
                    </button>

                    <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6">
                      <p className="truncate text-xs font-bold text-white">
                        {item.file.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {audioFiles.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HiOutlineMusicalNote className="text-xl text-green-400" />

                  <h2 className="font-black">فایل‌های صوتی انتخاب‌شده</h2>
                </div>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                  {audioFiles.length}
                </span>
              </div>

              <div className="space-y-3">
                {audioFiles.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-4"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
                        <HiOutlineMusicalNote className="text-xl text-green-400" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                          {item.file.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {(item.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(item.id)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white"
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>

                    <audio controls src={item.preview} className="w-full" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm font-bold text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 rounded-2xl bg-white/5 py-4 font-bold text-white transition hover:bg-white/10 disabled:opacity-40"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="flex-1 rounded-2xl bg-amber-500 py-4 font-black text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "در حال ذخیره..." : "ذخیره محتوا"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddContent;
