import { useEffect, useRef, useState } from "react";
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
import { saveFileToDevice, deleteStoredFile } from "../utils/fileStorage";
const typeTitles = { noheh: "نوحه", sher: "شعر", roozeh: "روضه" };
function EditContent() {
  const navigate = useNavigate();
  const { folderId, type, contentId } = useParams();
  const content = useMaddahStore((state) =>
    state.getContentById(folderId, type, contentId),
  );
  const updateContent = useMaddahStore((state) => state.updateContent);
  const showToast = useUIStore((state) => state.showToast);
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const pageTitle = typeTitles[type] || "محتوا";
   useEffect(() => {
    if (!content) {
      return;
    }
    setTitle(content.title || "");
    setExistingFiles(
      (content.attachments || []).map((file, index) => ({
        ...file,
        originalIndex: index,
      })),
    );
  }, [content]);
   const handleImagesSelect =
    (event) => {
      const files = Array.from(event.target.files || []);
      if (!files.length) {
        return;
      }
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      const preparedFiles = imageFiles.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
        kind: "image",
      }));
      setNewFiles((prev) => [...prev, ...preparedFiles]);
      event.target.value = "";
    };
   const handleAudioSelect =
    (event) => {
      const files = Array.from(event.target.files || []);
      if (!files.length) {
        return;
      }
      const audioFiles = files.filter((file) => file.type.startsWith("audio/"));
      const preparedFiles = audioFiles.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
        kind: "audio",
      }));
      setNewFiles((prev) => [...prev, ...preparedFiles]);
      event.target.value = "";
    };
   const handleRemoveExistingFile =
    (fileId) => {
      setExistingFiles((prev) =>
        prev.filter((file) => {
          const currentId = file.id ?? file.path ?? file.uri ?? file.name;
          return String(currentId) !== String(fileId);
        }),
      );
    };
   const handleRemoveNewFile =
    (fileId) => {
      setNewFiles((prev) => {
        const target = prev.find((item) => String(item.id) === String(fileId));
        if (target?.preview) {
          URL.revokeObjectURL(target.preview);
        }
        return prev.filter((item) => String(item.id) !== String(fileId));
      });
    };
   const handleSubmit =
    async (event) => {
      event.preventDefault();
      setError("");
      const cleanTitle = title.trim();
      if (!cleanTitle) {
        setError("لطفاً عنوان محتوا را وارد کنید.");
        return;
      }
      if (!content) {
        setError("محتوا پیدا نشد.");
        return;
      }
      setSaving(true);
      try {
         const originalAttachments =
          content.attachments || [];
        const keptPaths = new Set(
          existingFiles.map((file) => file.path || file.uri).filter(Boolean),
        );
        const removedFiles = originalAttachments.filter((file) => {
          const filePath = file.path || file.uri;
          if (!filePath) {
            return false;
          }
          return !keptPaths.has(filePath);
        });
         for (const file of removedFiles) {
          try {
            if (file.path) {
              await deleteStoredFile(file.path);
            }
          } catch (fileError) {
            console.error("Delete old file error:", fileError);
          }
        }
         const addedAttachments = [];
        for (const selected of newFiles) {
          const savedFile = await saveFileToDevice(selected.file);
          addedAttachments.push({
            ...savedFile,
            name: savedFile.name || selected.file.name,
            mimeType: savedFile.mimeType || selected.file.type,
            size: savedFile.size || selected.file.size,
          });
        }
         const finalAttachments = [
          ...existingFiles,
          ...addedAttachments,
        ];
         const cleanedAttachments =
          finalAttachments.map((file) => {
            const {
              originalIndex,
              preview,
              file: browserFile,
              ...cleanFile
            } = file;
            return cleanFile;
          });
         await updateContent(folderId, type, contentId, {
          title: cleanTitle,
          attachments: cleanedAttachments,
        });
         newFiles.forEach((item) => {
          if (item.preview) {
            URL.revokeObjectURL(item.preview);
          }
        });
         showToast(`تغییرات «${cleanTitle}» ذخیره شد.`, "success");
        navigate(`/folder/${folderId}/${type}/${contentId}`);
      } catch (saveError) {
        console.error("Edit content error:", saveError);
        setError(saveError?.message || "ویرایش محتوا انجام نشد.");
      } finally {
        setSaving(false);
      }
    };
   const handleCancel =
    () => {
      newFiles.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
      navigate(-1);
    };
   if (
    !content
  ) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white"
      >
        {" "}
        <div className="text-center">
          {" "}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10">
            {" "}
            <HiOutlineDocumentText className="text-4xl text-red-400" />{" "}
          </div>{" "}
          <h1 className="mt-5 text-2xl font-black"> محتوا پیدا نشد </h1>{" "}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 rounded-2xl bg-amber-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-400"
          >
            {" "}
            بازگشت{" "}
          </button>{" "}
        </div>{" "}
      </div>
    );
  }
   const existingImages =
    existingFiles.filter(
      (file) =>
        file.mimeType?.startsWith("image/") || file.type?.startsWith("image/"),
    );
  const existingAudio = existingFiles.filter(
    (file) =>
      file.mimeType?.startsWith("audio/") || file.type?.startsWith("audio/"),
  );
  const newImages = newFiles.filter((file) => file.kind === "image");
  const newAudio = newFiles.filter((file) => file.kind === "audio");
   return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-white">
      {" "}
      {" "}
      <header className="border-b border-white/10 bg-slate-900">
        {" "}
        <div className="mx-auto max-w-3xl px-5 py-5">
          {" "}
          <div className="flex items-center gap-4">
            {" "}
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl transition hover:bg-white/10 disabled:opacity-40"
            >
              {" "}
              <HiOutlineArrowRight />{" "}
            </button>{" "}
            <div className="min-w-0">
              {" "}
              <h1 className="truncate text-xl font-black">
                {" "}
                ویرایش {pageTitle}{" "}
              </h1>{" "}
              <p className="mt-1 truncate text-sm text-slate-500">
                {" "}
                {content.title}{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </header>{" "}
      {" "}
      <main className="mx-auto max-w-3xl px-5 py-8">
        {" "}
        <form onSubmit={handleSubmit} className="space-y-6">
          {" "}
          {" "}
          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            {" "}
            <div className="mb-5 flex items-center gap-3">
              {" "}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                {" "}
                <HiOutlineDocumentText className="text-xl text-amber-400" />{" "}
              </div>{" "}
              <div>
                {" "}
                <h2 className="font-black"> اطلاعات {pageTitle} </h2>{" "}
                <p className="text-xs text-slate-500">
                  {" "}
                  اطلاعات محتوا را ویرایش کنید{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <label className="block">
              {" "}
              <span className="mb-2 block text-sm font-bold text-slate-300">
                {" "}
                عنوان{" "}
              </span>{" "}
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={`مثلاً ${pageTitle} شب عاشورا`}
                disabled={saving}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-500 disabled:opacity-50"
              />{" "}
            </label>{" "}
          </section>{" "}
          {" "}
          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            {" "}
            <div className="mb-5">
              {" "}
              <h2 className="font-black"> افزودن فایل جدید </h2>{" "}
              <p className="mt-1 text-sm text-slate-500">
                {" "}
                می‌توانید عکس و فایل صوتی جدید اضافه کنید.{" "}
              </p>{" "}
            </div>{" "}
            <div className="grid gap-3 sm:grid-cols-2">
              {" "}
              <button
                type="button"
                disabled={saving}
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center justify-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-4 font-bold text-blue-400 transition hover:bg-blue-500/20 disabled:opacity-40"
              >
                {" "}
                <HiOutlinePhoto className="text-2xl" /> <span>افزودن عکس</span>{" "}
                <HiOutlinePlus />{" "}
              </button>{" "}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImagesSelect}
              />{" "}
              <button
                type="button"
                disabled={saving}
                onClick={() => audioInputRef.current?.click()}
                className="flex items-center justify-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-4 font-bold text-green-400 transition hover:bg-green-500/20 disabled:opacity-40"
              >
                {" "}
                <HiOutlineMusicalNote className="text-2xl" />{" "}
                <span>افزودن صوت</span> <HiOutlinePlus />{" "}
              </button>{" "}
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                multiple
                hidden
                onChange={handleAudioSelect}
              />{" "}
            </div>{" "}
          </section>{" "}
          {" "}
          {existingImages.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              {" "}
              <div className="mb-5 flex items-center justify-between">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <HiOutlinePhoto className="text-xl text-blue-400" />{" "}
                  <h2 className="font-black"> تصاویر فعلی </h2>{" "}
                </div>{" "}
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                  {" "}
                  {existingImages.length}{" "}
                </span>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                {existingImages.map((file, index) => {
                  const fileId =
                    file.id || file.path || file.uri || file.name || index;
                  return (
                    <div
                      key={`${fileId}-${index}`}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 p-4"
                    >
                      {" "}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                        {" "}
                        <HiOutlinePhoto className="text-2xl text-blue-400" />{" "}
                      </div>{" "}
                      <div className="min-w-0 flex-1">
                        {" "}
                        <p className="truncate text-sm font-bold">
                          {" "}
                          {file.name || "تصویر"}{" "}
                        </p>{" "}
                        <p className="mt-1 text-xs text-slate-600">
                          {" "}
                          تصویر ذخیره‌شده{" "}
                        </p>{" "}
                      </div>{" "}
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleRemoveExistingFile(fileId)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-40"
                        title="حذف تصویر"
                      >
                        {" "}
                        <HiOutlineTrash />{" "}
                      </button>{" "}
                    </div>
                  );
                })}{" "}
              </div>{" "}
            </section>
          )}{" "}
          {" "}
          {existingAudio.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              {" "}
              <div className="mb-5 flex items-center justify-between">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <HiOutlineMusicalNote className="text-xl text-green-400" />{" "}
                  <h2 className="font-black"> فایل‌های صوتی فعلی </h2>{" "}
                </div>{" "}
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                  {" "}
                  {existingAudio.length}{" "}
                </span>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                {existingAudio.map((file, index) => {
                  const fileId =
                    file.id || file.path || file.uri || file.name || index;
                  return (
                    <div
                      key={`${fileId}-${index}`}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 p-4"
                    >
                      {" "}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
                        {" "}
                        <HiOutlineMusicalNote className="text-2xl text-green-400" />{" "}
                      </div>{" "}
                      <div className="min-w-0 flex-1">
                        {" "}
                        <p className="truncate text-sm font-bold">
                          {" "}
                          {file.name || "فایل صوتی"}{" "}
                        </p>{" "}
                        <p className="mt-1 text-xs text-slate-600">
                          {" "}
                          فایل صوتی ذخیره‌شده{" "}
                        </p>{" "}
                      </div>{" "}
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleRemoveExistingFile(fileId)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-40"
                        title="حذف فایل صوتی"
                      >
                        {" "}
                        <HiOutlineTrash />{" "}
                      </button>{" "}
                    </div>
                  );
                })}{" "}
              </div>{" "}
            </section>
          )}{" "}
          {" "}
          {newImages.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              {" "}
              <div className="mb-5 flex items-center justify-between">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <HiOutlinePhoto className="text-xl text-blue-400" />{" "}
                  <h2 className="font-black"> تصاویر جدید </h2>{" "}
                </div>{" "}
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                  {" "}
                  {newImages.length}{" "}
                </span>{" "}
              </div>{" "}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {" "}
                {newImages.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950"
                  >
                    {" "}
                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="aspect-square w-full object-cover"
                    />{" "}
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleRemoveNewFile(item.id)}
                      className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/90 text-white shadow-lg transition hover:bg-red-500 disabled:opacity-40"
                    >
                      {" "}
                      <HiOutlineTrash />{" "}
                    </button>{" "}
                    <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6">
                      {" "}
                      <p className="truncate text-xs font-bold text-white">
                        {" "}
                        {item.file.name}{" "}
                      </p>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </section>
          )}{" "}
          {" "}
          {newAudio.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              {" "}
              <div className="mb-5 flex items-center justify-between">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <HiOutlineMusicalNote className="text-xl text-green-400" />{" "}
                  <h2 className="font-black"> فایل‌های صوتی جدید </h2>{" "}
                </div>{" "}
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                  {" "}
                  {newAudio.length}{" "}
                </span>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                {newAudio.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-4"
                  >
                    {" "}
                    <div className="mb-3 flex items-center gap-3">
                      {" "}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
                        {" "}
                        <HiOutlineMusicalNote className="text-xl text-green-400" />{" "}
                      </div>{" "}
                      <div className="min-w-0 flex-1">
                        {" "}
                        <p className="truncate text-sm font-bold">
                          {" "}
                          {item.file.name}{" "}
                        </p>{" "}
                        <p className="mt-1 text-xs text-slate-600">
                          {" "}
                          {(item.file.size / 1024 / 1024).toFixed(2)} MB{" "}
                        </p>{" "}
                      </div>{" "}
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleRemoveNewFile(item.id)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-40"
                      >
                        {" "}
                        <HiOutlineTrash />{" "}
                      </button>{" "}
                    </div>{" "}
                    <audio
                      controls
                      src={item.preview}
                      className="w-full"
                    />{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </section>
          )}{" "}
          {" "}
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm font-bold text-red-400">
              {" "}
              {error}{" "}
            </div>
          )}{" "}
          {" "}
          <div className="flex gap-3">
            {" "}
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 rounded-2xl bg-white/5 py-4 font-bold text-white transition hover:bg-white/10 disabled:opacity-40"
            >
              {" "}
              انصراف{" "}
            </button>{" "}
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="flex-1 rounded-2xl bg-amber-500 py-4 font-black text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {" "}
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </main>{" "}
    </div>
  );
}
export default EditContent;
