import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SupervisionForm from './components/SupervisionForm';
import HistoryTable from './components/History';
import Dashboard from './components/Dashboard';
import Details from './components/Details';
import Overview from './components/Overview';
import { fetchSupervisionData, SupervisionRecord } from './services/googleSheets';
import { Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<SupervisionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const result = await fetchSupervisionData();
    setData(result);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderContent = () => {
    if (isLoading && data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">กำลังดึงข้อมูลจาก Google Sheets...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'form':
        return <SupervisionForm />;
      case 'history':
        return <HistoryTable data={data} />;
      case 'dashboard':
        return <Dashboard data={data} />;
      case 'details':
        return <Details data={data} />;
      case 'overview':
        return <Overview data={data} />;
      default:
        return <Dashboard data={data} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="relative">
        {/* Refresh Button */}
        <div className="absolute top-0 right-0 z-10 hidden md:block">
          <button 
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors bg-white border border-slate-100 rounded-lg shadow-sm"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
            {isLoading ? 'กำลังอัปเดต...' : 'อัปเดตข้อมูล'}
          </button>
        </div>
        
        {renderContent()}
      </div>
    </Layout>
  );
}
