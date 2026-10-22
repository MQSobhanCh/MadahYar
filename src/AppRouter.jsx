import { Route, Routes } from "react-router-dom";

import AddContent from "./pages/AddContent";
import ContentDetails from "./pages/ContentDetails";
import EditContent from "./pages/EditContent";
import Favorites from "./pages/Favorites";
import FolderDetails from "./pages/FolderDetails";
import Home from "./pages/Home";
import SetlistDetail from "./pages/SetlistDetail";
import Setlists from "./pages/Setlists";
import Settings from "./pages/Settings";
import Splash from "./pages/Splash";

function NotFound() {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white"
    >
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10">
          <span className="text-3xl">!</span>
        </div>

        <h1 className="mt-5 text-6xl font-black text-amber-500">404</h1>
        <h2 className="mt-4 text-2xl font-black">صفحه پیدا نشد</h2>
        <p className="mt-2 text-sm text-slate-500">آدرس وارد شده وجود ندارد.</p>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/home";
          }}
          className="mt-6 rounded-2xl bg-amber-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-400"
        >
          بازگشت به خانه
        </button>
      </div>
    </div>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/home" element={<Home />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/setlists" element={<Setlists />} />
      <Route path="/setlists/:setlistId" element={<SetlistDetail />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/folder/:folderId" element={<FolderDetails />} />
      <Route path="/folder/:folderId/:type" element={<FolderDetails />} />
      <Route path="/folder/:folderId/:type/add" element={<AddContent />} />
      <Route
        path="/folder/:folderId/:type/:contentId"
        element={<ContentDetails />}
      />
      <Route
        path="/folder/:folderId/:type/:contentId/edit"
        element={<EditContent />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
