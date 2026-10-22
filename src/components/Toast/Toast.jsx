import { useEffect } from "react";

import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineXCircle,
  HiOutlineXMark,
} from "react-icons/hi2";

import useUIStore from "../../store/useUIStore";

const toastConfig = {
  success: {
    icon: HiOutlineCheckCircle,
    iconClass: "text-green-400",
    bgClass: "border-green-500/20 bg-green-500/10",
    title: "موفق",
  },

  error: {
    icon: HiOutlineXCircle,
    iconClass: "text-red-400",
    bgClass: "border-red-500/20 bg-red-500/10",
    title: "خطا",
  },

  warning: {
    icon: HiOutlineExclamationCircle,
    iconClass: "text-amber-400",
    bgClass: "border-amber-500/20 bg-amber-500/10",
    title: "توجه",
  },

  info: {
    icon: HiOutlineInformationCircle,
    iconClass: "text-blue-400",
    bgClass: "border-blue-500/20 bg-blue-500/10",
    title: "اطلاع",
  },
};

function Toast() {
  const { message, type } = useUIStore((state) => state.toast);
  const hideToast = useUIStore((state) => state.hideToast);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      hideToast();
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, [message, hideToast]);

  if (!message) {
    return null;
  }

  const config = toastConfig[type] || toastConfig.info;

  const Icon = config.icon;

  return (
    <>
      <div
        dir="rtl"
        className={`maddahyar-toast fixed bottom-5 right-5 z-[9999] flex w-[calc(100%-40px)] max-w-sm items-center gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${config.bgClass}`}
        role="alert"
      >
        <Icon className={`shrink-0 text-2xl ${config.iconClass}`} />

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-400">{config.title}</p>

          <p className="mt-1 text-sm font-bold leading-6 text-white">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={hideToast}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/10 hover:text-white"
          aria-label="بستن"
        >
          <HiOutlineXMark className="text-xl" />
        </button>
      </div>

      <style>{`
        @keyframes maddahyar-toast-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .maddahyar-toast {
          animation: maddahyar-toast-in 0.25s ease-out;
        }
      `}</style>
    </>
  );
}

export default Toast;
