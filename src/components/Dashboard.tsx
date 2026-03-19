import React, { useMemo } from 'react';
import { SupervisionRecord } from '../services/googleSheets';
import { 
  Users, 
  Star, 
  Layers, 
  UserCheck,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface DashboardProps {
  data: SupervisionRecord[];
}

export default function Dashboard({ data }: DashboardProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const avgScore = total > 0 ? data.reduce((acc, curr) => acc + curr.averageScore, 0) / total : 0;
    const uniqueLevels = new Set(data.map(d => d.level)).size;
    const uniqueSupervisors = new Set(data.map(d => d.supervisor)).size;

    return [
      { label: 'จำนวนการนิเทศ', value: total, icon: Calendar, color: 'bg-blue-500', shadow: 'shadow-blue-100' },
      { label: 'คะแนนเฉลี่ยรวม', value: avgScore.toFixed(2), icon: Star, color: 'bg-amber-500', shadow: 'shadow-amber-100' },
      { label: 'ระดับชั้นที่นิเทศ', value: uniqueLevels, icon: Layers, color: 'bg-purple-500', shadow: 'shadow-purple-100' },
      { label: 'จำนวนผู้นิเทศ', value: uniqueSupervisors, icon: UserCheck, color: 'bg-emerald-500', shadow: 'shadow-emerald-100' },
    ];
  }, [data]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800">ข้อมูลการนิเทศ</h2>
        <p className="text-slate-500">สรุปสถิติและรายการข้อมูลการนิเทศทั้งหมด</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color, stat.shadow)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            รายการข้อมูลการนิเทศล่าสุด
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">วันที่</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ผู้นิเทศ</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ครูผู้รับการนิเทศ</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ระดับชั้น</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">ครั้งที่</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">คะแนนเฉลี่ย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{item.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-800 font-semibold">{item.supervisor}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.teacher}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
