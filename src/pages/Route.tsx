import { useState } from 'react'
import { MapPin, Clock, Mountain, CheckCircle2, Circle, ChevronRight, Navigation, AlertCircle } from 'lucide-react'
import { useStore } from '@/store/useStore'

const difficultyConfig = {
  easy: { label: '简单', bg: 'bg-emerald-600' },
  medium: { label: '中等', bg: 'bg-amber-600' },
  hard: { label: '困难', bg: 'bg-red-600' },
}

export default function Route() {
  const { routes, currentTask, completedTasks, claimRoute, checkIn } = useStore()
  const [animatingId, setAnimatingId] = useState<string | null>(null)

  const claimedRouteIds = new Set([
    ...routes.filter(r => r.status === 'claimed').map(r => r.id),
    ...completedTasks.map(t => t.routeId),
    ...(currentTask ? [currentTask.routeId] : []),
  ])
  const availableRoutes = routes.filter(r => r.status === 'available' && !claimedRouteIds.has(r.id))

  const progress = currentTask
    ? Math.round((currentTask.completedCheckpoints / currentTask.totalCheckpoints) * 100)
    : 0
  const nextCheckpoint = currentTask?.checkpoints.find(cp => !cp.checked)

  const handleCheckIn = (checkpointId: string) => {
    setAnimatingId(checkpointId)
    setTimeout(() => {
      checkIn(checkpointId)
      setAnimatingId(null)
    }, 600)
  }

  const canClaimNew = !currentTask || currentTask.status === 'completed'

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#0a1f14] text-gray-100 pb-8">
      <header className="px-4 pt-6 pb-3">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Mountain className="w-5 h-5 text-emerald-400" />
          巡护路线
        </h1>
        <p className="text-sm text-gray-400 mt-1">封山巡护任务管理</p>
      </header>

      {currentTask && (
        <section className="px-4 mb-6">
          <div className="bg-[#132d1f] border border-[#1e4a33] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-emerald-300 flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                当前任务
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300">
                {currentTask.status === 'in_progress' ? '进行中' : currentTask.status === 'completed' ? '已完成' : '待开始'}
              </span>
            </div>
            <p className="text-sm font-medium mb-2">{currentTask.routeName}</p>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>巡查进度</span>
              <span>{currentTask.completedCheckpoints}/{currentTask.totalCheckpoints} 个卡点</span>
            </div>
            <div className="w-full h-2 bg-[#0a1f14] rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="relative w-full h-36 bg-[#0d2818] rounded-lg overflow-hidden border border-[#1e4a33]">
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <path d="M0,150 Q50,80 100,120 T200,90 T300,110 T400,70" fill="none" stroke="#2D6A4F" strokeWidth="2" />
                  <path d="M0,170 Q80,100 160,130 T320,100 T400,90" fill="none" stroke="#1B4332" strokeWidth="1.5" />
                  <circle cx="100" cy="120" r="4" fill="#34d399" />
                  <circle cx="200" cy="90" r="4" fill="#34d399" />
                  <circle cx="300" cy="110" r="4" fill="#34d399" />
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-emerald-500/60 text-sm font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  封控区域地图
                </span>
              </div>
              <div className="absolute top-2 right-2 bg-red-900/70 text-red-300 text-[10px] px-1.5 py-0.5 rounded">
                边界警戒
              </div>
            </div>
          </div>
        </section>
      )}

      {currentTask && currentTask.status !== 'completed' && (
        <section className="px-4 mb-6">
          <h2 className="font-semibold text-emerald-300 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            巡查卡点
          </h2>
          <div className="space-y-2">
            {currentTask.checkpoints.map((cp) => (
              <div
                key={cp.id}
                className="bg-[#132d1f] border border-[#1e4a33] rounded-xl p-3 flex items-center gap-3"
              >
                <div className="text-xs text-gray-500 w-6 text-center font-mono">{cp.order}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${cp.checked ? 'text-gray-400 line-through' : ''}`}>
                    {cp.name}
                  </p>
                  {cp.checked && cp.checkedAt && (
                    <p className="text-[10px] text-gray-500">
                      {new Date(cp.checkedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
                {cp.checked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-600 shrink-0" />
                )}
                {nextCheckpoint?.id === cp.id && !cp.checked && (
                  <button
                    onClick={() => handleCheckIn(cp.id)}
                    className={`shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold relative overflow-hidden
                      ${animatingId === cp.id ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-600 text-white active:scale-95 transition-transform'}`}
                  >
                    {animatingId === cp.id && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="absolute w-full h-full bg-emerald-300/50 rounded-lg animate-ping" />
                      </span>
                    )}
                    <span className="relative z-10">打卡</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {currentTask && currentTask.status === 'completed' && (
        <section className="px-4 mb-6">
          <div className="bg-[#132d1f] border border-emerald-700/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-300">任务已完成</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {currentTask.routeName} · {currentTask.completedCheckpoints}/{currentTask.totalCheckpoints} 卡点
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-4">
        <h2 className="font-semibold text-emerald-300 mb-3 flex items-center gap-2">
          <Mountain className="w-4 h-4" />
          可领取路线
        </h2>
        {!canClaimNew ? (
          <div className="bg-[#132d1f] border border-[#1e4a33] rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm">请先完成当前巡护任务</p>
          </div>
        ) : availableRoutes.length === 0 ? (
          <div className="bg-[#132d1f] border border-[#1e4a33] rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm">暂无可领取路线</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableRoutes.map(route => {
              const diff = difficultyConfig[route.difficulty]
              return (
                <div key={route.id} className="bg-[#132d1f] border border-[#1e4a33] rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{route.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${diff.bg}`}>
                      {diff.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{route.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {route.estimatedDuration}h
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {route.distance}km
                    </span>
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" />
                      {route.checkpoints.length}个卡点
                    </span>
                  </div>
                  <button
                    onClick={() => claimRoute(route.id)}
                    className="w-full py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] active:scale-[0.98] transition-all rounded-lg text-sm font-semibold text-emerald-300 flex items-center justify-center gap-1"
                  >
                    领取
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
