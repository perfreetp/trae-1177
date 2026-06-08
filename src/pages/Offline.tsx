import { useState, useEffect, useRef } from 'react'
import { Wifi, WifiOff, Download, Cloud, CloudOff, Map, HardDrive, Circle, CircleDot, RefreshCw, CheckCircle2, ChevronDown, ChevronUp, Route } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { PatrolTrack } from '@/utils/types'

export default function Offline() {
  const { onlineStatus, pendingSyncCount, syncBreakdown, isSyncing, offlineRegions, patrolTracks, syncOfflineData, downloadMap, addPatrolTrack } = useStore()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingDistance, setRecordingDistance] = useState(0)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const recordingStartRef = useRef<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
        setRecordingDistance(prev => Math.round((prev + 0.002) * 100) / 100)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording])

  const totalMapSize = offlineRegions.reduce((sum, r) => sum + r.size, 0)
  const downloadedSize = offlineRegions.filter(r => r.downloaded).reduce((sum, r) => sum + r.size, 0)
  const totalStorage = 512
  const usedStorage = 87.3
  const storagePercent = Math.round((usedStorage / totalStorage) * 100)

  const handleDownload = (regionId: string) => {
    setDownloadingId(regionId)
    setDownloadProgress(0)
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          downloadMap(regionId)
          setDownloadingId(null)
          return 0
        }
        return prev + 10
      })
    }, 200)
  }

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      setRecordingDuration(0)
      setRecordingDistance(0)
      recordingStartRef.current = new Date().toISOString()
    } else {
      setIsRecording(false)
      if (recordingStartRef.current && recordingDuration > 0) {
        const track: PatrolTrack = {
          id: `pt_${Date.now()}`,
          taskId: 't001',
          points: [[30.2592, 120.2192], [30.2602, 120.2202], [30.2612, 120.2212]],
          distance: recordingDistance,
          startTime: recordingStartRef.current,
          endTime: new Date().toISOString(),
          synced: false,
        }
        addPatrolTrack(track)
      }
      recordingStartRef.current = null
    }
  }

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.round(seconds % 60)
    if (h > 0) return `${h}h ${m}m`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
  }

  const calcTrackDuration = (track: PatrolTrack) => {
    const start = new Date(track.startTime).getTime()
    const end = track.endTime ? new Date(track.endTime).getTime() : Date.now()
    return Math.max(0, Math.floor((end - start) / 1000))
  }

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

  const formatCoord = (point: [number, number]) => {
    const [lat, lng] = point
    const latDir = lat >= 0 ? 'N' : 'S'
    const lngDir = lng >= 0 ? 'E' : 'W'
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`
  }

  const syncTypes = [
    { label: '打卡记录', count: syncBreakdown.checkin },
    { label: '隐患上报', count: syncBreakdown.report },
    { label: '巡护轨迹', count: syncBreakdown.track },
    { label: '劝返记录', count: syncBreakdown.return_record },
  ]

  return (
    <div className="min-h-screen bg-[#0a1f14] pb-8">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-4">

        <div className={`rounded-2xl border p-5 ${onlineStatus ? 'border-emerald-800/50 bg-[#132d1f]' : 'border-red-900/50 bg-[#1f1315]'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${onlineStatus ? 'bg-emerald-900/60' : 'bg-red-900/60'}`}>
                {onlineStatus ? (
                  <Wifi className="w-6 h-6 text-emerald-400" />
                ) : (
                  <WifiOff className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div>
                <p className={`text-lg font-bold ${onlineStatus ? 'text-emerald-300' : 'text-red-300'}`}>
                  {onlineStatus ? '在线' : '离线'}
                </p>
                <p className="text-xs text-gray-400">
                  {onlineStatus ? '4G · 信号良好' : '无网络连接'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-1.5 rounded-full transition-all duration-500"
                  style={{
                    height: 6 + i * 5,
                    backgroundColor: onlineStatus
                      ? (i <= 3 ? '#34d399' : '#064e3b')
                      : '#374151'
                  }}
                />
              ))}
            </div>
          </div>
          {onlineStatus && (
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400/70">
              <Cloud className="w-3.5 h-3.5" />
              <span>数据同步可用</span>
            </div>
          )}
          {!onlineStatus && (
            <div className="mt-3 flex items-center gap-2 text-xs text-red-400/70">
              <CloudOff className="w-3.5 h-3.5" />
              <span>离线模式 · 数据将缓存本地</span>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#1e4a33] bg-[#132d1f] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="text-white font-semibold">待同步数据</span>
            </div>
            <span className="text-2xl font-bold text-amber-300">{pendingSyncCount}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {syncTypes.map(t => (
              <div key={t.label} className="bg-[#0a1f14]/60 rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="text-xs text-gray-300">{t.label}</span>
                <span className={`text-xs font-semibold ${t.count > 0 ? 'text-amber-300' : 'text-gray-600'}`}>{t.count}</span>
              </div>
            ))}
          </div>
          <button
            onClick={syncOfflineData}
            disabled={isSyncing || pendingSyncCount === 0}
            className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              isSyncing
                ? 'bg-emerald-800/50 text-emerald-300 cursor-wait'
                : pendingSyncCount === 0
                  ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white active:scale-[0.98]'
            }`}
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                同步中...
              </>
            ) : pendingSyncCount === 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                已全部同步
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                开始同步
              </>
            )}
          </button>
          {isSyncing && (
            <div className="mt-3 h-1.5 rounded-full bg-[#0a1f14] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 animate-pulse" style={{ width: '60%' }} />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#1e4a33] bg-[#132d1f] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-semibold">离线地图</span>
            </div>
            <span className="text-xs text-gray-400">{downloadedSize.toFixed(1)}/{totalMapSize.toFixed(1)} MB</span>
          </div>
          <div className="space-y-3">
            {offlineRegions.map(region => (
              <div key={region.id} className="bg-[#0a1f14]/60 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">{region.name}</span>
                  <span className="text-xs text-gray-400">{region.size} MB</span>
                </div>
                {region.downloaded ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs text-emerald-400">已下载</span>
                    </div>
                    <span className="text-xs text-gray-500">更新于 {region.lastUpdated}</span>
                  </div>
                ) : downloadingId === region.id ? (
                  <div className="mt-2">
                    <div className="h-1.5 rounded-full bg-[#0a1f14] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-200"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-emerald-400 mt-1">下载中 {downloadProgress}%</p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDownload(region.id)}
                    className="mt-1 flex items-center gap-1 text-xs text-emerald-300 bg-emerald-900/40 px-2.5 py-1 rounded-lg active:scale-95 transition-transform"
                  >
                    <Download className="w-3 h-3" />
                    下载
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#1e4a33] bg-[#132d1f] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isRecording ? (
                <CircleDot className="w-5 h-5 text-red-400 animate-pulse" />
              ) : (
                <Circle className="w-5 h-5 text-gray-500" />
              )}
              <span className="text-white font-semibold">轨迹记录</span>
            </div>
            <span className={`text-xs ${isRecording ? 'text-red-400' : 'text-gray-500'}`}>
              {isRecording ? '正在记录' : '未在记录'}
            </span>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 bg-[#0a1f14]/60 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">距离</p>
              <p className="text-lg font-bold text-white">{isRecording ? recordingDistance.toFixed(1) : '0.0'} <span className="text-xs text-gray-400">km</span></p>
            </div>
            <div className="flex-1 bg-[#0a1f14]/60 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">时长</p>
              <p className="text-lg font-bold text-white font-mono">{isRecording ? formatDuration(recordingDuration) : '0s'}</p>
            </div>
          </div>
          <button
            onClick={toggleRecording}
            className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              isRecording
                ? 'bg-red-600/80 text-white'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'
            }`}
          >
            {isRecording ? (
              <>
                <Circle className="w-4 h-4" />
                停止记录
              </>
            ) : (
              <>
                <CircleDot className="w-4 h-4" />
                开始记录
              </>
            )}
          </button>
        </div>

        <div className="rounded-2xl border border-[#1e4a33] bg-[#132d1f] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Route className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-semibold">轨迹记录列表</span>
            </div>
            <span className="text-xs text-gray-400">{patrolTracks.length} 条</span>
          </div>
          {patrolTracks.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-500">暂无轨迹记录</div>
          ) : (
            <div className="space-y-2">
              {patrolTracks.map(track => {
                const isSelected = selectedTrackId === track.id
                const durationSec = calcTrackDuration(track)
                return (
                  <div key={track.id}>
                    <div
                      className="bg-[#0a1f14]/60 rounded-xl p-3 cursor-pointer active:scale-[0.99] transition-transform"
                      onClick={() => setSelectedTrackId(isSelected ? null : track.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">{formatTime(track.startTime)}</span>
                        <div className="flex items-center gap-1">
                          {track.synced ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-xs text-emerald-400">已同步</span>
                            </>
                          ) : (
                            <>
                              <CloudOff className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-xs text-amber-400">待同步</span>
                            </>
                          )}
                          {isSelected ? (
                            <ChevronUp className="w-4 h-4 text-gray-400 ml-1" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>结束 {track.endTime ? formatTime(track.endTime) : '—'}</span>
                        <span>|</span>
                        <span>{formatDuration(durationSec)}</span>
                        <span>|</span>
                        <span>{track.distance} km</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="bg-[#0a1f14]/80 rounded-b-xl px-3 pb-3 pt-2 mx-2 border-t border-[#1e4a33]/50">
                        <p className="text-xs text-gray-400 mb-1.5">轨迹点概览</p>
                        <p className="text-xs text-emerald-300 mb-2">共 {track.points.length} 个轨迹点</p>
                        <div className="space-y-1">
                          {track.points.slice(0, 5).map((pt, i) => (
                            <p key={i} className="text-xs text-gray-300 font-mono">
                              {formatCoord(pt)}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#1e4a33] bg-[#132d1f] p-5">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-semibold">存储空间</span>
          </div>
          <div className="mb-2">
            <div className="h-3 rounded-full bg-[#0a1f14] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 transition-all duration-500"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">已用 <span className="text-emerald-300 font-semibold">{usedStorage}</span> MB</span>
            <span className="text-gray-400">共 {totalStorage} MB</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>离线地图: {downloadedSize.toFixed(1)} MB</span>
            <span>轨迹数据: {(usedStorage - downloadedSize).toFixed(1)} MB</span>
          </div>
        </div>

      </div>
    </div>
  )
}
