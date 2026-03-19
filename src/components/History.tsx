import React, { useState, useMemo } from 'react';
import { SupervisionRecord } from '../services/googleSheets';
import { Filter, Search, Download } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface HistoryProps {
  data: SupervisionRecord[];
}

export default function HistoryTable({ data }: HistoryProps) {
  const [filterSupervisor, setFilterSupervisor] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterRound, setFilterRound] = useState('');

  const supervisors = useMemo(() => Array.from(new Set(data.map(d => d.supervisor))), [data]);
  const levels = useMemo(() => Array.from(new Set(data.map(d => d.level))), [data]);
  const rounds = useMemo(() => Array.from(new Set(data.map(d => d.round))), [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return (filterSupervisor === '' || item.supervisor === filterSupervisor) &&
             (filterLevel === '' || item.level === filterLevel) &&
             (filterRound === '' || item.round === filterRound);
    });
  }, [data, filterSupervisor, filterLevel, filterRound]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-800">ประวัติการนิเทศ</h2>
          <p className="text-slate-500">เรียกดูข้อมูลประวัติการนิเทศย้อนหลัง</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            ส่งออกข้อมูล
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">ผู้นิเทศ</label>
          <select 
            value={filterSupervisor}
            onChange={(e) => setFilterSupervisor(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          >
            <option value="">ทั้งหมด</option>
            {supervisors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">ระดับชั้น</label>
          <select 
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          >
            <option value="">ทั้งหมด</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">ครั้งที่</label>
          <select 
            value={filterRound}
            onChange={(e) => setFilterRound(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          >
            <option value="">ทั้งหมด</option>
            {rounds.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">วันที่นิเทศ</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ผู้นิเทศ</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ครูผู้รับการนิเทศ</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ระดับชั้น</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">ครั้งที่</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">คะแนนเฉลี่ย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.length > 0 ? (
                filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{item.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-800 font-semibold">{item.supervisor}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.teacher}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                        {item.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.round}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        "text-sm font-bold",
                        item.averageScore >= 4 ? "text-emerald-600" : 
                        item.averageScore >= 3 ? "text-amber-600" : "text-rose-600"
                      )}>
                        {item.averageScore.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    ไม่พบข้อมูลที่ตรงตามเงื่อนไข
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
