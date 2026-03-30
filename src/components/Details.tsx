import React, { useState, useMemo } from 'react';
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
  Legend
} from 'recharts';
import { User, Calendar, MapPin, Hash } from 'lucide-react';

interface DetailsProps {
  data: SupervisionRecord[];
}

export default function Details({ data }: DetailsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedRecord = data[selectedIndex];

  const barData = useMemo(() => {
    if (!selectedRecord) return [];
    return [
      { name: 'จุดประสงค์', score: selectedRecord.objectiveScore, color: '#10b981' },
      { name: 'เนื้อหา', score: selectedRecord.contentScore, color: '#ef4444' },
      { name: 'กิจกรรม', score: selectedRecord.activityScore, color: '#f59e0b' },
      { name: 'สื่อ', score: selectedRecord.mediaScore, color: '#8b5cf6' },
      { name: 'การวัดผล', score: selectedRecord.evaluationScore, color: '#ec4899' },
    ];
  }, [selectedRecord]);

  const pieData = useMemo(() => {
    if (!selectedRecord) return [];
    return [
      { name: 'ขั้นนำ', value: selectedRecord.introScore, color: '#ef4444' },
      { name: 'ขั้นสอน', value: selectedRecord.teachingScore, color: '#34d399' },
      { name: 'ขั้นสรุป', value: selectedRecord.conclusionScore, color: '#fbbf24' },
    ];
  }, [selectedRecord]);

  if (!selectedRecord) return <div className="p-12 text-center text-slate-400">ไม่พบข้อมูล</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800">รายละเอียดการนิเทศรายบุคคล</h2>
        <p className="text-slate-500">วิเคราะห์ผลการประเมินรายด้านและขั้นตอนการสอน</p>
      </div>

      {/* Selector */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">เลือกรายการนิเทศ</label>
        <select 
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
        >
          {data.map((item, idx) => (
            <option key={idx} value={idx}>
              {item.date} | {item.teacher} | {item.level} | ครั้งที่ {item.round} | โดย {item.supervisor}
            </option>
          ))}
        </select>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">ครูผู้รับการนิเทศ</p>
            <p className="text-sm font-bold text-slate-800">{selectedRecord.teacher}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">วันที่นิเทศ</p>
            <p className="text-sm font-bold text-slate-800">{selectedRecord.date}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">ระดับชั้น</p>
            <p className="text-sm font-bold text-slate-800">{selectedRecord.level}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">ครั้งที่</p>
            <p className="text-sm font-bold text-slate-800">{selectedRecord.round}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            ผลการประเมินรายด้าน
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
            ด้านกิจกรรมการจัดการเรียนรู้
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
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
    </div>
  );
}
