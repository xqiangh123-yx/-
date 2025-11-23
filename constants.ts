import { ProcessNode, NodeType, NodeStatus, Rule, Task, SOP } from './types';

export const MOCK_PROCESS_NODES: ProcessNode[] = [
  {
    id: 'node-1',
    title: '订单锁定 (Order Lock)',
    type: NodeType.START,
    status: NodeStatus.HEALTHY,
    x: 0,
    y: 0,
    description: '客户确认配置，支付定金，订单进入不可更改状态。',
    activeTasks: 0,
    metrics: [
      { id: 'm1', name: '锁单量', value: 120, unit: '单', trend: 'up', isLeading: false },
      { id: 'm2', name: '平均耗时', value: 2, unit: 'h', trend: 'stable', isLeading: true }
    ]
  },
  {
    id: 'node-2',
    title: '生产排程 (Scheduling)',
    type: NodeType.PROCESS,
    status: NodeStatus.CRITICAL, // Bottleneck simulated
    x: 1,
    y: 0,
    description: '根据物料和产能进行排产。',
    activeTasks: 30,
    metrics: [
      { id: 'm3', name: '缺料挂起单', value: 30, unit: '单', trend: 'up', isLeading: true },
      { id: 'm4', name: '排产及时率', value: 82, unit: '%', trend: 'down', isLeading: false }
    ]
  },
  {
    id: 'node-3',
    title: '总装生产 (Assembly)',
    type: NodeType.PROCESS,
    status: NodeStatus.WARNING,
    x: 2,
    y: 0,
    description: '车辆上线组装。',
    activeTasks: 5,
    metrics: [
      { id: 'm5', name: '下线合格率', value: 95, unit: '%', trend: 'stable', isLeading: false },
      { id: 'm6', name: '在制时长', value: 28, unit: 'h', trend: 'up', isLeading: true }
    ]
  },
  {
    id: 'node-4',
    title: '物流发运 (Logistics)',
    type: NodeType.PROCESS,
    status: NodeStatus.HEALTHY,
    x: 3,
    y: 0,
    description: '车辆装车发运至交付中心。',
    activeTasks: 1,
    metrics: [
      { id: 'm7', name: '板车装载率', value: 98, unit: '%', trend: 'up', isLeading: true },
      { id: 'm8', name: '运输时长', value: 48, unit: 'h', trend: 'stable', isLeading: false }
    ]
  },
  {
    id: 'node-5',
    title: '交付 (Delivery)',
    type: NodeType.END,
    status: NodeStatus.HEALTHY,
    x: 4,
    y: 0,
    description: '客户提车，完成最终交付。',
    activeTasks: 0,
    metrics: [
      { id: 'm9', name: 'OTD总时长', value: 21, unit: '天', trend: 'down', isLeading: false },
      { id: 'm10', name: '客诉率', value: 0.5, unit: '%', trend: 'stable', isLeading: false }
    ]
  }
];

export const MOCK_RULES: Rule[] = [
  {
    id: 'rule-1',
    nodeId: 'node-2',
    conditionMetric: '缺料挂起单',
    operator: '>',
    threshold: 20,
    triggerAction: '生成“高优缺料催办”任务',
    targetRole: '计划部主管',
    sopId: 'sop-1'
  },
  {
    id: 'rule-2',
    nodeId: 'node-2',
    conditionMetric: '排产及时率',
    operator: '<',
    threshold: 85,
    triggerAction: '升级预警至运营总监',
    targetRole: '运营总监',
    sopId: 'sop-2'
  }
];

export const MOCK_SOPS: SOP[] = [
  {
    id: 'sop-1',
    title: '缺料异常快速响应 SOP',
    content: '针对排产节点因缺料导致的订单积压处理流程。',
    steps: [
      '在ERP中查询具体缺料的零件号（Part No.）。',
      '检查供应链系统（SCM）该物料的预计到货时间（ETA）。',
      '若ETA > 24小时，尝试调拨兄弟工厂库存。',
      '联系采购专员进行紧急催货。',
      '在系统中标记订单为“缺料挂起”，并通知销售端安抚客户。'
    ]
  },
  {
    id: 'sop-2',
    title: '产能协调会议流程',
    content: '当排产及时率严重下降时，需启动的跨部门协调机制。',
    steps: [
      '拉取过去24小时排产失败明细。',
      '召集生产、物流、采购三方召开紧急碰头会（Stand-up Meeting）。',
      '评估是否需要开启加班班次。'
    ]
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-101',
    title: '处理积压缺料挂起单 (批量)',
    nodeId: 'node-2',
    status: 'pending',
    priority: 'high',
    assignee: '张计划',
    dueDate: new Date(Date.now() + 3600 * 1000 * 4).toISOString(), // 4 hours later
    description: '当前排程节点积压订单超过30单，触发自动预警规则。',
    sopId: 'sop-1'
  },
  {
    id: 'task-102',
    title: '旗舰版车型芯片短缺确认',
    nodeId: 'node-2',
    status: 'in_progress',
    priority: 'medium',
    assignee: '李采购',
    dueDate: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
    description: '旗舰版HUD芯片供应不稳定，需确认本周分配额度。',
    sopId: 'sop-1'
  },
  {
    id: 'task-103',
    title: '总装线工位调整',
    nodeId: 'node-3',
    status: 'completed',
    priority: 'low',
    assignee: '王车间',
    dueDate: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    description: '优化内饰安装工位节拍。',
    sopId: 'sop-2',
    feedback: {
      rootCause: '产线故障',
      comment: '已通过调整工装解决。'
    }
  }
];