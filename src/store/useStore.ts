import { create } from 'zustand'
import type {
  PatrolUser,
  PatrolTask,
  PatrolRoute,
  HazardReport,
  SupplyItem,
  ReturnRecord,
  EmergencyAlert,
  OfflineMapRegion,
  GroupMessage,
  DailyStats,
  Checkpoint,
} from '@/utils/types'
import {
  mockCurrentUser,
  mockRoutes,
  mockCurrentTask,
  mockHazardReports,
  mockSupplyItems,
  mockReturnRecords,
  mockEmergencyAlerts,
  mockOfflineRegions,
  mockGroupMessages,
  mockDailyStats,
  pendingSyncCount,
} from '@/utils/mockData'

interface AppStore {
  currentUser: PatrolUser
  currentTask: PatrolTask | null
  routes: PatrolRoute[]
  hazardReports: HazardReport[]
  supplyItems: SupplyItem[]
  returnRecords: ReturnRecord[]
  emergencyAlerts: EmergencyAlert[]
  offlineRegions: OfflineMapRegion[]
  groupMessages: GroupMessage[]
  dailyStats: DailyStats[]
  onlineStatus: boolean
  pendingSyncCount: number
  isSyncing: boolean

  claimRoute: (routeId: string) => void
  checkIn: (checkpointId: string) => void
  markAlertRead: (alertId: string) => void
  submitReport: (report: HazardReport) => void
  claimSupply: (itemId: string, quantity: number) => void
  addReturnRecord: (record: ReturnRecord) => void
  downloadMap: (regionId: string) => void
  sendMessage: (content: string) => void
  syncOfflineData: () => void
  setOnlineStatus: (status: boolean) => void
}

export const useStore = create<AppStore>((set, get) => ({
  currentUser: mockCurrentUser,
  currentTask: mockCurrentTask,
  routes: mockRoutes,
  hazardReports: mockHazardReports,
  supplyItems: mockSupplyItems,
  returnRecords: mockReturnRecords,
  emergencyAlerts: mockEmergencyAlerts,
  offlineRegions: mockOfflineRegions,
  groupMessages: mockGroupMessages,
  dailyStats: mockDailyStats,
  onlineStatus: true,
  pendingSyncCount,
  isSyncing: false,

  claimRoute: (routeId: string) => {
    const route = get().routes.find(r => r.id === routeId)
    if (!route) return
    const newTask: PatrolTask = {
      id: `t${Date.now()}`,
      routeId: route.id,
      userId: get().currentUser.id,
      routeName: route.name,
      status: 'pending',
      completedCheckpoints: 0,
      totalCheckpoints: route.checkpoints.length,
      distance: route.distance,
      checkpoints: route.checkpoints.map(cp => ({ ...cp, checked: false, checkedAt: undefined })),
    }
    set(state => ({
      routes: state.routes.map(r => r.id === routeId ? { ...r, status: 'claimed' as const } : r),
      currentTask: newTask,
    }))
  },

  checkIn: (checkpointId: string) => {
    set(state => {
      if (!state.currentTask) return state
      const updatedCheckpoints = state.currentTask.checkpoints.map((cp: Checkpoint) =>
        cp.id === checkpointId ? { ...cp, checked: true, checkedAt: new Date().toISOString() } : cp
      )
      const completedCount = updatedCheckpoints.filter((cp: Checkpoint) => cp.checked).length
      const allDone = completedCount === updatedCheckpoints.length
      return {
        currentTask: {
          ...state.currentTask,
          checkpoints: updatedCheckpoints,
          completedCheckpoints: completedCount,
          status: allDone ? 'completed' as const : 'in_progress' as const,
          endTime: allDone ? new Date().toISOString() : undefined,
        },
      }
    })
  },

  markAlertRead: (alertId: string) => {
    set(state => ({
      emergencyAlerts: state.emergencyAlerts.map(a => a.id === alertId ? { ...a, read: true } : a),
    }))
  },

  submitReport: (report: HazardReport) => {
    set(state => ({
      hazardReports: [report, ...state.hazardReports],
      pendingSyncCount: state.onlineStatus ? state.pendingSyncCount : state.pendingSyncCount + 1,
    }))
  },

  claimSupply: (itemId: string, quantity: number) => {
    set(state => ({
      supplyItems: state.supplyItems.map(item =>
        item.id === itemId ? { ...item, claimed: item.claimed + quantity } : item
      ),
    }))
  },

  addReturnRecord: (record: ReturnRecord) => {
    set(state => ({
      returnRecords: [record, ...state.returnRecords],
    }))
  },

  downloadMap: (regionId: string) => {
    set(state => ({
      offlineRegions: state.offlineRegions.map(r =>
        r.id === regionId ? { ...r, downloaded: true, progress: 100, lastUpdated: new Date().toISOString().split('T')[0] } : r
      ),
    }))
  },

  sendMessage: (content: string) => {
    const newMsg: GroupMessage = {
      id: `gm${Date.now()}`,
      senderId: get().currentUser.id,
      senderName: get().currentUser.name,
      content,
      createdAt: new Date().toISOString(),
      type: 'text',
    }
    set(state => ({
      groupMessages: [...state.groupMessages, newMsg],
    }))
  },

  syncOfflineData: () => {
    set({ isSyncing: true })
    setTimeout(() => {
      set(state => ({
        isSyncing: false,
        pendingSyncCount: 0,
        hazardReports: state.hazardReports.map(r => ({ ...r, synced: true })),
        returnRecords: state.returnRecords.map(r => ({ ...r, synced: true })),
      }))
    }, 2000)
  },

  setOnlineStatus: (status: boolean) => {
    set({ onlineStatus: status })
  },
}))
