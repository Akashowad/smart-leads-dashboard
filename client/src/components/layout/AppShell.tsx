import { Moon, Sun, LogOut, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => localStorage.getItem("smart-leads-theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("smart-leads-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-slate-50/50 text-ink transition-colors duration-300 dark:bg-[#090d16] dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-slate-800/40 dark:bg-[#0d1527]/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-md shadow-violet-500/20 ring-4 ring-violet-500/10">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <p className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-xs font-bold uppercase tracking-wider text-transparent dark:from-violet-400 dark:to-indigo-300">
                AI Powered CRM
              </p>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                Smart Leads <span className="hidden sm:inline text-slate-400 font-normal">Dashboard</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right text-sm md:block border-r border-slate-200/80 dark:border-slate-800/85 pr-4">
              <p className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</p>
              <p className="text-xs font-medium text-violet-600 dark:text-violet-400">{user?.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDark((value) => !value)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-700 shadow-sm transition-all hover:scale-105 hover:bg-slate-100 active:scale-95 dark:border-slate-850 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="Toggle dark mode"
              >
                {dark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-violet-500" />}
              </button>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md hover:shadow-slate-950/10 active:scale-95 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
              >
                <LogOut size={15} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};
