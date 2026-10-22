import { NavLink } from "react-router-dom";

import {
  HiOutlineHome,
  HiOutlineHeart,
  HiOutlineCog6Tooth,
  HiOutlineQueueList,
} from "react-icons/hi2";

const navItems = [
  {
    to: "/home",
    label: "خانه",
    icon: HiOutlineHome,
  },

  {
    to: "/setlists",
    label: "لیست اجرا",
    icon: HiOutlineQueueList,
  },

  {
    to: "/favorites",
    label: "علاقه‌مندی",
    icon: HiOutlineHeart,
  },

  {
    to: "/settings",
    label: "تنظیمات",
    icon: HiOutlineCog6Tooth,
  },
];

function BottomNav() {
  return (
    <nav
      dir="rtl"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-900/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-2xl backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto flex max-w-xl items-center justify-around py-2">
        {navItems.map(({ to, label, icon: Icon }, index) => (
          <NavLink
            key={`${label}-${index}`}
            to={to}
            className={({ isActive }) =>
              `group flex min-w-[64px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-bold transition ${
                isActive
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`text-2xl transition ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`}
                />

                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
