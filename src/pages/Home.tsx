import { useNavigate } from 'react-router-dom'
import { MapPin, AlertTriangle, Phone, Package, Wifi, BarChart3, Clock, Navigation, Cloud, Signal, ChevronRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/store/useStore'

const quickActions = [
  { icon: MapPin, label: '打卡', path: '/route', color: 'text-emerald-400' },
  { icon: AlertTriangle, label: '上报', path: '/report', color: 'text-amber-400' },
  { icon: Phone, label: '呼叫', path: '/contact', color: 'text-sky-400' },
  { icon: Package, label: '物资', path: '/supply', color: 'text-orange-400' },
  { icon: Wifi, label: '离线', path: '/offline', color: 'text-purple-400' },
  { icon: BarChart3, label: '统计', path: '/stats', color: 'text-rose-400' },
]

export default function Home() {
  const navigate = useNavigate()
  const emergencyAlerts = useStore((s) => s.emergencyAlerts)
  const currentTask = useStore((s) => s.currentTask)
  const completedTasks = useStore((s) => s.completedTasks)
  const patrolTracks = useStore((s) => s.patrolTracks)

  const today = new Date().toISOString().split('T')[0]
  const todayTrackDistance = patrolTracks
    .filter(t => t.startTime && t.startTime.startsWith(today))
    .reduce((sum, t) => sum + t.distance, 0)
  const todayDistance = Math.round((todayTrackDistance + (currentTask?.status === 'completed' && currentTask.startTime?.startsWith(today) ? currentTask.distance : 0) + 3.2) * 10) / 10

  const completedCount = currentTask?.checkpoints?.filter((c: any) => c.checked).length ?? 0
  const totalCount = currentTask?.checkpoints?.length ?? 0
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const statusCards = [
    { icon: Clock, label: '在线时长', value: '2.5h', color: 'text-emerald-300' },
    { icon: Navigation, label: '今日行程', value: `${todayDistance}km`, color: 'text-sky-300' },
    { icon: Cloud, label: '天气状况', value: '多云 18°C', color: 'text-amber-300' },
    { icon: Signal, label: '信号强度', value: '4G', color: 'text-green-300' },
  ]

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#0a1f14] text-white pb-6">
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">你好，张伟</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 bg-[#2D6A4F] text-emerald-200 text-xs px-2 py-0.5 rounded-full">
              <ShieldCheck size={12} />
              巡护员
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              在线
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#1B4332] flex items-center justify-center border border-[#2D6A4F]">
          <span className="text-sm font-medium">张</span>
        </div>
      </header>

      {emergencyAlerts && emergencyAlerts.length > 0 && (
        <div className="mx-4 mb-4 bg-amber-900/40 border border-amber-600/50 rounded-xl px-3 py-2.5 flex items-center gap-2">
          <AlertTriangle size={16} className="text-[#D4A017] animate-pulse shrink-0" />
          <div className="overflow-hidden flex-1">
            <div className="flex animate-marquee whitespace-nowrap">
              {emergencyAlerts.map((alert: any, i: number) => (
                <span key={i} className="text-amber-200 text-xs mr-8">
                  {alert.title || alert.content || alert}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="px-4 mb-5">
        <div className="bg-[#132d1f] border border-[#1e4a33] rounded-xl p-4">
          {currentTask ? (
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1e4a33" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="#2D6A4F" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold">{Math.round(progress)}%</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{currentTask.routeName}</h3>
                <p className="text-emerald-300 text-xs mt-1">
                  已完成 {completedCount}/{totalCount} 个打卡点
                </p>
                <button
                  className="mt-2 flex items-center text-xs text-emerald-400 hover:text-emerald-300"
                  onClick={() => navigate('/route')}
                >
                  继续巡护 <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-6">
              <p className="text-emerald-300/70 text-sm">暂无进行中的任务</p>
            </div>
          )}
        </div>
        {completedTasks.length > 0 && (
          <button
            onClick={() => navigate('/stats')}
            className="mt-2 w-full bg-[#132d1f] border border-[#1e4a33] rounded-xl px-4 py-2.5 flex items-center justify-between hover:bg-[#1e4a33] transition-colors"
          >
            <span className="flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 size={14} className="text-emerald-400" />
              已完成 {completedTasks.length} 条路线
            </span>
            <ChevronRight size={14} className="text-emerald-300/50" />
          </button>
        )}
      </section>

      <section className="px-4 mb-5">
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="bg-[#132d1f] border border-[#1e4a33] rounded-xl p-4 flex flex-col items-center gap-2 min-h-[88px] active:bg-[#1e4a33] transition-colors"
            >
              <action.icon size={24} className={action.color} />
              <span className="text-xs text-emerald-200">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="px-4">
        <h2 className="text-sm font-semibold text-emerald-300 mb-3">实时状态</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {statusCards.map((card) => (
            <div
              key={card.label}
              className="bg-[#132d1f] border border-[#1e4a33] rounded-xl p-3 min-w-[120px] shrink-0"
            >
              <card.icon size={16} className={card.color} />
              <p className="text-white text-lg font-bold mt-2">{card.value}</p>
              <p className="text-emerald-300/70 text-xs mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 12s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
