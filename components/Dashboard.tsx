import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, AlertOctagon, Zap } from 'lucide-react';

const dataEfficiency = [
  { name: 'Mon', completed: 40, pending: 24 },
  { name: 'Tue', completed: 30, pending: 13 },
  { name: 'Wed', completed: 20, pending: 58 }, // Anomaly
  { name: 'Thu', completed: 27, pending: 39 },
  { name: 'Fri', completed: 18, pending: 48 },
  { name: 'Sat', completed: 23, pending: 38 },
  { name: 'Sun', completed: 34, pending: 43 },
];

const dataTrend = [
  { name: 'Week 1', otd: 28 },
  { name: 'Week 2', otd: 26 },
  { name: 'Week 3', otd: 29 }, // Bad
  { name: 'Week 4', otd: 22 }, // Improvement
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">全链路健康度</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">82%</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Zap size={24} />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-4 flex items-center">
            <TrendingUp size={12} className="mr-1" />
            比上周提升 4.2%
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">当前活跃预警</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">12 <span className="text-sm font-normal text-slate-400">个</span></h3>
            </div>
            <div className="p-3 bg-red-50 text-red-500 rounded-lg animate-pulse">
              <AlertOctagon size={24} />
            </div>
          </div>
          <p className="text-xs text-red-500 mt-4 flex items-center">
            主要集中在：生产排程节点
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">SOP 执行闭环率</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">94%</h3>
            </div>
            <div className="p-3 bg-brand-50 text-brand-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            上周同期：88%
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">异常处理效率 (Tasks vs Backlog)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataEfficiency}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  cursor={{fill: '#f1f5f9'}}
                />
                <Legend />
                <Bar dataKey="completed" name="已处置" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="积压中" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">OTD 平均交付周期趋势 (天)</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataTrend}>
                <defs>
                  <linearGradient id="colorOtd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                <Tooltip />
                <Area type="monotone" dataKey="otd" stroke="#22c55e" fillOpacity={1} fill="url(#colorOtd)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insight Section */}
      <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            ✨ 智能复盘 (Smart Insight Loop)
          </h3>
          <p className="text-indigo-200 text-sm mb-4 max-w-2xl">
            根据本周数据分析，"缺料挂起"规则触发频次上升 40%，但SOP执行后交付周期缩短了 1.5 天。建议将该规则的触发阈值从 30 单下调至 20 单，以更早介入。
          </p>
          <button className="bg-white text-indigo-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
            一键优化规则参数
          </button>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-indigo-700 rounded-full opacity-50 blur-2xl"></div>
      </div>
    </div>
  );
};

export default Dashboard;