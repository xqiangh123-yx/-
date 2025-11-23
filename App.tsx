import React, { useState } from 'react';
import { LayoutDashboard, GitMerge, FileText, CheckSquare, Settings, Bell, Search, User } from 'lucide-react';
import ProcessMap from './components/ProcessMap';
import RuleEngine from './components/RuleEngine';
import TaskWorkbench from './components/TaskWorkbench';
import Dashboard from './components/Dashboard';
import { MOCK_PROCESS_NODES } from './constants';
import { ProcessNode } from './types';
import { analyzeBottleneck } from './services/geminiService';

enum Tab {
  MAP = 'MAP',
  RULES = 'RULES',
  WORKBENCH = 'WORKBENCH',
  DASHBOARD = 'DASHBOARD'
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.MAP);
  const [selectedNode, setSelectedNode] = useState<ProcessNode | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);

  const handleNodeClick = async (node: ProcessNode) => {
    setSelectedNode(node);
    setAiAnalysis(''); 
    
    // Auto-analyze if critical
    if (node.status === 'CRITICAL') {
      setAnalyzing(true);
      const result = await analyzeBottleneck(node);
      setAiAnalysis(result);
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20 transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
            <GitMerge className="text-white" size={20} />
          </div>
          <span className="font-bold text-lg hidden lg:block tracking-tight">Smart Ops</span>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          <NavItem 
            icon={<GitMerge size={20} />} 
            label="作战地图 (Map)" 
            active={activeTab === Tab.MAP} 
            onClick={() => setActiveTab(Tab.MAP)} 
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label="策略引擎 (Rules)" 
            active={activeTab === Tab.RULES} 
            onClick={() => setActiveTab(Tab.RULES)} 
          />
          <NavItem 
            icon={<CheckSquare size={20} />} 
            label="执行工作台 (Tasks)" 
            active={activeTab === Tab.WORKBENCH} 
            onClick={() => setActiveTab(Tab.WORKBENCH)} 
            badge={3}
          />
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="运营驾驶舱 (BI)" 
            active={activeTab === Tab.DASHBOARD} 
            onClick={() => setActiveTab(Tab.DASHBOARD)} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 text-slate-400 hover:text-white cursor-pointer">
            <User size={20} />
            <span className="text-sm hidden lg:block">Admin User</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 lg:ml-64 p-8 overflow-y-auto h-screen">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {activeTab === Tab.MAP && '全链路全景监控 (Process Map)'}
              {activeTab === Tab.RULES && '策略配置中心 (Rule Engine)'}
              {activeTab === Tab.WORKBENCH && '敏捷执行工作台 (Action Workbench)'}
              {activeTab === Tab.DASHBOARD && '运营健康度 (Health Dashboard)'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">OTD (Order-to-Delivery) v1.0 MVP</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search orders or tasks..." className="pl-10 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64" />
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="h-full pb-20">
          {activeTab === Tab.MAP && (
            <div className="space-y-6">
              <ProcessMap 
                nodes={MOCK_PROCESS_NODES} 
                onNodeClick={handleNodeClick} 
                selectedNodeId={selectedNode?.id || null} 
              />
              
              {selectedNode ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
                  {/* Node Detail Card */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-800">{selectedNode.title}</h2>
                        <p className="text-slate-500 text-sm mt-1">{selectedNode.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedNode.status === 'CRITICAL' ? 'bg-red-100 text-red-600' :
                        selectedNode.status === 'WARNING' ? 'bg-orange-100 text-orange-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {selectedNode.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {selectedNode.metrics.map(metric => (
                        <div key={metric.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-2">
                            {metric.name}
                            {metric.isLeading && <span className="bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded text-[10px]">过程指标</span>}
                          </p>
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-slate-800">{metric.value}</span>
                            <span className="text-sm text-slate-400 mb-1">{metric.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI Analysis Section */}
                    {selectedNode.status !== 'HEALTHY' && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-lg border border-indigo-100">
                        <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                          ⚡ AI 根因分析 (Gemini)
                        </h4>
                        {analyzing ? (
                          <div className="text-sm text-slate-500 italic">Analyzing real-time metrics...</div>
                        ) : (
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {aiAnalysis || "点击节点获取AI分析报告..."}
                          </p>
                        )}
                        {!analyzing && !aiAnalysis && (
                           <button 
                            onClick={() => handleNodeClick(selectedNode)}
                            className="mt-3 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors">
                             立即分析
                           </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Active Actions Card */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">关联动作 (Active Actions)</h3>
                    {selectedNode.activeTasks > 0 ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => setActiveTab(Tab.WORKBENCH)}>
                          <div className="mt-1 min-w-[16px]">
                            <span className="block w-2 h-2 rounded-full bg-red-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-red-900">积压告警处理</p>
                            <p className="text-xs text-red-700 mt-1">已触发 30 个自动任务给计划部。</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">当前节点无活跃干预动作。</p>
                    )}
                    <button 
                      onClick={() => setActiveTab(Tab.RULES)}
                      className="w-full mt-4 py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm hover:border-brand-500 hover:text-brand-500 transition-colors">
                      + 配置新预警规则
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400">
                  <p>点击上方节点查看详细指标与策略</p>
                </div>
              )}
            </div>
          )}

          {activeTab === Tab.RULES && <RuleEngine />}
          {activeTab === Tab.WORKBENCH && <TaskWorkbench />}
          {activeTab === Tab.DASHBOARD && <Dashboard />}
        </div>
      </main>
    </div>
  );
}

// Helper Component for Nav Items
const NavItem = ({ icon, label, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium hidden lg:block">{label}</span>
    {badge && (
      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full hidden lg:block">
        {badge}
      </span>
    )}
  </button>
);

export default App;