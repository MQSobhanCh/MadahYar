import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineFolder,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineHeart,
} from "react-icons/hi2";
import useMaddahStore from "../store/useMaddahStore";
import useUIStore from "../store/useUIStore";
import logo from "../assets/logo.png.png";
function Home() {
  const navigate = useNavigate();
  const folders = useMaddahStore((state) => state.folders);
  const addFolder = useMaddahStore((state) => state.addFolder);
  const removeFolder = useMaddahStore((state) => state.removeFolder);
  const showToast = useUIStore((state) => state.showToast);
  const confirmDialog = useUIStore((state) => state.confirm);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  useEffect(() => {
    document.title = "مداح‌یار";
  }, []);
   const filteredFolders =
    useMemo(() => {
      const query = search.trim().toLowerCase();
      if (!query) {
        return folders;
      }
      return folders.filter((folder) =>
        String(folder.name || "")
          .toLowerCase()
          .includes(query),
      );
    }, [folders, search]);
   const handleAddFolder =
    async (event) => {
      event.preventDefault();
      const name = folderName.trim();
      if (!name) {
        return;
      }
      try {
        await addFolder(name);
        setFolderName("");
        setShowAddModal(false);
        showToast(`پوشه «${name}» ساخته شد.`, "success");
      } catch (error) {
        console.error("Add folder error:", error);
        showToast("ساخت پوشه انجام نشد.", "error");
      }
    };
   const handleDeleteFolder =
    async (event, folder) => {
      event.stopPropagation();
      const confirmed = await confirmDialog({
        title: `حذف پوشه «${folder.name}»؟`,
        message:
          "تمام محتویات این پوشه نیز حذف خواهد شد. این عمل قابل بازگشت نیست.",
        confirmText: "بله، حذف کن",
        cancelText: "انصراف",
      });
      if (!confirmed) {
        return;
      }
      try {
        await removeFolder(folder.id);
        showToast(`پوشه «${folder.name}» حذف شد.`, "success");
      } catch (error) {
        console.error("Delete folder error:", error);
        showToast("حذف پوشه انجام نشد.", "error");
      }
    };
   const getContentCount =
    (folder) => {
      const contents = folder.contents || {};
      return (
        (contents.noheh?.length || 0) +
        (contents.sher?.length || 0) +
        (contents.roozeh?.length || 0)
      );
    };
   return (
    <div dir="rtl" className="min-h-screen bg-slate-950 pb-32 text-white">
      {" "}
      {" "}
      <header className="border-b border-white/10 bg-slate-900/95">
        {" "}
        <div className="mx-auto max-w-6xl px-5 py-5">
          {" "}
          <div className="flex items-center justify-between gap-4">
            {" "}
            {" "}
            <div className="flex min-w-0 items-center gap-3">
              {" "}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-900">
                <img
                  src={logo}
                  alt="مداح یار"
                  className="h-full w-full object-contain"
                />
              </div>{" "}
              <div className="min-w-0">
                {" "}
                <h1 className="text-xl font-black sm:text-2xl">
                  {" "}
                  مداح‌یار{" "}
                </h1>{" "}
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {" "}
                  همراه همیشگی مداحان{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            {" "}
            <button
              type="button"
              onClick={() => navigate("/favorites")}
              className="flex h-11 shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 text-slate-300 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 sm:px-4"
            >
              {" "}
              <HiOutlineHeart className="text-xl" />{" "}
              <span className="hidden text-xs font-bold sm:block">
                {" "}
                علاقه‌مندی‌ها{" "}
              </span>{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </header>{" "}
      {" "}
      <main className="mx-auto max-w-6xl px-5 py-6">
        {" "}
        {" "}
        <section className="mb-6">
          {" "}
          <div className="flex items-center justify-between gap-4">
            {" "}
            <div>
              {" "}
              <h2 className="text-2xl font-black sm:text-3xl">
                {" "}
                پوشه‌های من{" "}
              </h2>{" "}
              <p className="mt-2 text-sm text-slate-500">
                {" "}
                نوحه‌ها، شعرها و روضه‌های خودت را مدیریت کن.{" "}
              </p>{" "}
            </div>{" "}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-amber-500 px-4 font-black text-slate-950 shadow-lg shadow-amber-500/10 transition hover:bg-amber-400 active:scale-95 sm:px-5"
            >
              {" "}
              <HiOutlinePlus className="text-xl" />{" "}
              <span className="hidden sm:block"> پوشه جدید </span>{" "}
            </button>{" "}
          </div>{" "}
        </section>{" "}
        {" "}
        {folders.length > 0 && (
          <div className="relative mb-6">
            {" "}
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-600" />{" "}
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جستجوی پوشه..."
              className="w-full rounded-2xl border border-white/10 bg-slate-900 py-4 pr-12 pl-5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10"
            />{" "}
          </div>
        )}{" "}
        {" "}
        {folders.length === 0 && (
          <div className="flex min-h-[55vh] items-center justify-center">
            {" "}
            <div className="max-w-md text-center">
              {" "}
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-amber-500/10">
                {" "}
                <HiOutlineFolder className="text-5xl text-amber-400" />{" "}
              </div>{" "}
              <h2 className="mt-6 text-2xl font-black"> هنوز پوشه‌ای نداری </h2>{" "}
              <p className="mt-3 text-sm leading-7 text-slate-500">
                {" "}
                برای شروع، اولین پوشه خودت را بساز و نوحه، شعر و روضه‌ها را داخل
                آن قرار بده.{" "}
              </p>{" "}
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 font-black text-slate-950 transition hover:bg-amber-400 active:scale-95"
              >
                {" "}
                <HiOutlinePlus className="text-xl" /> ساخت اولین پوشه{" "}
              </button>{" "}
            </div>{" "}
          </div>
        )}{" "}
        {" "}
        {folders.length > 0 && filteredFolders.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900 p-10 text-center">
            {" "}
            <HiOutlineMagnifyingGlass className="mx-auto text-5xl text-slate-700" />{" "}
            <h2 className="mt-4 text-lg font-black"> پوشه‌ای پیدا نشد </h2>{" "}
            <p className="mt-2 text-sm text-slate-500">
              {" "}
              عبارت جستجو را تغییر بده.{" "}
            </p>{" "}
          </div>
        )}{" "}
        {" "}
        {filteredFolders.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {" "}
            {filteredFolders.map((folder) => {
              const contentCount = getContentCount(folder);
              return (
                <article
                  key={folder.id}
                  onClick={() => navigate(`/folder/${folder.id}`)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-500/20 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-black/20"
                >
                  {" "}
                  {" "}
                  <div className="flex items-start justify-between gap-4">
                    {" "}
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 transition group-hover:bg-amber-500/15">
                      {" "}
                      <HiOutlineFolder className="text-3xl text-amber-400" />{" "}
                    </div>{" "}
                    <button
                      type="button"
                      onClick={(event) => handleDeleteFolder(event, folder)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-600 opacity-100 transition hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
                      title="حذف پوشه"
                    >
                      {" "}
                      <HiOutlineTrash className="text-lg" />{" "}
                    </button>{" "}
                  </div>{" "}
                  {" "}
                  <h3 className="mt-5 truncate text-lg font-black">
                    {" "}
                    {folder.name}{" "}
                  </h3>{" "}
                  {" "}
                  <div className="mt-3 flex items-center justify-between">
                    {" "}
                    <span className="text-xs text-slate-500">
                      {" "}
                      {contentCount === 0
                        ? "خالی"
                        : `${contentCount} محتوا`}{" "}
                    </span>{" "}
                    <span className="text-xs font-bold text-amber-400 opacity-0 transition group-hover:opacity-100">
                      {" "}
                      مشاهده ←{" "}
                    </span>{" "}
                  </div>{" "}
                  {" "}
                  <div className="mt-5 flex gap-2">
                    {" "}
                    <span className="rounded-xl bg-green-500/10 px-3 py-1.5 text-[10px] font-bold text-green-400">
                      {" "}
                      نوحه {folder.contents?.noheh?.length || 0}{" "}
                    </span>{" "}
                    <span className="rounded-xl bg-blue-500/10 px-3 py-1.5 text-[10px] font-bold text-blue-400">
                      {" "}
                      شعر {folder.contents?.sher?.length || 0}{" "}
                    </span>{" "}
                    <span className="rounded-xl bg-red-500/10 px-3 py-1.5 text-[10px] font-bold text-red-400">
                      {" "}
                      روضه {folder.contents?.roozeh?.length || 0}{" "}
                    </span>{" "}
                  </div>{" "}
                </article>
              );
            })}{" "}
          </div>
        )}{" "}
      </main>{" "}
      {" "}
      {showAddModal && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          {" "}
          <div
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {" "}
            <div className="flex items-center gap-3">
              {" "}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                {" "}
                <HiOutlineFolder className="text-2xl text-amber-400" />{" "}
              </div>{" "}
              <div>
                {" "}
                <h2 className="text-lg font-black"> ساخت پوشه جدید </h2>{" "}
                <p className="mt-1 text-xs text-slate-500">
                  {" "}
                  نام پوشه را وارد کن.{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <form onSubmit={handleAddFolder} className="mt-6">
              {" "}
              <input
                autoFocus
                type="text"
                value={folderName}
                onChange={(event) => setFolderName(event.target.value)}
                placeholder="مثلاً امام حسین"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10"
              />{" "}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {" "}
                <button
                  type="button"
                  onClick={() => {
                    setFolderName("");
                    setShowAddModal(false);
                  }}
                  className="rounded-2xl bg-white/5 px-5 py-3 font-bold text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  {" "}
                  انصراف{" "}
                </button>{" "}
                <button
                  type="submit"
                  disabled={!folderName.trim()}
                  className="rounded-2xl bg-amber-500 px-5 py-3 font-black text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {" "}
                  ساخت پوشه{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}
export default Home;
