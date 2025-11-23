import React, { useState } from 'react';
import { MOCK_RULES, MOCK_PROCESS_NODES, MOCK_TASKS } from '../constants';
import { Rule, ProcessNode } from '../types';
import { Plus, Trash2, Save } from 'lucide-react';

const RuleEngine: React.FC = () => {
  const [rules, setRules] = useState(MOCK_RULES);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">智能策略配置引擎 (Strategy Brain)</h2>
          <p className="text-sm text-slate-500">IF [指标] [条件] THEN [执行动作]</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
          <Plus size={16} />
          新建规则
        </button>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => {
            const nodeName = MOCK_PROCESS_NODES.find(n => n.id === rule.nodeId)?.title || rule.nodeId;
            return (
                <div key={rule.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center gap-4 group hover:border-brand-300 transition-all">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 items-center text-sm">
                    {/* IF Block */}
                    <div className="flex items-center gap-2 col-span-2">
                        <span className="font-bold text-slate-400">IF</span>
                        <div className="bg-white px-3 py-2 rounded border border-slate-300 font-medium text-slate-700 w-full">
                            {nodeName} · {rule.conditionMetric}
                        </div>
                    </div>

                    {/* Operator */}
                    <div className="flex items-center gap-2">
                        <div className="bg-white px-3 py-2 rounded border border-slate-300 font-mono text-brand-600 font-bold w-full text-center">
                            {rule.operator} {rule.threshold}
                        </div>
                    </div>

                    {/* THEN Block */}
                    <div className="flex items-center gap-2 col-span-2">
                        <span className="font-bold text-slate-400">THEN</span>
                        <div className="bg-white px-3 py-2 rounded border border-slate-300 text-slate-700 w-full truncate flex items-center justify-between">
                            <span>{rule.triggerAction}</span>
                            <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full ml-2">@{rule.targetRole}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50">
                        <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-brand-500 rounded-full hover:bg-brand-50">
                        <Save size={18} />
                    </button>
                </div>
                </div>
            );
        })}
      </div>

      <div className="mt-8 p-4 bg-brand-50 rounded-lg border border-brand-100">
        <h4 className="font-semibold text-brand-800 mb-2">行业最佳实践模版 (Best Practice)</h4>
        <div className="flex gap-2 flex-wrap">
            {['OTD 严重积压预警', '质量异常熔断机制', 'VIP客户加急通道'].map(t => (
                <button key={t} className="text-xs bg-white text-brand-600 border border-brand-200 px-3 py-1.5 rounded-full hover:bg-brand-600 hover:text-white transition-colors">
                    + {t}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RuleEngine;