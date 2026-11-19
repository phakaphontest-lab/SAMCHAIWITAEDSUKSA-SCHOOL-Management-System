import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import SupervisionForm from './components/SupervisionForm';
import HistoryTable from './components/History';
import Dashboard from './components/Dashboard';
import Details from './components/Details';
import Overview from './components/Overview';
import { fetchSupervisionData, SupervisionRecord } from './services/googleSheets';
import { Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Language, translations } from '@/src/lib/i18n';

const LANG_STORAGE_KEY = 'supervision_app_lang';

export default function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'th';
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'en' ? 'en' : 'th';
  });
  const [data, setData] = useState<SupervisionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const setLang = (nextLang: Language) => {
    setLangState(nextLang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANG_STORAGE_KEY, nextLang);
    }
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchSupervisionData(lang);
    setData(result);
    setIsLoading(false);
  }, [lang]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    document.title =
      lang === 'en'
        ? 'Teaching Supervision System'
        : 'ระบบนิเทศการจัดการเรียนการสอน';
  }, [lang]);

  const t = translations[lang];

  const renderContent = () => {
    if (activeTab !== 'form' && isLoading && data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">{t.loadingSheet}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'form':
        return <SupervisionForm lang={lang} />;
      case 'history':
        return <HistoryTable data={data} lang={lang} onSheetConnected={loadData} />;
      case 'dashboard':
        return <Dashboard data={data} lang={lang} onSheetConnected={loadData} />;
      case 'details':
        return <Details data={data} lang={lang} onSheetConnected={loadData} />;
      case 'overview':
        return <Overview data={data} lang={lang} onSheetConnected={loadData} />;
      default:
        return <SupervisionForm lang={lang} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang}>
      <div className="relative">
        {/* Refresh Button */}
        <div className="flex justify-end mb-2 md:mb-0 md:absolute md:top-0 md:right-0 md:z-10">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors bg-white border border-slate-200 md:border-slate-100 rounded-lg shadow-sm"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
            {isLoading ? t.updating : t.refresh}
          </button>
        </div>

        {renderContent()}
      </div>
    </Layout>
  );
}
