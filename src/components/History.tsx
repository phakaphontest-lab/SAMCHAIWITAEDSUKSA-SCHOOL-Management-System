import React, { useState, useMemo, useEffect } from 'react';
import { SupervisionRecord } from '../services/googleSheets';
import { cn } from '@/src/lib/utils';
import { Language, translations } from '@/src/lib/i18n';

interface HistoryProps {
  data: SupervisionRecord[];
  lang: Language;
}

export default function HistoryTable({ data, lang }: HistoryProps) {
  const t = translations[lang].history;
  const [filterSupervisor, setFilterSupervisor] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterRound, setFilterRound] = useState('');

  // Reset filters when language/dataset changes
  useEffect(() => {
    setFilterSupervisor('');
    setFilterLevel('');
    setFilterRound('');
  }, [lang]);

  const supervisors = useMemo(
    () => Array.from(new Set(data.map((d) => d.supervisor).filter(Boolean))),
    [data]
  );
  const levels = useMemo(
    () => Array.from(new Set(data.map((d) => d.level).filter(Boolean))),
    [data]
  );
  const rounds = useMemo(
    () => Array.from(new Set(data.map((d) => d.round).filter(Boolean))),
    [data]
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        (filterSupervisor === '' || item.supervisor === filterSupervisor) &&
        (filterLevel === '' || item.level === filterLevel) &&
        (filterRound === '' || item.round === filterRound)
      );
    });
  }, [data, filterSupervisor, filterLevel, filterRound]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t.title}</h2>
        <p className="text-sm sm:text-base text-slate-500">{t.subtitle}</p>
      </div>

      {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.supervisor}
              </label>
              <select
                value={filterSupervisor}
                onChange={(e) => setFilterSupervisor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              >
                <option value="">{t.all}</option>
                {supervisors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.level}
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              >
                <option value="">{t.all}</option>
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.round}
              </label>
              <select
                value={filterRound}
                onChange={(e) => setFilterRound(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              >
                <option value="">{t.all}</option>
                {rounds.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table / Mobile Cards */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((item, idx) => (
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
                        {t.roundPrefix} {item.round}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-10 text-center text-sm text-slate-400 italic">
                  {t.empty}
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
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
                      {t.avgScore}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{item.date}</td>
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
                          <span
                            className={cn(
                              'text-sm font-bold',
                              item.averageScore >= 4
                                ? 'text-emerald-600'
                                : item.averageScore >= 3
                                ? 'text-amber-600'
                                : 'text-rose-600'
                            )}
                          >
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
    </div>
  );
}
