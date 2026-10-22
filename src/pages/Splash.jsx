import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import splashLogo from "../assets/logo-icon.png.png";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 text-white"
    >

      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-yellow-500/5 blur-3xl" />
      </div>

      <main className="relative z-10 flex flex-col items-center px-6 text-center">

        <div className="animate-[logoIn_1s_ease-out]">
          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-amber-500/20 blur-2xl" />

            <img
              src={splashLogo}
              alt="مداح‌یار"
              className="relative h-40 w-40 object-contain sm:h-48 sm:w-48"
            />
          </div>
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-tight text-amber-400 sm:text-5xl">
          مداح‌یار
        </h1>

        <p className="mt-3 text-sm text-slate-500 sm:text-base">
          همراه همیشگی مداحان
        </p>

        <div className="mt-10 flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />

          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500 [animation-delay:200ms]" />

          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500 [animation-delay:400ms]" />
        </div>
      </main>

      <div className="absolute bottom-8 left-0 right-0 z-10 text-center">
        <p className="text-xs text-slate-700">کتابخانه شخصی نوحه، شعر و روضه</p>
      </div>

      <style>{`
        @keyframes logoIn {
          0% {
            opacity: 0;
            transform: scale(0.75) translateY(20px);
          }

          60% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
          }

          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Splash;
