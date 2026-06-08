export interface PatrolUser {
  id: string
  name: string
  role: 'ranger' | 'captain' | 'dispatcher'
  phone: string
  latitude: number
  longitude: number
  online: boolean
  avatar?: string
}

export interface PatrolRoute {
  id: string
  name: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedDuration: number
  distance: number
  boundary: [number, number][]
  checkpoints: Checkpoint[]
  status: 'available' | 'claimed' | 'in_progress' | 'completed'
  description: string
}

export interface Checkpoint {
  id: string
  routeId: string
  name: string
  latitude: number
  longitude: number
  order: number
  checked: boolean
  checkedAt?: string
}

export interface PatrolTask {
  id: string
  routeId: string
  userId: string
  routeName: string
  status: 'pending' | 'in_progress' | 'completed'
  startTime?: string
  endTime?: string
  completedCheckpoints: number
  totalCheckpoints: number
  distance: number
  checkpoints: Checkpoint[]
}

export interface HazardReport {
  id: string
  type: 'illegal_mining' | 'illegal_hunting' | 'fire_source' | 'road_block'
  description: string
  latitude: number
  longitude: number
  photos: string[]
  voiceNotes: string[]
  severity: 'low' | 'medium' | 'high' | 'critical'
  createdAt: string
  synced: boolean
  status: 'pending' | 'processing' | 'resolved'
  locationName?: string
  roadBlockReason?: string
  roadBlockEndTime?: string
}

export interface PatrolTrack {
  id: string
  taskId: string
  points: [number, number][]
  distance: number
  startTime: string
  endTime?: string
  synced: boolean
}

export interface SupplyItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  locationId: string
  locationName: string
  claimed: number
}

export interface ReturnRecord {
  id: string
  userId: string
  peopleCount: number
  reason: string
  direction: string
  createdAt: string
  synced: boolean
}

export interface EmergencyAlert {
  id: string
  title: string
  content: string
  level: 'info' | 'warning' | 'urgent'
  createdAt: string
  read: boolean
}

export interface OfflineMapRegion {
  id: string
  name: string
  size: number
  downloaded: boolean
  progress?: number
  lastUpdated?: string
}

export interface SyncQueueItem {
  id: string
  type: 'checkin' | 'report' | 'track' | 'return_record'
  data: unknown
  createdAt: string
  retryCount: number
}

export interface SyncBreakdown {
  checkin: number
  report: number
  track: number
  return_record: number
}

export interface GroupMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  createdAt: string
  type: 'text' | 'alert' | 'system'
}

export interface DailyStats {
  date: string
  distance: number
  duration: number
  checkpoints: number
  reports: number
  returns: number
}
