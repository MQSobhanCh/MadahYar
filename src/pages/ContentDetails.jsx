import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineArrowRight,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePhoto,
  HiOutlineMusicalNote,
  HiOutlineDocumentText,
  HiOutlineXMark,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineHeart,
  HiOutlineArrowsPointingOut,
} from "react-icons/hi2";
import useMaddahStore from "../store/useMaddahStore";
import useUIStore from "../store/useUIStore";
import { getFileDataUrl, getFileUri } from "../utils/fileStorage";
import AudioPlayer from "../components/AudioPlayer";
import PerformanceMode from "../components/PerformanceMode";
const typeTitles = { noheh: "نوحه", sher: "شعر", roozeh: "روضه" };
const typeColors = {
  noheh: { text: "text-green-400", bg: "bg-green-500/10" },
  sher: { text: "text-blue-400", bg: "bg-blue-500/10" },
  roozeh: { text: "text-red-400", bg: "bg-red-500/10" },
};
function ContentDetails() {
  const navigate = useNavigate();
  const { folderId, type, contentId } = useParams();
  const content = useMaddahStore((state) =>
    state.getContentById(folderId, type, contentId),
  );
  const toggleFavorite = useMaddahStore((state) => state.toggleFavorite);
  const showToast = useUIStore((state) => state.showToast);
  const confirmDialog = useUIStore((state) => state.confirm);
  const [fileUrls, setFileUrls] = useState({});
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [performance, setPerformance] = useState(false);
  const pageTitle = typeTitles[type] || "محتوا";
  const colors = typeColors[type] || {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  };
   useEffect(() => {
    let cancelled = false;
    const loadFiles = async () => {
      if (!content) {
        setLoadingFiles(false);
        return;
      }
      const attachments = content.attachments || [];
      setLoadingFiles(true);
      const urls = {};
      for (let index = 0; index < attachments.length; index++) {
        const file = attachments[index];
        if (!file) {
          continue;
        }
        try {
           if (file.path) {
            const dataUrl = await getFileDataUrl(file.path, file.mimeType);
            if (dataUrl) {
              urls[index] = dataUrl;
              continue;
            }
            const uri = await getFileUri(file.path);
            if (uri) {
              urls[index] = uri;
            }
            continue;
          }
           if (file.uri) {
            urls[index] = file.uri;
            continue;
          }
           if (file.dataUrl) {
            urls[index] = file.dataUrl;
          }
        } catch (error) {
          console.error("Load attachment error:", error);
        }
      }
      if (!cancelled) {
        setFileUrls(urls);
        setLoadingFiles(false);
      }
    };
    loadFiles();
    return () => {
      cancelled = true;
    };
  }, [content]);
   const handleOpenImage =
    (src, name) => {
      setSelectedImage({ src, name });
      setZoom(1);
    };
  const handleCloseImage = () => {
    setSelectedImage(null);
    setZoom(1);
  };
  const handleZoomIn = () => {
    setZoom((current) => Math.min(Number((current + 0.25).toFixed(2)), 3));
  };
  const handleZoomOut = () => {
    setZoom((current) => Math.max(Number((current - 0.25).toFixed(2)), 1));
  };
   useEffect(() => {
    if (!selectedImage) {
      return;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseImage();
      }
      if (event.key === "+" || event.key === "=") {
        handleZoomIn();
      }
      if (event.key === "-") {
        handleZoomOut();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);
   const handleFavorite =
    async () => {
      if (!content) {
        return;
      }
      try {
        await toggleFavorite(folderId, type, contentId);
      } catch (error) {
        console.error("Toggle favorite error:", error);
      }
    };
   const handleDelete =
    async () => {
      const confirmed = await confirmDialog({
        title: `حذف «${content?.title || ""}»؟`,
        message: "این عمل قابل بازگشت نیست.",
        confirmText: "بله، حذف کن",
        cancelText: "انصراف",
      });
      if (!confirmed) {
        return;
      }
      try {
        const deleteContent = useMaddahStore.getState().deleteContent;
        await deleteContent(folderId, type, contentId);
        showToast(`«${content?.title || "محتوا"}» حذف شد.`, "success");
        navigate(`/folder/${folderId}/${type}`);
      } catch (error) {
        console.error("Delete error:", error);
        showToast("حذف محتوا انجام نشد.", "error");
      }
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
          <p className="mt-2 text-sm text-slate-500">
            {" "}
            ممکن است این محتوا حذف شده باشد.{" "}
          </p>{" "}
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
   const attachments =
    content.attachments || [];
  const imageFiles = attachments
    .map((file, index) => ({ file, index }))
    .filter(
      ({ file }) =>
        file.mimeType?.startsWith("image/") || file.type?.startsWith("image/"),
    );
  const audioFiles = attachments
    .map((file, index) => ({ file, index }))
    .filter(
      ({ file }) =>
        file.mimeType?.startsWith("audio/") || file.type?.startsWith("audio/"),
    );
  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 pb-24 text-white">
      {performance && (
        <PerformanceMode
          title={content.title}
          images={imageFiles.map(({ file, index }) => ({ src: fileUrls[index], name: file.name || "تصویر" })).filter((item) => item.src)}
          onClose={() => setPerformance(false)}
        />
      )}
      {" "}
      {" "}
      <header className="border-b border-white/10 bg-slate-900">
        {" "}
        <div className="mx-auto max-w-4xl px-5 py-5">
          {" "}
          <div className="flex items-center justify-between gap-4">
            {" "}
            {" "}
            <div className="flex min-w-0 items-center gap-3">
              {" "}
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl transition hover:bg-white/10"
                title="بازگشت"
              >
                {" "}
                <HiOutlineArrowRight />{" "}
              </button>{" "}
              <div className="min-w-0">
                {" "}
                <h1 className="truncate text-xl font-black">
                  {" "}
                  {content.title}{" "}
                </h1>{" "}
                <p className="mt-1 text-sm text-slate-500">
                  {" "}
                  {pageTitle}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            {" "}
            <div className="flex shrink-0 gap-2">
              {" "}
              {" "}
              <button
                type="button"
                onClick={handleFavorite}
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${content.isFavorite ? "bg-red-500/15 text-red-400" : "bg-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-400"}`}
                title={
                  content.isFavorite
                    ? "حذف از علاقه‌مندی‌ها"
                    : "افزودن به علاقه‌مندی‌ها"
                }
              >
                {" "}
                <HiOutlineHeart
                  className={`text-xl ${content.isFavorite ? "fill-current" : ""}`}
                />{" "}
              </button>{" "}
              {" "}
              <button
                type="button"
                onClick={() => {
                  setPerformance(true);
                }}
                disabled={loadingFiles}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-xl text-amber-400 transition hover:bg-amber-500/10"
                title="حالت اجرا"
              >
                <HiOutlineArrowsPointingOut />
              </button>{" "}
              {" "}
              <button
                type="button"
                onClick={() =>
                  navigate(`/folder/${folderId}/${type}/${contentId}/edit`)
                }
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-blue-400 transition hover:bg-blue-500/10"
                title="ویرایش"
              >
                {" "}
                <HiOutlinePencilSquare className="text-xl" />{" "}
              </button>{" "}
              {" "}
              <button
                type="button"
                onClick={handleDelete}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-red-400 transition hover:bg-red-500/10"
                title="حذف"
              >
                {" "}
                <HiOutlineTrash className="text-xl" />{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </header>{" "}
      {" "}
      <main className="mx-auto max-w-4xl px-5 py-8 pb-32">
        {" "}
        {" "}
        <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          {" "}
          <div className="flex items-center gap-4">
            {" "}
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${colors.bg}`}
            >
              {" "}
              <HiOutlineDocumentText
                className={`text-3xl ${colors.text}`}
              />{" "}
            </div>{" "}
            <div className="min-w-0 flex-1">
              {" "}
              <p className="text-sm text-slate-500"> {pageTitle} </p>{" "}
              <h2 className="mt-1 truncate text-2xl font-black">
                {" "}
                {content.title}{" "}
              </h2>{" "}
              {content.isFavorite && (
                <div className="mt-2 flex items-center gap-1 text-xs font-bold text-red-400">
                  {" "}
                  <HiOutlineHeart className="text-sm fill-current" />{" "}
                  <span> در علاقه‌مندی‌ها </span>{" "}
                </div>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        {" "}
        {loadingFiles && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-8 text-center">
            {" "}
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-amber-500" />{" "}
            <p className="mt-4 text-sm text-slate-500">
              {" "}
              در حال بارگذاری فایل‌ها...{" "}
            </p>{" "}
          </div>
        )}{" "}
        {" "}
        {!loadingFiles && imageFiles.length > 0 && (
          <section className="mt-6">
            {" "}
            <div className="mb-3 flex items-center gap-2">
              {" "}
              <HiOutlinePhoto className="text-xl text-blue-400" />{" "}
              <h2 className="font-black"> تصاویر </h2>{" "}
              <span className="text-xs text-slate-600">
                {" "}
                برای بزرگنمایی کلیک کنید{" "}
              </span>{" "}
            </div>{" "}
            <div className="grid gap-4 sm:grid-cols-2">
              {" "}
              {imageFiles.map(({ file, index }) => {
                const src = fileUrls[index];
                return (
                  <div
                    key={`${file.path || file.name}-${index}`}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900"
                  >
                    {" "}
                    {src ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenImage(src, file.name || "تصویر")
                        }
                        className="group relative block w-full cursor-zoom-in"
                      >
                        {" "}
                        <img
                          src={src}
                          alt={file.name || "تصویر"}
                          className="h-auto max-h-[500px] w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                        />{" "}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                          {" "}
                          <div className="rounded-full bg-black/60 px-4 py-2 text-sm font-bold opacity-0 transition group-hover:opacity-100">
                            {" "}
                            🔍 مشاهده بزرگ{" "}
                          </div>{" "}
                        </div>{" "}
                      </button>
                    ) : (
                      <div className="flex h-64 items-center justify-center text-sm text-slate-600">
                        {" "}
                        تصویر قابل نمایش نیست{" "}
                      </div>
                    )}{" "}
                    <div className="p-4">
                      {" "}
                      <p className="truncate text-sm font-bold">
                        {" "}
                        {file.name || "تصویر"}{" "}
                      </p>{" "}
                    </div>{" "}
                  </div>
                );
              })}{" "}
            </div>{" "}
          </section>
        )}{" "}
        {" "}
        {!loadingFiles && audioFiles.length > 0 && (
          <section className="mt-6">
            {" "}
            <div className="mb-3 flex items-center gap-2">
              {" "}
              <HiOutlineMusicalNote className="text-xl text-green-400" />{" "}
              <h2 className="font-black"> فایل‌های صوتی </h2>{" "}
            </div>{" "}
            <div className="space-y-4">
              {" "}
              {audioFiles.map(({ file, index }) => {
                const src = fileUrls[index];
                return (
                  <div key={`${file.path || file.name}-${index}`}>
                    {" "}
                    {src ? (
                      <AudioPlayer
                        src={src}
                        title={file.name || content.title || "فایل صوتی"}
                      />
                    ) : (
                      <div className="rounded-3xl border border-red-500/10 bg-slate-900 p-5">
                        {" "}
                        <div className="flex items-center gap-3">
                          {" "}
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                            {" "}
                            <HiOutlineMusicalNote className="text-2xl text-red-400" />{" "}
                          </div>{" "}
                          <div>
                            {" "}
                            <p className="font-bold">
                              {" "}
                              {file.name || "فایل صوتی"}{" "}
                            </p>{" "}
                            <p className="mt-1 text-sm text-red-400">
                              {" "}
                              فایل صوتی قابل پخش نیست.{" "}
                            </p>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>
                    )}{" "}
                  </div>
                );
              })}{" "}
            </div>{" "}
          </section>
        )}{" "}
        {" "}
        {!loadingFiles && attachments.length === 0 && (
          <section className="mt-6 rounded-3xl border border-dashed border-white/10 bg-slate-900 p-10 text-center">
            {" "}
            <HiOutlineDocumentText className="mx-auto text-5xl text-slate-700" />{" "}
            <h2 className="mt-4 text-lg font-bold">
              {" "}
              فایلی برای این محتوا وجود ندارد{" "}
            </h2>{" "}
            <p className="mt-2 text-sm text-slate-500">
              {" "}
              برای اضافه کردن عکس یا صوت، محتوا را ویرایش کنید.{" "}
            </p>{" "}
            <button
              type="button"
              onClick={() =>
                navigate(`/folder/${folderId}/${type}/${contentId}/edit`)
              }
              className="mt-5 rounded-2xl bg-amber-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-400"
            >
              {" "}
              ویرایش محتوا{" "}
            </button>{" "}
          </section>
        )}{" "}
      </main>{" "}
      {" "}
      {selectedImage && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4"
          onClick={handleCloseImage}
        >
          {" "}
          {" "}
          <div
            className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            {" "}
            <div className="min-w-0 rounded-2xl bg-white/10 px-4 py-2 backdrop-blur-md">
              {" "}
              <p className="max-w-[220px] truncate text-sm font-bold text-white sm:max-w-md">
                {" "}
                {selectedImage.name}{" "}
              </p>{" "}
            </div>{" "}
            <button
              type="button"
              onClick={handleCloseImage}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl text-white backdrop-blur-md transition hover:bg-red-500"
              title="بستن"
            >
              {" "}
              <HiOutlineXMark />{" "}
            </button>{" "}
          </div>{" "}
          {" "}
          <div
            className="flex h-full w-full items-center justify-center overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            {" "}
            <img
              src={selectedImage.src}
              alt={selectedImage.name}
              style={{ transform: `scale(${zoom})` }}
              className="max-h-[82vh] max-w-[95vw] select-none object-contain transition-transform duration-200"
            />{" "}
          </div>{" "}
          {" "}
          <div
            className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/90 p-2 shadow-2xl backdrop-blur-md"
            onClick={(event) => event.stopPropagation()}
          >
            {" "}
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-xl text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              title="کوچک کردن"
            >
              {" "}
              <HiOutlineMinus />{" "}
            </button>{" "}
            <div className="min-w-[60px] text-center text-sm font-black text-amber-400">
              {" "}
              {Math.round(zoom * 100)} %{" "}
            </div>{" "}
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-xl text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-30"
              title="بزرگ کردن"
            >
              {" "}
              <HiOutlinePlus />{" "}
            </button>{" "}
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="rounded-xl bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10"
            >
              {" "}
              ۱۰۰٪{" "}
            </button>{" "}
          </div>{" "}
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-600">
            {" "}
            برای بستن روی فضای بیرون تصویر کلیک کنید{" "}
          </p>{" "}
        </div>
      )}{" "}
    </div>
  );
}
export default ContentDetails;
