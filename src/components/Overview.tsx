import React, { useMemo } from 'react';
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
  LineChart,
  Line,
} from 'recharts';
import { Language, translations } from '@/src/lib/i18n';
import EnglishSheetConnect from './EnglishSheetConnect';

interface OverviewProps {
  data: SupervisionRecord[];
  lang: Language;
  onSheetConnected: () => void;
}

export default function Overview({ data, lang, onSheetConnected }: OverviewProps) {
  const t = translations[lang].overview;
  const c = translations[lang].charts;

  const overallBarData = useMemo(() => {
    if (data.length === 0) return [];
    const count = data.length;
    return [
      {
        name: c.objective,
        score: Number(
          (data.reduce((acc, curr) => acc + curr.objectiveScore, 0) / count).toFixed(2)
        ),
        color: '#10b981',
      },
      {
        name: c.content,
        score: Number(
          (data.reduce((acc, curr) => acc + curr.contentScore, 0) / count).toFixed(2)
        ),
        color: '#ef4444',
      },
      {
        name: c.activity,
        score: Number(
          (data.reduce((acc, curr) => acc + curr.activityScore, 0) / count).toFixed(2)
        ),
        color: '#f59e0b',
      },
      {
        name: c.media,
        score: Number(
          (data.reduce((acc, curr) => acc + curr.mediaScore, 0) / count).toFixed(2)
        ),
        color: '#8b5cf6',
      },
      {
        name: c.evaluation,
        score: Number(
          (data.reduce((acc, curr) => acc + curr.evaluationScore, 0) / count).toFixed(2)
        ),
        color: '#ec4899',
      },
    ];
  }, [data, c]);

  const overallPieData = useMemo(() => {
    if (data.length === 0) return [];
    const count = data.length;
    return [
      {
        name: c.intro,
        value: Number((data.reduce((acc, curr) => acc + curr.introScore, 0) / count).toFixed(2)),
        color: '#ef4444',
      },
      {
        name: c.teaching,
        value: Number(
          (data.reduce((acc, curr) => acc + curr.teachingScore, 0) / count).toFixed(2)
        ),
        color: '#34d399',
      },
      {
        name: c.conclusion,
        value: Number(
          (data.reduce((acc, curr) => acc + curr.conclusionScore, 0) / count).toFixed(2)
        ),
        color: '#fbbf24',
      },
    ];
  }, [data, c]);

  const lineData = useMemo(() => {
    const levelMap: Record<string, { total: number; count: number }> = {};
    data.forEach((item) => {
      if (!item.level) return;
      if (!levelMap[item.level]) levelMap[item.level] = { total: 0, count: 0 };
      levelMap[item.level].total += item.averageScore;
      levelMap[item.level].count += 1;
    });

    return Object.entries(levelMap)
      .map(([level, stats]) => ({
        level,
        avg: Number((stats.total / stats.count).toFixed(2)),
      }))
      .sort((a, b) => a.level.localeCompare(b.level));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="space-y-5 sm:space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t.title}</h2>
          <p className="text-sm sm:text-base text-slate-500">{t.subtitle}</p>
        </div>
        {lang === 'en' ? (
          <EnglishSheetConnect lang={lang} onSheetConnected={onSheetConnected} />
        ) : (
          <div className="p-12 text-center text-slate-400">{t.empty}</div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t.title}</h2>
        <p className="text-sm sm:text-base text-slate-500">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Overall Bar Chart */}
        <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
            <div className="w-1.5 h-5 sm:h-6 bg-emerald-500 rounded-full" />
            {t.barTitle}
          </h3>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overallBarData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
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
                  formatter={(value: number) => [value.toFixed(2), c.avgLabel]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {overallBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overall Pie Chart */}
        <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
            <div className="w-1.5 h-5 sm:h-6 bg-blue-500 rounded-full" />
            {t.pieTitle}
          </h3>
          <div className="h-[260px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallPieData}
                  cx="50%"
                  cy="48%"
                  innerRadius="45%"
                  outerRadius="78%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {overallPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [value.toFixed(2), c.avgLabel]}
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

      {/* Line Chart */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
          <div className="w-1.5 h-5 sm:h-6 bg-purple-500 rounded-full" />
          {t.lineTitle}
        </h3>
        <div className="h-[260px] sm:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 12, right: 16, left: -16, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="level"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                padding={{ left: 16, right: 16 }}
              />
              <YAxis
                domain={[0, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <Tooltip
                formatter={(value: number) => [value.toFixed(2), c.avgLabel]}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
