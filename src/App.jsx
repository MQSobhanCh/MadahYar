import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import AppRouter from "./AppRouter";
import BottomNav from "./components/BottomNav";
import ConfirmDialog from "./components/ConfirmDialog/ConfirmDialog";
import Toast from "./components/Toast/Toast";
import useMaddahStore from "./store/useMaddahStore";

function AppContent() {
  const location = useLocation();

  const isFormPage =
    location.pathname.includes("/add") || location.pathname.includes("/edit");
  const isSplashPage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-slate-950">
      <AppRouter />
      {!isFormPage && !isSplashPage && <BottomNav />}
      <Toast />
      <ConfirmDialog />
    </div>
  );
}

function App() {
  const initialize = useMaddahStore((state) => state.initialize);
  const loading = useMaddahStore((state) => state.loading);
  const initialized = useMaddahStore((state) => state.initialized);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading || !initialized) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-950 text-white"
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-amber-500" />
          <p className="mt-5 text-sm font-bold text-slate-400">
            در حال بارگذاری مداح‌یار...
          </p>
        </div>
      </div>
    );
  }

  return <AppContent />;
}

export default App;
