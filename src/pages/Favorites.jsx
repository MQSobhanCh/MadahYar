import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineMusicalNote,
  HiOutlineDocumentText,
  HiOutlineBookOpen,
  HiOutlineArrowLeft,
  HiOutlineTrash,
} from "react-icons/hi2";
import useMaddahStore from "../store/useMaddahStore";
const typeInfo = {
  noheh: {
    title: "نوحه",
    icon: HiOutlineMusicalNote,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/10",
  },
  sher: {
    title: "شعر",
    icon: HiOutlineBookOpen,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/10",
  },
  roozeh: {
    title: "روضه",
    icon: HiOutlineDocumentText,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/10",
  },
};
function Favorites() {
  const navigate = useNavigate();
  const folders = useMaddahStore((state) => state.folders);
  const toggleFavorite = useMaddahStore((state) => state.toggleFavorite);
   const favorites =
    useMemo(() => {
      const result = [];
      folders.forEach((folder) => {
        const contents = folder.contents || {};
        Object.entries(contents).forEach(([type, items]) => {
          if (!Array.isArray(items)) {
            return;
          }
          items.forEach((item) => {
            if (item.isFavorite) {
              result.push({
                ...item,
                folderId: folder.id,
                folderName: folder.name,
                type,
              });
            }
          });
        });
      });
      return result;
    }, [folders]);
   const handleRemoveFavorite =
    async (item) => {
      try {
        await toggleFavorite(item.folderId, item.type, item.id);
      } catch (error) {
        console.error("Remove favorite error:", error);
      }
    };
   const handleOpen =
    (item) => {
      navigate(`/folder/${item.folderId}/${item.type}/${item.id}`);
    };
   const nohehCount =
    favorites.filter((item) => item.type === "noheh").length;
  const sherCount = favorites.filter((item) => item.type === "sher").length;
  const roozehCount = favorites.filter((item) => item.type === "roozeh").length;
  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 pb-32 text-white">
      {" "}
      {" "}
      <header className="border-b border-white/10 bg-slate-900">
        {" "}
        <div className="mx-auto max-w-5xl px-5 py-6">
          {" "}
          <div className="flex items-center justify-between gap-4">
            {" "}
            <div className="flex items-center gap-4">
              {" "}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                {" "}
                <HiOutlineHeart className="text-3xl text-red-400" />{" "}
              </div>{" "}
              <div>
                {" "}
                <h1 className="text-2xl font-black"> علاقه‌مندی‌ها </h1>{" "}
                <p className="mt-1 text-sm text-slate-500">
                  {" "}
                  محتواهایی که ذخیره کرده‌ای{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              {" "}
              <div className="text-2xl font-black text-amber-400">
                {" "}
                {favorites.length}{" "}
              </div>{" "}
              <div className="text-[10px] font-bold text-slate-500">
                {" "}
                مورد{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </header>{" "}
      <main className="mx-auto max-w-5xl px-5 py-6">
        {" "}
        {" "}
        {favorites.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            {" "}
            <div className="rounded-2xl border border-green-500/10 bg-green-500/5 p-4">
              {" "}
              <div className="text-xl font-black text-green-400">
                {" "}
                {nohehCount}{" "}
              </div>{" "}
              <div className="mt-1 text-xs font-bold text-slate-500">
                {" "}
                نوحه{" "}
              </div>{" "}
            </div>{" "}
            <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-4">
              {" "}
              <div className="text-xl font-black text-blue-400">
                {" "}
                {sherCount}{" "}
              </div>{" "}
              <div className="mt-1 text-xs font-bold text-slate-500">
                {" "}
                شعر{" "}
              </div>{" "}
            </div>{" "}
            <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-4">
              {" "}
              <div className="text-xl font-black text-red-400">
                {" "}
                {roozehCount}{" "}
              </div>{" "}
              <div className="mt-1 text-xs font-bold text-slate-500">
                {" "}
                روضه{" "}
              </div>{" "}
            </div>{" "}
          </div>
        )}{" "}
        {" "}
        {favorites.length === 0 && (
          <div className="flex min-h-[55vh] items-center justify-center">
            {" "}
            <div className="max-w-md text-center">
              {" "}
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-red-500/10">
                {" "}
                <HiOutlineHeart className="text-5xl text-red-400" />{" "}
              </div>{" "}
              <h2 className="mt-6 text-2xl font-black">
                {" "}
                هنوز چیزی ذخیره نکرده‌ای{" "}
              </h2>{" "}
              <p className="mt-3 text-sm leading-7 text-slate-500">
                {" "}
                روی علامت ❤️ کنار هر نوحه، شعر یا روضه بزن تا اینجا ذخیره شود و
                سریع به آن دسترسی داشته باشی.{" "}
              </p>{" "}
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-400 active:scale-95"
              >
                {" "}
                رفتن به خانه <HiOutlineArrowLeft />{" "}
              </button>{" "}
            </div>{" "}
          </div>
        )}{" "}
        {" "}
        {favorites.length > 0 && (
          <div className="space-y-4">
            {" "}
            {favorites.map((item) => {
              const info = typeInfo[item.type] || typeInfo.noheh;
              const Icon = info.icon;
              return (
                <article
                  key={`${item.folderId}-${item.type}-${item.id}`}
                  className={`group overflow-hidden rounded-3xl border ${info.border} bg-slate-900 transition hover:border-white/10`}
                >
                  {" "}
                  <div className="flex items-center gap-4 p-4 sm:p-5">
                    {" "}
                    {" "}
                    <button
                      type="button"
                      onClick={() => handleOpen(item)}
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${info.bg} transition group-hover:scale-105`}
                    >
                      {" "}
                      <Icon className={`text-2xl ${info.color}`} />{" "}
                    </button>{" "}
                    {" "}
                    <button
                      type="button"
                      onClick={() => handleOpen(item)}
                      className="min-w-0 flex-1 text-right"
                    >
                      {" "}
                      <div className="flex flex-wrap items-center gap-2">
                        {" "}
                        <span
                          className={`rounded-lg px-2 py-1 text-[10px] font-black ${info.bg} ${info.color}`}
                        >
                          {" "}
                          {info.title}{" "}
                        </span>{" "}
                        <span className="text-[10px] text-slate-600">
                          {" "}
                          {item.folderName}{" "}
                        </span>{" "}
                      </div>{" "}
                      <h2 className="mt-2 truncate text-base font-black text-white sm:text-lg">
                        {" "}
                        {item.title || "بدون عنوان"}{" "}
                      </h2>{" "}
                      {item.createdAt && (
                        <p className="mt-1 text-[11px] text-slate-600">
                          {" "}
                          ذخیره شده در{" "}
                          {new Date(item.createdAt).toLocaleDateString(
                            "fa-IR",
                          )}{" "}
                        </p>
                      )}{" "}
                    </button>{" "}
                    {" "}
                    <button
                      type="button"
                      onClick={() => handleRemoveFavorite(item)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                      title="حذف از علاقه‌مندی‌ها"
                    >
                      {" "}
                      <HiOutlineHeart className="text-xl fill-current" />{" "}
                    </button>{" "}
                    {" "}
                    <button
                      type="button"
                      onClick={() => handleOpen(item)}
                      className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-500 transition hover:bg-white/10 hover:text-white sm:flex"
                      title="مشاهده"
                    >
                      {" "}
                      <HiOutlineArrowLeft className="text-xl" />{" "}
                    </button>{" "}
                  </div>{" "}
                </article>
              );
            })}{" "}
          </div>
        )}{" "}
        {" "}
        {favorites.length > 0 && (
          <div className="mt-8 rounded-3xl border border-white/5 bg-white/[0.02] p-5 text-center">
            {" "}
            <HiOutlineHeart className="mx-auto text-2xl text-red-400/60" />{" "}
            <p className="mt-2 text-xs text-slate-600">
              {" "}
              علاقه‌مندی‌های شما روی همین دستگاه ذخیره می‌شوند.{" "}
            </p>{" "}
          </div>
        )}{" "}
      </main>{" "}
    </div>
  );
}
export default Favorites;
