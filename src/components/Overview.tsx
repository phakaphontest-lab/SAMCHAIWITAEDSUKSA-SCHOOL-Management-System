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
  Line
} from 'recharts';

interface OverviewProps {
  data: SupervisionRecord[];
}

export default function Overview({ data }: OverviewProps) {
  const overallBarData = useMemo(() => {
    if (data.length === 0) return [];
    const count = data.length;
    return [
      { name: 'จุดประสงค์', score: data.reduce((acc, curr) => acc + curr.objectiveScore, 0) / count, color: '#10b981' },
      { name: 'เนื้อหา', score: data.reduce((acc, curr) => acc + curr.contentScore, 0) / count, color: '#3b82f6' },
      { name: 'กิจกรรม', score: data.reduce((acc, curr) => acc + curr.activityScore, 0) / count, color: '#f59e0b' },
      { name: 'สื่อ', score: data.reduce((acc, curr) => acc + curr.mediaScore, 0) / count, color: '#8b5cf6' },
      { name: 'การวัดผล', score: data.reduce((acc, curr) => acc + curr.evaluationScore, 0) / count, color: '#ec4899' },
    ];
  }, [data]);

  const overallPieData = useMemo(() => {
    if (data.length === 0) return [];
    const count = data.length;
    return [
      { name: 'ขั้นนำ', value: data.reduce((acc, curr) => acc + curr.introScore, 0) / count, color: '#60a5fa' },
      { name: 'ขั้นสอน', value: data.reduce((acc, curr) => acc + curr.teachingScore, 0) / count, color: '#34d399' },
      { name: 'ขั้นสรุป', value: data.reduce((acc, curr) => acc + curr.conclusionScore, 0) / count, color: '#fbbf24' },
    ];
  }, [data]);

  const lineData = useMemo(() => {
    const levelMap: Record<string, { total: number, count: number }> = {};
    data.forEach(item => {
      if (!levelMap[item.level]) levelMap[item.level] = { total: 0, count: 0 };
      levelMap[item.level].total += item.averageScore;
      levelMap[item.level].count += 1;
    });

    return Object.entries(levelMap).map(([level, stats]) => ({
      level,
      avg: stats.total / stats.count
    })).sort((a, b) => a.level.localeCompare(b.level));
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800">สรุปภาพรวมการนิเทศ</h2>
        <p className="text-slate-500">วิเคราะห์ข้อมูลเชิงลึกจากผลการนิเทศทั้งหมด</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overall Bar Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            ผลการประเมินรายด้านเฉลี่ยทั้งหมด
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overallBarData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <YAxis 
                  domain={[0, 5]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                  {overallBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overall Pie Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
            สัดส่วนคะแนนด้านกิจกรรมการจัดการเรียนรู้
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {overallPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
          คะแนนเฉลี่ยรายระดับชั้น
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="level" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                padding={{ left: 30, right: 30 }}
              />
              <YAxis 
                domain={[0, 5]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="avg" 
                stroke="#8b5cf6" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
