/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  History, 
  BarChart3, 
  FileText, 
  PieChart, 
  ChevronRight, 
  Filter,
  Search,
  Calendar,
  User,
  GraduationCap,
  Menu,
  X,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { SupervisionData, TabType } from './types';
import { fetchSupervisionData } from './services/sheetService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [data, setData] = useState<SupervisionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchSupervisionData();
      setData(result);
      setLoading(false);
    };
    loadData();
  }, []);

  const menuItems = [
    { id: 'overview', label: 'สรุปภาพรวม', icon: LayoutDashboard },
    { id: 'form', label: 'การนิเทศ', icon: TrendingUp },
    { id: 'history', label: 'ประวัติการนิเทศ', icon: History },
    { id: 'data', label: 'ข้อมูลการนิเทศ', icon: BarChart3 },
    { id: 'details', label: 'รายละเอียด', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-slate-900 text-white transition-all duration-300 flex flex-col fixed h-full z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-lg truncate">สามชัยวิเทศศึกษา</span>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                activeTab === item.id 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-4 border-t border-slate-800 text-slate-400 hover:text-white flex justify-center"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        <header className="bg-white border-b border-slate-200 p-6 sticky top-0 z-40 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            {menuItems.find(m => m.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">ระบบนิเทศการสอน</p>
              <p className="text-xs text-slate-500">โรงเรียนสามชัยวิเทศศึกษา</p>
            </div>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[60vh]"
              >
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">กำลังโหลดข้อมูล...</p>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'form' && <FormPage />}
                {activeTab === 'history' && <HistoryPage data={data} />}
                {activeTab === 'data' && <DataPage data={data} />}
                {activeTab === 'details' && <DetailsPage data={data} />}
                {activeTab === 'overview' && <OverviewPage data={data} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Pages ---

function FormPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[80vh]">
      <iframe 
        src="https://docs.google.com/forms/d/e/1FAIpQLSfu1NKP9hVqQ6XTjWN-hhTAPOYnZvEmrm_sQKfr74VfgM3b5g/viewform?embedded=true" 
        width="100%" 
        height="100%" 
        frameBorder="0" 
        marginHeight={0} 
        marginWidth={0}
      >
        กำลังโหลด…
      </iframe>
    </div>
  );
}

function HistoryPage({ data }: { data: SupervisionData[] }) {
  const [filters, setFilters] = useState({
    supervisor: '',
    gradeLevel: '',
    round: ''
  });

  const supervisors = useMemo(() => Array.from(new Set(data.map(d => d.supervisor))).filter(Boolean), [data]);
  const gradeLevels = useMemo(() => Array.from(new Set(data.map(d => d.gradeLevel))).filter(Boolean), [data]);
  const rounds = useMemo(() => Array.from(new Set(data.map(d => d.round))).filter(Boolean), [data]);

  const filteredData = data.filter(item => {
    return (
      (!filters.supervisor || item.supervisor === filters.supervisor) &&
      (!filters.gradeLevel || item.gradeLevel === filters.gradeLevel) &&
      (!filters.round || item.round === filters.round)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-slate-700 mb-2">ผู้นิเทศ</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={filters.supervisor}
            onChange={(e) => setFilters({ ...filters, supervisor: e.target.value })}
          >
            <option value="">ทั้งหมด</option>
            {supervisors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-slate-700 mb-2">ระดับชั้น</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={filters.gradeLevel}
            onChange={(e) => setFilters({ ...filters, gradeLevel: e.target.value })}
          >
            <option value="">ทั้งหมด</option>
            {gradeLevels.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-slate-700 mb-2">ครั้งที่</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={filters.round}
            onChange={(e) => setFilters({ ...filters, round: e.target.value })}
          >
            <option value="">ทั้งหมด</option>
            {rounds.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <button 
          onClick={() => setFilters({ supervisor: '', gradeLevel: '', round: '' })}
          className="px-6 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all"
        >
          ล้างตัวกรอง
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-bold text-slate-600">วันที่</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">ผู้นิเทศ</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">ครูผู้รับการนิเทศ</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">ระดับชั้น</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">ครั้งที่</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">คะแนนเฉลี่ย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? filteredData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{item.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.supervisor}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.teacher}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.gradeLevel}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.round}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={cn(
                      "px-2 py-1 rounded-lg font-bold",
                      item.averageScore >= 4 ? "bg-emerald-100 text-emerald-700" :
                      item.averageScore >= 3 ? "bg-amber-100 text-amber-700" :
                      "bg-rose-100 text-rose-700"
                    )}>
                      {item.averageScore.toFixed(2)}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">ไม่พบข้อมูลที่ตรงตามเงื่อนไข</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DataPage({ data }: { data: SupervisionData[] }) {
  const stats = useMemo(() => {
    const total = data.length;
    const avg = data.length > 0 ? data.reduce((acc, curr) => acc + curr.averageScore, 0) / data.length : 0;
    const grades = new Set(data.map(d => d.gradeLevel)).size;
    const supervisors = new Set(data.map(d => d.supervisor)).size;
    return { total, avg, grades, supervisors };
  }, [data]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'จำนวนการนิเทศ', value: stats.total, icon: FileText, color: 'bg-blue-500' },
          { label: 'คะแนนเฉลี่ยรวม', value: stats.avg.toFixed(2), icon: TrendingUp, color: 'bg-emerald-500' },
          { label: 'ระดับชั้นที่นิเทศ', value: stats.grades, icon: GraduationCap, color: 'bg-amber-500' },
          { label: 'จำนวนผู้นิเทศ', value: stats.supervisors, icon: User, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">รายการข้อมูลการนิเทศ (เรียงตามวันที่)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-bold text-slate-600">วันที่</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">ผู้นิเทศ</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">ครูผู้รับการนิเทศ</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">วิชา</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">ระดับชั้น</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">คะแนนเฉลี่ย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{item.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.supervisor}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.teacher}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.subject}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.gradeLevel}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{item.averageScore.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DetailsPage({ data }: { data: SupervisionData[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const selected = data[selectedIndex] || null;

  const barData = selected ? [
    { name: 'จุดประสงค์', score: selected.objectiveScore },
    { name: 'เนื้อหา', score: selected.contentScore },
    { name: 'กิจกรรม', score: selected.activityScore },
    { name: 'สื่อการสอน', score: selected.mediaScore },
    { name: 'การวัดผล', score: selected.evaluationScore },
  ] : [];

  const pieData = selected ? [
    { name: 'ขั้นนำ', value: selected.introScore },
    { name: 'ขั้นสอน', value: selected.teachingScore },
    { name: 'ขั้นสรุป', value: selected.summaryScore },
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List Panel */}
      <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[70vh]">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">เลือกรายการนิเทศ</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {data.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all border",
                selectedIndex === idx 
                  ? "bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200" 
                  : "bg-white border-transparent hover:bg-slate-50"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{item.date}</span>
                <span className="text-xs font-medium text-slate-400">ครั้งที่ {item.round}</span>
              </div>
              <p className="font-bold text-slate-900 truncate">{item.teacher}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <User className="w-3 h-3" />
                <span>{item.supervisor}</span>
                <span className="mx-1">•</span>
                <GraduationCap className="w-3 h-3" />
                <span>{item.gradeLevel}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      <div className="lg:col-span-2 space-y-8">
        {!selected ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
            <p className="text-slate-400">กรุณาเลือกรายการเพื่อดูรายละเอียด</p>
          </div>
        ) : (
          <>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{selected.teacher}</h2>
                  <p className="text-slate-500">วิชา: {selected.subject} | ระดับชั้น: {selected.gradeLevel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">คะแนนเฉลี่ย</p>
                  <p className="text-4xl font-black text-emerald-500">{selected.averageScore.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-500" />
                    ผลการประเมินรายด้าน
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                        <XAxis type="number" domain={[0, 5]} hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} style={{ fontSize: '12px' }} />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="score" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-emerald-500" />
                    ผลการประเมินขั้นกิจกรรม
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {selected.comments && (
              <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                <h4 className="font-bold text-amber-800 mb-2">ข้อเสนอแนะเพิ่มเติม</h4>
                <p className="text-amber-700 leading-relaxed">{selected.comments}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function OverviewPage({ data }: { data: SupervisionData[] }) {
  const averages = useMemo(() => {
    if (data.length === 0) return [];
    
    const areas = [
      { name: 'ด้านจุดประสงค์', key: 'objectiveScore' },
      { name: 'ด้านเนื้อหา', key: 'contentScore' },
      { name: 'ด้านกิจกรรม', key: 'activityScore' },
      { name: 'ด้านสื่อ', key: 'mediaScore' },
      { name: 'ด้านการวัดผล', key: 'evaluationScore' },
    ];

    return areas.map(area => ({
      name: area.name,
      score: data.reduce((acc, curr) => acc + (curr as any)[area.key], 0) / data.length
    }));
  }, [data]);

  const activityAverages = useMemo(() => {
    if (data.length === 0) return [];
    const phases = [
      { name: 'ขั้นนำ', key: 'introScore' },
      { name: 'ขั้นสอน', key: 'teachingScore' },
      { name: 'ขั้นสรุป', key: 'summaryScore' },
    ];
    return phases.map(phase => ({
      name: phase.name,
      value: data.reduce((acc, curr) => acc + (curr as any)[phase.key], 0) / data.length
    }));
  }, [data]);

  const gradeLevelAverages = useMemo(() => {
    const grades: Record<string, { total: number, count: number }> = {};
    data.forEach(item => {
      if (!grades[item.gradeLevel]) grades[item.gradeLevel] = { total: 0, count: 0 };
      grades[item.gradeLevel].total += item.averageScore;
      grades[item.gradeLevel].count += 1;
    });
    return Object.entries(grades).map(([name, val]) => ({
      name,
      score: val.total / val.count
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-500 p-8 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
          <p className="text-emerald-100 font-medium mb-1">คะแนนเฉลี่ยรวมทั้งโรงเรียน</p>
          <h2 className="text-5xl font-black">
            {(data.reduce((acc, curr) => acc + curr.averageScore, 0) / (data.length || 1)).toFixed(2)}
          </h2>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-100">
            <TrendingUp className="w-4 h-4" />
            <span>จากทั้งหมด {data.length} รายการ</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm col-span-1 md:col-span-2 flex items-center justify-around">
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-1">ระดับชั้น</p>
            <p className="text-3xl font-bold text-slate-900">{new Set(data.map(d => d.gradeLevel)).size}</p>
          </div>
          <div className="w-px h-12 bg-slate-100"></div>
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-1">ผู้นิเทศ</p>
            <p className="text-3xl font-bold text-slate-900">{new Set(data.map(d => d.supervisor)).size}</p>
          </div>
          <div className="w-px h-12 bg-slate-100"></div>
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-1">ครูผู้รับการนิเทศ</p>
            <p className="text-3xl font-bold text-slate-900">{new Set(data.map(d => d.teacher)).size}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart Overview */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800">ผลการประเมินรายด้าน (ภาพรวม)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={averages}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Overview */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800">ผลการประเมินขั้นกิจกรรม (ภาพรวม)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={activityAverages}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {activityAverages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart Overview */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800">คะแนนเฉลี่ยรายระดับชั้น</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gradeLevelAverages}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
