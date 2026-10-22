import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineChevronLeft,
  HiOutlineEnvelope,
  HiOutlineShare,
  HiOutlineStar,
  HiOutlineTrash,
} from "react-icons/hi2";

import pkg from "../../package.json";
import {
  APP_NAME,
  BAZAAR_URL,
  MYKET_URL,
  SUPPORT_EMAIL,
  SUPPORT_TELEGRAM,
} from "../config/app";
import { clearStorage } from "../database/storage";
import useMaddahStore from "../store/useMaddahStore";
import useUIStore from "../store/useUIStore";
import { deleteStoredFile } from "../utils/fileStorage";

const STORE_URL = BAZAAR_URL || MYKET_URL;

function Row({ icon: Icon, title, subtitle, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-right transition hover:bg-slate-800 active:scale-[0.99]"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${
          danger ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
        }`}
      >
        <Icon />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-black ${danger ? "text-red-400" : "text-white"}`}
        >
          {title}
        </span>
        {subtitle && (
          <span className="mt-0.5 block text-xs text-slate-500">{subtitle}</span>
        )}
      </span>

      <HiOutlineChevronLeft className="shrink-0 text-slate-600" />
    </button>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 px-1 text-xs font-black text-slate-500">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Settings() {
  const showToast = useUIStore((state) => state.showToast);
  const confirmDialog = useUIStore((state) => state.confirm);

  const handleClearData = async () => {
    const confirmed = await confirmDialog({
      title: "پاک کردن همه‌ی اطلاعات؟",
      message:
        "همه‌ی پوشه‌ها، محتواها و فایل‌های ذخیره‌شده از روی این گوشی پاک می‌شود. این کار قابل بازگشت نیست.",
      confirmText: "بله، همه را پاک کن",
      cancelText: "انصراف",
    });

    if (!confirmed) {
      return;
    }

    try {
      const folders = useMaddahStore.getState().folders;

      for (const folder of folders) {
        for (const items of Object.values(folder.contents || {})) {
          for (const item of items || []) {
            for (const file of item.attachments || []) {
              await deleteStoredFile(file?.path);
            }
          }
        }
      }

      clearStorage();
      useMaddahStore.setState({ folders: [] });

      showToast("همه‌ی اطلاعات پاک شد.", "success");
    } catch (error) {
      console.error("Clear data error:", error);
      showToast("پاک کردن اطلاعات انجام نشد.", "error");
    }
  };

  const handleShare = async () => {
    const text = `${APP_NAME} — برنامه‌ی مدیریت نوحه، شعر و روضه برای مداحان\n${STORE_URL}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: APP_NAME, text });
        return;
      }

      await navigator.clipboard.writeText(text);
      showToast("لینک برنامه کپی شد.", "success");
    } catch (error) {

      console.warn("Share cancelled:", error);
    }
  };

  const open = (url) => window.open(url, "_blank", "noopener");

  const hasContact = SUPPORT_TELEGRAM || SUPPORT_EMAIL || STORE_URL;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 pb-28 text-white">
      <header className="border-b border-white/10 bg-slate-900">
        <div className="mx-auto max-w-3xl px-5 py-5">
          <h1 className="text-xl font-black">تنظیمات</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-6">
        <Section title="اطلاعات">
          <Row
            icon={HiOutlineTrash}
            title="پاک کردن همه‌ی اطلاعات"
            subtitle="حذف پوشه‌ها، محتواها و فایل‌ها از این گوشی"
            onClick={handleClearData}
            danger
          />
        </Section>

        {hasContact && (
          <Section title="ارتباط با ما">
            {SUPPORT_TELEGRAM && (
              <Row
                icon={HiOutlineChatBubbleLeftRight}
                title="پشتیبانی در تلگرام"
                onClick={() => open(SUPPORT_TELEGRAM)}
              />
            )}
            {SUPPORT_EMAIL && (
              <Row
                icon={HiOutlineEnvelope}
                title="ارسال ایمیل"
                subtitle={SUPPORT_EMAIL}
                onClick={() => open(`mailto:${SUPPORT_EMAIL}`)}
              />
            )}
            {STORE_URL && (
              <>
                <Row
                  icon={HiOutlineStar}
                  title="امتیاز دادن به برنامه"
                  onClick={() => open(STORE_URL)}
                />
                <Row
                  icon={HiOutlineShare}
                  title="معرفی به دوستان"
                  onClick={handleShare}
                />
              </>
            )}
          </Section>
        )}

        <p className="mt-10 text-center text-xs text-slate-600">
          {APP_NAME} — نسخه {pkg.version}
        </p>
      </main>
    </div>
  );
}

export default Settings;
