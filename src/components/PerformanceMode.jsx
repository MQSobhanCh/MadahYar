import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";

function PerformanceMode({ images, title, onClose }) {
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    let lock = null;
    let released = false;

    const requestLock = async () => {
      try {
        if (navigator.wakeLock && !released) {
          lock = await navigator.wakeLock.request("screen");
        }
      } catch (error) {
        console.error("Wake lock error:", error);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        requestLock();
      }
    };

    requestLock();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      released = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      lock?.release?.().catch(() => {});
    };
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[400] overflow-y-auto bg-black"
      onClick={() => setShowControls((current) => !current)}
    >
      {showControls && (
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-black/80 px-4 py-3 backdrop-blur">
          <p className="truncate text-sm font-black text-amber-400">{title}</p>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl text-white"
            title="خروج"
          >
            <HiOutlineXMark />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-3xl pb-16">
        {images.map((image, index) => (
          <div key={`${image.name}-${index}`}>
            {image.heading && (
              <div className="bg-slate-900 px-4 py-3 text-center text-sm font-black text-amber-400">
                {image.heading}
              </div>
            )}
            <img
              src={image.src}
              alt={image.name}
              className="block h-auto w-full select-none"
            />
          </div>
        ))}
      </div>

      {showControls && (
        <p className="pointer-events-none fixed bottom-3 left-0 right-0 text-center text-[11px] text-slate-600">
          برای پنهان یا نمایان شدن نوار بالا، روی صفحه بزن
        </p>
      )}
    </div>
  );
}

export default PerformanceMode;
