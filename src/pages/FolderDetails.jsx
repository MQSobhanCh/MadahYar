import { useNavigate, useParams } from "react-router-dom";

import {
  HiOutlineArrowRight,
  HiOutlineFolder,
  HiOutlinePlus,
  HiOutlineMusicalNote,
  HiOutlineDocumentText,
  HiOutlineHeart,
  HiOutlineChevronLeft,
} from "react-icons/hi2";

import useMaddahStore from "../store/useMaddahStore";

const typeDescriptions = {
  noheh: "نوحه‌های این پوشه",
  sher: "شعرهای این پوشه",
  roozeh: "روضه‌های این پوشه",
};

const typeIcons = {
  noheh: HiOutlineMusicalNote,
  sher: HiOutlineDocumentText,
  roozeh: HiOutlineHeart,
};

const typeColors = {
  noheh: {
    text: "text-green-400",
    bg: "bg-green-500/10",
    hover: "hover:border-green-500/40",
  },
  sher: {
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    hover: "hover:border-blue-500/40",
  },
  roozeh: {
    text: "text-red-400",
    bg: "bg-red-500/10",
    hover: "hover:border-red-500/40",
  },
};

function FolderDetails() {
  const navigate = useNavigate();

  const { folderId } = useParams();

  const folder = useMaddahStore((state) => state.getFolderById(folderId));

  const toggleFavorite = useMaddahStore((state) => state.toggleFavorite);

  if (!folder) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white"
      >
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10">
            <HiOutlineFolder className="text-4xl text-red-400" />
          </div>

          <h1 className="mt-5 text-2xl font-black">پوشه پیدا نشد</h1>

          <p className="mt-2 text-sm text-slate-500">
            ممکن است این پوشه حذف شده باشد.
          </p>

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="mt-6 rounded-2xl bg-amber-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-400"
          >
            بازگشت به خانه
          </button>
        </div>
      </div>
    );
  }

  const contents = folder.contents || {};

  const sections = [
    {
      type: "noheh",
      title: "نوحه",
      description: typeDescriptions.noheh,
      icon: typeIcons.noheh,
      colors: typeColors.noheh,
      items: contents.noheh || [],
    },
    {
      type: "sher",
      title: "شعر",
      description: typeDescriptions.sher,
      icon: typeIcons.sher,
      colors: typeColors.sher,
      items: contents.sher || [],
    },
    {
      type: "roozeh",
      title: "روضه",
      description: typeDescriptions.roozeh,
      icon: typeIcons.roozeh,
      colors: typeColors.roozeh,
      items: contents.roozeh || [],
    },
  ];

  const totalContents =
    (contents.noheh?.length || 0) +
    (contents.sher?.length || 0) +
    (contents.roozeh?.length || 0);

  const handleFavorite = async (event, item, type) => {
    event.stopPropagation();

    try {
      await toggleFavorite(folderId, type, item.id);
    } catch (error) {
      console.error("Toggle favorite error:", error);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 pb-24 text-white">

      <header className="border-b border-white/10 bg-slate-900">
        <div className="mx-auto max-w-5xl px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl transition hover:bg-white/10"
              >
                <HiOutlineArrowRight />
              </button>

              <div className="flex min-w-0 items-center gap-3">
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 sm:flex">
                  <HiOutlineFolder className="text-2xl text-amber-400" />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-xl font-black">{folder.name}</h1>

                  <p className="mt-1 text-sm text-slate-500">
                    {totalContents} محتوا
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/home")}
              className="hidden rounded-xl bg-white/5 px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 sm:block"
            >
              خانه
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">

        <section className="mb-7 overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10">
                <HiOutlineFolder className="text-3xl text-amber-400" />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-slate-500">پوشه</p>

                <h2 className="mt-1 truncate text-2xl font-black">
                  {folder.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  نوحه، شعر و روضه‌های خودت را اینجا مدیریت کن.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10">
            <div className="p-4 text-center">
              <div className="text-xl font-black text-green-400">
                {contents.noheh?.length || 0}
              </div>

              <div className="mt-1 text-xs text-slate-500">نوحه</div>
            </div>

            <div className="border-x border-white/10 p-4 text-center">
              <div className="text-xl font-black text-blue-400">
                {contents.sher?.length || 0}
              </div>

              <div className="mt-1 text-xs text-slate-500">شعر</div>
            </div>

            <div className="p-4 text-center">
              <div className="text-xl font-black text-red-400">
                {contents.roozeh?.length || 0}
              </div>

              <div className="mt-1 text-xs text-slate-500">روضه</div>
            </div>
          </div>
        </section>

        <div className="space-y-5">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <section
                key={section.type}
                className="rounded-3xl border border-white/10 bg-slate-900 p-5"
              >

                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${section.colors.bg}`}
                    >
                      <Icon className={`text-2xl ${section.colors.text}`} />
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-black">{section.title}</h2>

                      <p className="mt-1 text-xs text-slate-500">
                        {section.items.length} مورد
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/folder/${folderId}/${section.type}/add`)
                    }
                    className={`flex h-11 shrink-0 items-center gap-2 rounded-xl ${section.colors.bg} px-4 ${section.colors.text} transition ${section.colors.hover}`}
                  >
                    <HiOutlinePlus className="text-xl" />

                    <span className="hidden text-sm font-bold sm:block">
                      افزودن
                    </span>
                  </button>
                </div>

                {section.items.length === 0 ? (
                  <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-slate-950 p-7 text-center">
                    <Icon
                      className={`mx-auto text-4xl ${section.colors.text} opacity-40`}
                    />

                    <h3 className="mt-3 text-sm font-bold text-slate-300">
                      هنوز {section.title}ای اضافه نشده
                    </h3>

                    <p className="mt-2 text-xs text-slate-600">
                      برای شروع، یک {section.title} جدید اضافه کن.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/folder/${folderId}/${section.type}/add`)
                      }
                      className={`mt-4 rounded-xl ${section.colors.bg} px-4 py-2 text-sm font-bold ${section.colors.text}`}
                    >
                      افزودن {section.title}
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 space-y-2">
                    {section.items.map((item) => {
                      const attachmentCount = item.attachments?.length || 0;

                      return (
                        <div
                          key={item.id}
                          className="flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-slate-950 p-4 transition hover:border-white/10 hover:bg-slate-800"
                        >

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/folder/${folderId}/${section.type}/${item.id}`,
                              )
                            }
                            className="group flex min-w-0 flex-1 items-center gap-3 text-right"
                          >
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${section.colors.bg}`}
                            >
                              <Icon
                                className={`text-xl ${section.colors.text}`}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-sm font-bold text-white">
                                {item.title}
                              </h3>

                              <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                                <span>{attachmentCount} فایل</span>

                                {item.updatedAt && (
                                  <>
                                    <span>•</span>

                                    <span>
                                      {new Date(
                                        item.updatedAt,
                                      ).toLocaleDateString("fa-IR")}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            <HiOutlineChevronLeft className="shrink-0 text-xl text-slate-700 transition group-hover:text-amber-400" />
                          </button>

                          <button
                            type="button"
                            aria-label={
                              item.isFavorite
                                ? "حذف از علاقه‌مندی‌ها"
                                : "افزودن به علاقه‌مندی‌ها"
                            }
                            title={
                              item.isFavorite
                                ? "حذف از علاقه‌مندی‌ها"
                                : "افزودن به علاقه‌مندی‌ها"
                            }
                            onClick={(event) =>
                              handleFavorite(event, item, section.type)
                            }
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                              item.isFavorite
                                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                : "bg-white/5 text-slate-600 hover:bg-red-500/10 hover:text-red-400"
                            }`}
                          >
                            <HiOutlineHeart
                              className={`text-xl transition ${
                                item.isFavorite ? "scale-110 fill-current" : ""
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default FolderDetails;
