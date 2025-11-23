import React from 'react';
import { ProcessNode, NodeStatus, NodeType } from '../types';
import { AlertCircle, CheckCircle, ArrowRight, Activity } from 'lucide-react';

interface ProcessMapProps {
  nodes: ProcessNode[];
  onNodeClick: (node: ProcessNode) => void;
  selectedNodeId: string | null;
}

const ProcessMap: React.FC<ProcessMapProps> = ({ nodes, onNodeClick, selectedNodeId }) => {
  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-8 overflow-x-auto shadow-sm">
      <div className="flex items-center justify-between min-w-max relative">
        {/* Connection Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0 transform -translate-y-1/2" />
        
        {nodes.map((node, index) => {
          const isSelected = selectedNodeId === node.id;
          const isCritical = node.status === NodeStatus.CRITICAL;
          const isWarning = node.status === NodeStatus.WARNING;
          
          let statusColor = 'bg-brand-500 border-brand-500'; // Default healthy
          if (isCritical) statusColor = 'bg-red-500 border-red-500';
          else if (isWarning) statusColor = 'bg-orange-500 border-orange-500';
          else if (node.status === NodeStatus.HEALTHY) statusColor = 'bg-emerald-500 border-emerald-500';

          return (
            <div key={node.id} className="relative z-10 flex flex-col items-center group cursor-pointer" onClick={() => onNodeClick(node)}>
              
              {/* Node Circle */}
              <div className={`
                relative w-16 h-16 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300
                ${statusColor}
                ${isSelected ? 'ring-4 ring-offset-2 ring-brand-300 scale-110' : 'hover:scale-105'}
                shadow-lg
              `}>
                {isCritical && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                )}
                
                {node.status === NodeStatus.CRITICAL ? (
                  <AlertCircle size={28} />
                ) : node.status === NodeStatus.WARNING ? (
                  <Activity size={28} />
                ) : (
                  <CheckCircle size={28} />
                )}

                {/* Badge for Active Tasks */}
                {node.activeTasks > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {node.activeTasks}
                  </div>
                )}
              </div>

              {/* Node Title & Metric Preview */}
              <div className="mt-4 text-center">
                <h3 className={`font-semibold text-sm ${isSelected ? 'text-brand-700' : 'text-slate-700'}`}>
                  {node.title}
                </h3>
                {isCritical && (
                  <span className="text-xs text-red-500 font-medium animate-pulse">
                    异常阻断
                  </span>
                )}
              </div>

              {/* Connector Arrow (except last) */}
              {index < nodes.length - 1 && (
                <div className="absolute left-[100%] top-1/2 transform -translate-y-1/2 ml-4 text-slate-300">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessMap;