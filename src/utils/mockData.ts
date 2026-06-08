import type {
  PatrolUser,
  PatrolRoute,
  PatrolTask,
  HazardReport,
  SupplyItem,
  ReturnRecord,
  EmergencyAlert,
  OfflineMapRegion,
  GroupMessage,
  DailyStats,
} from './types'

export const mockCurrentUser: PatrolUser = {
  id: 'u001',
  name: '张伟',
  role: 'ranger',
  phone: '138****5678',
  latitude: 30.2592,
  longitude: 120.2192,
  online: true,
}

export const mockTeamMembers: PatrolUser[] = [
  { id: 'u002', name: '李强', role: 'ranger', phone: '139****1234', latitude: 30.2612, longitude: 120.2212, online: true },
  { id: 'u003', name: '王芳', role: 'ranger', phone: '137****5678', latitude: 30.2572, longitude: 120.2172, online: true },
  { id: 'u004', name: '赵刚', role: 'captain', phone: '136****9012', latitude: 30.2552, longitude: 120.2152, online: true },
  { id: 'u005', name: '刘洋', role: 'ranger', phone: '135****3456', latitude: 30.2632, longitude: 120.2232, online: false },
]

export const mockRoutes: PatrolRoute[] = [
  {
    id: 'r001',
    name: '北岭东坡巡护线',
    difficulty: 'medium',
    estimatedDuration: 4,
    distance: 8.5,
    boundary: [
      [30.265, 120.215], [30.265, 120.225], [30.255, 120.225], [30.255, 120.215],
    ],
    checkpoints: [
      { id: 'cp001', routeId: 'r001', name: '北岭入口', latitude: 30.264, longitude: 120.216, order: 1, checked: false },
      { id: 'cp002', routeId: 'r001', name: '东坡观景台', latitude: 30.262, longitude: 120.219, order: 2, checked: false },
      { id: 'cp003', routeId: 'r001', name: '溪谷交汇处', latitude: 30.260, longitude: 120.221, order: 3, checked: false },
      { id: 'cp004', routeId: 'r001', name: '古木保护区', latitude: 30.258, longitude: 120.220, order: 4, checked: false },
      { id: 'cp005', routeId: 'r001', name: '北岭出口', latitude: 30.256, longitude: 120.217, order: 5, checked: false },
    ],
    status: 'available',
    description: '北岭东坡主要巡护路线，途经观景台和古木保护区',
  },
  {
    id: 'r002',
    name: '南溪谷巡护线',
    difficulty: 'easy',
    estimatedDuration: 3,
    distance: 5.2,
    boundary: [
      [30.258, 120.213], [30.258, 120.220], [30.252, 120.220], [30.252, 120.213],
    ],
    checkpoints: [
      { id: 'cp006', routeId: 'r002', name: '南溪入口', latitude: 30.257, longitude: 120.214, order: 1, checked: false },
      { id: 'cp007', routeId: 'r002', name: '竹林区', latitude: 30.255, longitude: 120.216, order: 2, checked: false },
      { id: 'cp008', routeId: 'r002', name: '水源地', latitude: 30.253, longitude: 120.218, order: 3, checked: false },
    ],
    status: 'available',
    description: '南溪谷沿线巡护，难度较低，适合新入职护林员',
  },
  {
    id: 'r003',
    name: '西峰密林巡护线',
    difficulty: 'hard',
    estimatedDuration: 6,
    distance: 12.3,
    boundary: [
      [30.268, 120.210], [30.268, 120.218], [30.258, 120.218], [30.258, 120.210],
    ],
    checkpoints: [
      { id: 'cp009', routeId: 'r003', name: '西峰大本营', latitude: 30.267, longitude: 120.211, order: 1, checked: false },
      { id: 'cp010', routeId: 'r003', name: '密林深处', latitude: 30.265, longitude: 120.213, order: 2, checked: false },
      { id: 'cp011', routeId: 'r003', name: '悬崖观察点', latitude: 30.263, longitude: 120.215, order: 3, checked: false },
      { id: 'cp012', routeId: 'r003', name: '深谷底部', latitude: 30.261, longitude: 120.214, order: 4, checked: false },
      { id: 'cp013', routeId: 'r003', name: '返回大本营', latitude: 30.267, longitude: 120.211, order: 5, checked: false },
    ],
    status: 'available',
    description: '西峰密林高难度巡护线，需要经验丰富的护林员',
  },
]

export const mockCurrentTask: PatrolTask | null = {
  id: 't001',
  routeId: 'r001',
  userId: 'u001',
  routeName: '北岭东坡巡护线',
  status: 'in_progress',
  startTime: new Date(Date.now() - 2 * 3600000).toISOString(),
  completedCheckpoints: 2,
  totalCheckpoints: 5,
  distance: 8.5,
  checkpoints: [
    { id: 'cp001', routeId: 'r001', name: '北岭入口', latitude: 30.264, longitude: 120.216, order: 1, checked: true, checkedAt: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'cp002', routeId: 'r001', name: '东坡观景台', latitude: 30.262, longitude: 120.219, order: 2, checked: true, checkedAt: new Date(Date.now() - 1.5 * 3600000).toISOString() },
    { id: 'cp003', routeId: 'r001', name: '溪谷交汇处', latitude: 30.260, longitude: 120.221, order: 3, checked: false },
    { id: 'cp004', routeId: 'r001', name: '古木保护区', latitude: 30.258, longitude: 120.220, order: 4, checked: false },
    { id: 'cp005', routeId: 'r001', name: '北岭出口', latitude: 30.256, longitude: 120.217, order: 5, checked: false },
  ],
}

export const mockHazardReports: HazardReport[] = [
  {
    id: 'hr001',
    type: 'illegal_mining',
    description: '发现可疑采挖痕迹，疑似盗采药材',
    latitude: 30.261,
    longitude: 120.220,
    photos: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=forest%20ground%20with%20digging%20marks%20and%20disturbed%20soil%20in%20a%20dense%20mountain%20forest%20scene&image_size=landscape_4_3'],
    voiceNotes: [],
    severity: 'medium',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    synced: true,
    status: 'processing',
    locationName: '东坡观景台附近',
  },
  {
    id: 'hr002',
    type: 'fire_source',
    description: '发现游客遗留篝火痕迹，已扑灭',
    latitude: 30.259,
    longitude: 120.218,
    photos: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=remnants%20of%20a%20small%20campfire%20with%20ashes%20and%20charred%20wood%20in%20forest%20clearing&image_size=landscape_4_3'],
    voiceNotes: [],
    severity: 'high',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    synced: true,
    status: 'resolved',
    locationName: '溪谷交汇处',
  },
  {
    id: 'hr003',
    type: 'road_block',
    description: '暴雨导致山体滑坡，道路中断',
    latitude: 30.263,
    longitude: 120.216,
    photos: [],
    voiceNotes: [],
    severity: 'critical',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    synced: false,
    status: 'pending',
    locationName: '北岭入口东侧',
    roadBlockReason: '山体滑坡',
    roadBlockEndTime: new Date(Date.now() + 3 * 86400000).toISOString(),
  },
]

export const mockSupplyItems: SupplyItem[] = [
  { id: 's001', name: '对讲机', category: '通讯设备', quantity: 5, unit: '台', locationId: 'loc001', locationName: '北岭物资站', claimed: 3 },
  { id: 's002', name: '急救包', category: '医疗物资', quantity: 10, unit: '个', locationId: 'loc001', locationName: '北岭物资站', claimed: 4 },
  { id: 's003', name: '手电筒', category: '照明设备', quantity: 8, unit: '把', locationId: 'loc001', locationName: '北岭物资站', claimed: 5 },
  { id: 's004', name: '雨衣', category: '防护装备', quantity: 15, unit: '件', locationId: 'loc002', locationName: '南溪物资站', claimed: 6 },
  { id: 's005', name: '干粮', category: '生活物资', quantity: 30, unit: '份', locationId: 'loc002', locationName: '南溪物资站', claimed: 12 },
  { id: 's006', name: '饮用水', category: '生活物资', quantity: 50, unit: '瓶', locationId: 'loc002', locationName: '南溪物资站', claimed: 20 },
  { id: 's007', name: '警戒带', category: '防护装备', quantity: 20, unit: '卷', locationId: 'loc001', locationName: '北岭物资站', claimed: 8 },
  { id: 's008', name: '灭火器', category: '消防物资', quantity: 6, unit: '个', locationId: 'loc001', locationName: '北岭物资站', claimed: 2 },
]

export const mockReturnRecords: ReturnRecord[] = [
  { id: 'rr001', userId: 'u001', peopleCount: 3, reason: '误入封山区', direction: '东侧小路返回', createdAt: new Date(Date.now() - 86400000).toISOString(), synced: true },
  { id: 'rr002', userId: 'u001', peopleCount: 1, reason: '采药', direction: '南面下山', createdAt: new Date(Date.now() - 43200000).toISOString(), synced: true },
  { id: 'rr003', userId: 'u001', peopleCount: 5, reason: '驴友误入', direction: '西侧公路返回', createdAt: new Date(Date.now() - 7200000).toISOString(), synced: false },
]

export const mockEmergencyAlerts: EmergencyAlert[] = [
  { id: 'ea001', title: '暴雨预警', content: '今日14:00-20:00预计有大到暴雨，请注意巡护安全，避免前往溪谷低洼地带', level: 'warning', createdAt: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: 'ea002', title: '火险等级提升', content: '当前火险等级已升至4级，加强火源巡查力度', level: 'urgent', createdAt: new Date(Date.now() - 7200000).toISOString(), read: false },
  { id: 'ea003', title: '新人报到通知', content: '新入职护林员周明将于明日到岗，请队长安排带教', level: 'info', createdAt: new Date(Date.now() - 86400000).toISOString(), read: true },
]

export const mockOfflineRegions: OfflineMapRegion[] = [
  { id: 'om001', name: '北岭东坡区域', size: 45.2, downloaded: true, lastUpdated: '2026-06-05' },
  { id: 'om002', name: '南溪谷区域', size: 32.8, downloaded: true, lastUpdated: '2026-06-03' },
  { id: 'om003', name: '西峰密林区域', size: 68.5, downloaded: false },
  { id: 'om004', name: '东麓缓冲区域', size: 28.3, downloaded: false },
]

export const mockGroupMessages: GroupMessage[] = [
  { id: 'gm001', senderId: 'u004', senderName: '赵刚', content: '各位注意，北岭入口发现有车停靠，请附近人员前往查看', createdAt: new Date(Date.now() - 1800000).toISOString(), type: 'alert' },
  { id: 'gm002', senderId: 'u002', senderName: '李强', content: '收到，我正在东坡，约15分钟可以到达', createdAt: new Date(Date.now() - 1500000).toISOString(), type: 'text' },
  { id: 'gm003', senderId: 'u003', senderName: '王芳', content: '南溪一切正常，未发现异常', createdAt: new Date(Date.now() - 900000).toISOString(), type: 'text' },
  { id: 'gm004', senderId: 'system', senderName: '系统', content: '赵刚 已上线', createdAt: new Date(Date.now() - 600000).toISOString(), type: 'system' },
  { id: 'gm005', senderId: 'u002', senderName: '李强', content: '北岭入口车辆已离开，未发现人员进入', createdAt: new Date(Date.now() - 300000).toISOString(), type: 'text' },
]

export const mockDailyStats: DailyStats[] = [
  { date: '2026-06-02', distance: 8.5, duration: 4.2, checkpoints: 5, reports: 1, returns: 2 },
  { date: '2026-06-03', distance: 5.2, duration: 3.0, checkpoints: 3, reports: 0, returns: 0 },
  { date: '2026-06-04', distance: 12.3, duration: 6.5, checkpoints: 5, reports: 2, returns: 3 },
  { date: '2026-06-05', distance: 6.8, duration: 3.8, checkpoints: 4, reports: 1, returns: 1 },
  { date: '2026-06-06', distance: 9.1, duration: 5.0, checkpoints: 5, reports: 0, returns: 2 },
  { date: '2026-06-07', distance: 7.3, duration: 4.0, checkpoints: 4, reports: 1, returns: 0 },
  { date: '2026-06-08', distance: 3.2, duration: 2.0, checkpoints: 2, reports: 0, returns: 1 },
]

export const todayDistance = 3.2
export const totalDistance = 52.4
export const totalPatrolDays = 156
export const totalCheckpoints = 628
export const totalReports = 5
export const totalReturns = 9
export const pendingSyncCount = 3
export const onlineDuration = 2.5
