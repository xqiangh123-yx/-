import React, { useState } from 'react';
import { MOCK_TASKS, MOCK_SOPS } from '../constants';
import { Task } from '../types';
import { Clock, AlertTriangle, CheckSquare, FileText, ChevronRight, MessageSquare } from 'lucide-react';
import { generateSOPRecommendation } from '../services/geminiService';

const TaskWorkbench: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(MOCK_TASKS[0]);
  const [aiSop, setAiSop] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const activeSop = selectedTask ? MOCK_SOPS.find(s => s.id === selectedTask.sopId) : null;

  const handleAskAI = async () => {
    if (!selectedTask) return;
    setLoadingAi(true);
    // Mock metrics for context - in real app would come from state
    const mockMetrics = [{id: '1', name: '积压量', value: 35, unit: '单', trend: 'up' as const, isLeading: true}]; 
    const advice = await generateSOPRecommendation(selectedTask.title, mockMetrics);
    setAiSop(advice);
    setLoadingAi(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Task List Column */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-140px)]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <CheckSquare className="text-brand-500" size={20} />
            待办任务 ({MOCK_TASKS.filter(t => t.status !== 'completed').length})
          </h2>
          <span className="text-xs text-slate-400">按优先级排序</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {MOCK_TASKS.map(task => (
            <div 
              key={task.id}
              onClick={() => { setSelectedTask(task); setAiSop(null); }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedTask?.id === task.id 
                  ? 'bg-brand-50 border-brand-200 shadow-sm' 
                  : 'bg-white border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                  task.priority === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {task.priority} Priority
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(task.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-slate-800 mb-1">{task.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Task Detail & SOP Column */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-140px)] overflow-hidden">
        {selectedTask ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedTask.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><AlertTriangle size={14} className="text-orange-500" /> 来自: 规则引擎触发</span>
                        <span>负责人: {selectedTask.assignee}</span>
                    </div>
                </div>
                <button className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors font-medium">
                    标记完成
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
                {/* Left: SOP & Instructions */}
                <div className="flex-1 p-6 border-r border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
                            <FileText size={20} className="text-slate-400" />
                            标准作业程序 (SOP)
                        </h3>
                        <button 
                            onClick={handleAskAI}
                            disabled={loadingAi}
                            className="text-xs flex items-center gap-1 text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 border border-purple-200 transition-colors">
                            {loadingAi ? '思考中...' : '✨ AI 智能辅助'}
                        </button>
                    </div>

                    {/* AI Suggestion Box */}
                    {aiSop && (
                        <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">Gemini Insight</h4>
                            <div className="text-sm text-slate-700 whitespace-pre-line">{aiSop}</div>
                        </div>
                    )}

                    <div className="prose prose-sm max-w-none text-slate-600">
                        {activeSop ? (
                            <>
                                <h4 className="font-medium text-slate-900">{activeSop.title}</h4>
                                <p className="mb-4">{activeSop.content}</p>
                                <ul className="list-none space-y-3 pl-0">
                                    {activeSop.steps.map((step, idx) => (
                                        <li key={idx} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p className="text-slate-400 italic">暂无关联SOP，请参考通用流程。</p>
                        )}
                    </div>
                </div>

                {/* Right: Feedback & Root Cause */}
                <div className="w-full lg:w-80 p-6 bg-slate-50">
                    <h3 className="font-bold text-sm text-slate-700 mb-4 uppercase tracking-wider">执行反馈 (Feedback Loop)</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">根因归类 (Root Cause)</label>
                            <select className="w-full p-2 rounded border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                                <option>请选择...</option>
                                <option>供应链-缺芯</option>
                                <option>供应链-物流延迟</option>
                                <option>生产-设备故障</option>
                                <option>生产-人员短缺</option>
                                <option>其他</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">处置备注</label>
                            <textarea 
                                className="w-full p-2 rounded border border-slate-300 bg-white text-sm h-32 resize-none focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="请填写具体处理情况..."
                            ></textarea>
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                <Clock size={12} />
                                <span>剩余处理时间:</span>
                                <span className="font-bold text-red-500">03:45:12</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-500 w-2/3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <CheckSquare size={48} className="mb-4 opacity-20" />
            <p>请选择一个任务开始处理</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskWorkbench;