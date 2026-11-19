import React, { useMemo } from 'react';
import { SupervisionRecord } from '../services/googleSheets';
import { Star, Layers, UserCheck, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Language, translations } from '@/src/lib/i18n';
import EnglishSheetConnect from './EnglishSheetConnect';

interface DashboardProps {
  data: SupervisionRecord[];
  lang: Language;
  onSheetConnected: () => void;
}

export default function Dashboard({ data, lang, onSheetConnected }: DashboardProps) {
  const t = translations[lang].dashboard;

  const stats = useMemo(() => {
    const total = data.length;
    const avgScore =
      total > 0 ? data.reduce((acc, curr) => acc + curr.averageScore, 0) / total : 0;
    const uniqueLevels = new Set(data.map((d) => d.level).filter(Boolean)).size;
    const uniqueSupervisors = new Set(data.map((d) => d.supervisor).filter(Boolean)).size;

    return [
      {
        label: t.totalCount,
        value: total,
        icon: Calendar,
        color: 'bg-blue-500',
        shadow: 'shadow-blue-100',
      },
      {
        label: t.avgScore,
        value: avgScore.toFixed(2),
        icon: Star,
        color: 'bg-amber-500',
        shadow: 'shadow-amber-100',
      },
      {
        label: t.levelCount,
        value: uniqueLevels,
        icon: Layers,
        color: 'bg-purple-500',
        shadow: 'shadow-purple-100',
      },
      {
        label: t.supervisorCount,
        value: uniqueSupervisors,
        icon: UserCheck,
        color: 'bg-emerald-500',
        shadow: 'shadow-emerald-100',
      },
    ];
  }, [data, t]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.dateTimestamp - a.dateTimestamp);
  }, [data]);

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t.title}</h2>
        <p className="text-sm sm:text-base text-slate-500">{t.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          >
            <div
              className={cn(
                'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0',
                stat.color,
                stat.shadow
              )}
            >
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider sm:tracking-widest truncate">
                {stat.label}
              </p>
              <p className="text-xl sm:text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {lang === 'en' && data.length === 0 ? (
        <EnglishSheetConnect lang={lang} onSheetConnected={onSheetConnected} />
      ) : (
        /* Recent Table / Mobile Cards */
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
              <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
              {t.recentTitle}
            </h3>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {sortedData.length > 0 ? (
              sortedData.map((item, idx) => (
                <div key={idx} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{item.teacher}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {t.supervisor}: {item.supervisor}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'text-sm font-bold px-2.5 py-1 rounded-lg shrink-0',
                        item.averageScore >= 4
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.averageScore >= 3
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      )}
                    >
                      {item.averageScore.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold">
                      {item.level}
                    </span>
                    <span>
                      {t.round} {item.round}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-10 text-center text-sm text-slate-400 italic">{t.empty}</div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {t.date}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {t.supervisor}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {t.teacher}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {t.level}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
                    {t.round}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
                    {t.avgCol}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedData.length > 0 ? (
                  sortedData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600">{item.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-800 font-semibold">
                        {item.supervisor}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.teacher}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold">
                          {item.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.round}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-slate-800">
                          {item.averageScore.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                      {t.empty}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
