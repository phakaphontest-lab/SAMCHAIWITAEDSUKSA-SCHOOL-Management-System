import React, { useState } from 'react';
import {
  LayoutDashboard,
  History,
  ClipboardCheck,
  PieChart,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Language, translations } from '@/src/lib/i18n';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export default function Layout({
  children,
  activeTab,
  setActiveTab,
  lang,
  setLang,
}: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = translations[lang];

  const menuItems = [
    { id: 'form', label: t.menu.form, icon: ClipboardCheck },
    { id: 'history', label: t.menu.history, icon: History },
    { id: 'dashboard', label: t.menu.dashboard, icon: LayoutDashboard },
    { id: 'details', label: t.menu.details, icon: BarChart3 },
    { id: 'overview', label: t.menu.overview, icon: PieChart },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-900 overflow-x-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 h-16 px-4 flex items-center justify-between gap-2 sticky top-0 z-50">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0">
            <ClipboardCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 tracking-tight truncate text-sm sm:text-base">
            {t.brandMobileTitle}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 text-xs font-bold text-slate-700 transition-colors"
            title={lang === 'th' ? 'Switch to English mode' : 'สลับเป็นภาษาไทย'}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'th' ? 'English' : 'ไทย'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t.closeMenu : t.openMenu}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 top-16 z-30 bg-slate-900/30 backdrop-blur-[1px] md:hidden"
        />
      )}

      {/* Sidebar / Navigation */}
      <aside
        className={cn(
          'fixed top-16 bottom-0 left-0 z-40 md:relative md:top-auto md:bottom-auto md:z-0 bg-white border-r border-slate-200 w-64 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out md:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div>
          <div className="p-6 hidden md:block space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
                <ClipboardCheck className="text-white w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-slate-800 leading-tight truncate">{t.brandTitle}</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold truncate">
                  {t.brandSubtitle}
                </p>
              </div>
            </div>

            {/* Desktop Language Mode Switcher */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/70">
              <button
                type="button"
                onClick={() => setLang('th')}
                className={cn(
                  'py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all',
                  lang === 'th'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                ไทย
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={cn(
                  'py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1',
                  lang === 'en'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                <Globe className="w-3 h-3" />
                English
              </button>
            </div>
          </div>

          <nav className="px-4 py-4 md:py-0 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-medium shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">
              {t.statusLabel}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-slate-600">{t.connected}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-3.5 sm:p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${lang}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
