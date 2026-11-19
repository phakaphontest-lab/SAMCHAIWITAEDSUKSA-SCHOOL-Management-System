import React, { useState, useMemo, useEffect } from 'react';
import { SupervisionRecord } from '../services/googleSheets';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { User, Calendar, MapPin, Hash } from 'lucide-react';
import { Language, translations } from '@/src/lib/i18n';

interface DetailsProps {
  data: SupervisionRecord[];
  lang: Language;
}

export default function Details({ data, lang }: DetailsProps) {
  const t = translations[lang].details;
  const c = translations[lang].charts;
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [lang, data.length]);

  const selectedRecord = data[selectedIndex];

  const barData = useMemo(() => {
    if (!selectedRecord) return [];
    return [
      { name: c.objective, score: Number(selectedRecord.objectiveScore.toFixed(2)), color: '#10b981' },
      { name: c.content, score: Number(selectedRecord.contentScore.toFixed(2)), color: '#ef4444' },
      { name: c.activity, score: Number(selectedRecord.activityScore.toFixed(2)), color: '#f59e0b' },
      { name: c.media, score: Number(selectedRecord.mediaScore.toFixed(2)), color: '#8b5cf6' },
      { name: c.evaluation, score: Number(selectedRecord.evaluationScore.toFixed(2)), color: '#ec4899' },
    ];
  }, [selectedRecord, c]);

  const pieData = useMemo(() => {
    if (!selectedRecord) return [];
    return [
      { name: c.intro, value: Number(selectedRecord.introScore.toFixed(2)), color: '#ef4444' },
      { name: c.teaching, value: Number(selectedRecord.teachingScore.toFixed(2)), color: '#34d399' },
      { name: c.conclusion, value: Number(selectedRecord.conclusionScore.toFixed(2)), color: '#fbbf24' },
    ];
  }, [selectedRecord, c]);

  if (!selectedRecord) {
    return (
      <div className="space-y-5 sm:space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t.title}</h2>
          <p className="text-sm sm:text-base text-slate-500">{t.subtitle}</p>
        </div>
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-12 text-center text-slate-400 italic">
          {t.empty}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t.title}</h2>
        <p className="text-sm sm:text-base text-slate-500">{t.subtitle}</p>
      </div>

      {/* Selector */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          {t.selectLabel}
        </label>
        <select
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
          className="w-full max-w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium truncate"
        >
          {data.map((item, idx) => (
            <option key={idx} value={idx}>
              {item.date} | {item.teacher} | {item.level} | {t.round} {item.round} | {t.by}{' '}
              {item.supervisor}
            </option>
          ))}
        </select>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase">{t.teacher}</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
              {selectedRecord.teacher}
            </p>
          </div>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase">{t.date}</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
              {selectedRecord.date}
            </p>
          </div>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase">{t.level}</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
              {selectedRecord.level}
            </p>
          </div>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
            <Hash className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase">{t.round}</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
              {selectedRecord.round}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
            <div className="w-1.5 h-5 sm:h-6 bg-emerald-500 rounded-full" />
            {t.barTitle}
          </h3>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  domain={[0, 5]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(value: number) => [value.toFixed(2), c.scoreLabel]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
            <div className="w-1.5 h-5 sm:h-6 bg-blue-500 rounded-full" />
            {t.pieTitle}
          </h3>
          <div className="h-[260px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="48%"
                  innerRadius="45%"
                  outerRadius="78%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [value.toFixed(2), c.scoreLabel]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
