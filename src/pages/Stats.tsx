import { useState } from 'react'
import { Navigation, Calendar, Clock, MapPin, Download, TrendingUp, CheckCircle2, AlertTriangle, Users, BarChart3 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { totalDistance, totalPatrolDays, totalCheckpoints, totalReports, totalReturns, todayDistance } from '@/utils/mockData'

const weeklyData = [
  { day: '周一', distance: 5.2 },
  { day: '周二', distance: 3.8 },
  { day: '周三', distance: 7.1 },
  { day: '周四', distance: 2.4 },
  { day: '周五', distance: 6.3 },
  { day: '周六', distance: 4.7 },
  { day: '周日', distance: 3.2 },
]

const historyRecords = [
  { id: 1, date: '2026-06-08', route: '北坡主线巡护道', distance: 3.2, duration: '1h 42m', checkpoints: 4 },
  { id: 2, date: '2026-06-07', route: '东坡监测路线', distance: 4.7, duration: '2h 15m', checkpoints: 5 },
  { id: 3, date: '2026-06-06', route: '南坡巡逻线路', distance: 6.3, duration: '2h 50m', checkpoints: 6 },
  { id: 4, date: '2026-06-05', route: '西坡防火通道', distance: 2.4, duration: '1h 10m', checkpoints: 3 },
  { id: 5, date: '2026-06-04', route: '北坡主线巡护道', distance: 7.1, duration: '3h 05m', checkpoints: 7 },
  { id: 6, date: '2026-06-03', route: '东坡监测路线', distance: 3.8, duration: '1h 55m', checkpoints: 4 },
  { id: 7, date: '2026-06-02', route: '山顶瞭望线路', distance: 5.2, duration: '2h 30m', checkpoints: 5 },
]

const DAILY_GOAL = 10

export default function Stats() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [exportMessage, setExportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const todayKm = todayDistance ?? 3.2
  const progress = Math.min((todayKm / DAILY_GOAL) * 100, 100)
  const maxWeekly = Math.max(...weeklyData.map(d => d.distance))

  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const handleExport = () => {
    setExportMessage(null)

    if (!startDate || !endDate) {
      setExportMessage({ type: 'error', text: '请选择开始日期和结束日期' })
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      setExportMessage({ type: 'error', text: '开始日期不能晚于结束日期' })
      return
    }

    const filtered = historyRecords.filter(r => {
      return r.date >= startDate && r.date <= endDate
    })

    if (filtered.length === 0) {
      setExportMessage({ type: 'error', text: '所选日期范围内没有巡护记录' })
      return
    }

    const BOM = '\uFEFF'
    const header = '日期,路线,里程(km),时长,打卡点数'
    const rows = filtered.map(r =>
      `${r.date},${r.route},${r.distance},${r.duration},${r.checkpoints}`
    )
    const csvContent = BOM + header + '\n' + rows.join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `巡护记录_${startDate}_${endDate}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setExportMessage({ type: 'success', text: `成功导出 ${filtered.length} 条记录` })
    setTimeout(() => setExportMessage(null), 3000)
  }

  return (
    <div className="min-h-screen bg-[#0a1f14] text-white pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
        <div className="text-center">
          <h1 className="text-xl font-bold">巡护统计</h1>
          <p className="text-sm text-emerald-400/60 mt-1">记录每一次守护</p>
        </div>

        <div className="bg-[#132d1f] border border-[#1e4a33] rounded-2xl p-5 flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg width="120" height="120" className="-rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#1e4a33" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke="url(#progressGradient)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-emerald-400">{todayKm}</span>
              <span className="text-[10px] text-emerald-400/60">km</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400/60">
                <Navigation size={12} />
                <span>今日里程</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">{todayKm} <span className="text-sm font-normal">km</span></p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400/60">
                <TrendingUp size={12} />
                <span>累计里程</span>
              </div>
              <p className="text-2xl font-bold">{totalDistance} <span className="text-sm font-normal text-white/50">km</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Calendar, label: '巡护天数', value: `${totalPatrolDays}天`, color: 'text-emerald-400' },
            { icon: CheckCircle2, label: '打卡次数', value: `${totalCheckpoints}次`, color: 'text-teal-400' },
            { icon: AlertTriangle, label: '上报隐患', value: `${totalReports}次`, color: 'text-amber-400' },
            { icon: Users, label: '劝返人数', value: `${totalReturns}人`, color: 'text-sky-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-[#132d1f] border border-[#1e4a33] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className={color} />
                <span className="text-xs text-white/50">{label}</span>
              </div>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#132d1f] border border-[#1e4a33] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-emerald-400" />
            <span className="text-sm font-medium">本周巡护里程</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-36">
            {weeklyData.map(({ day, distance }) => {
              const height = (distance / maxWeekly) * 100
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-emerald-400/80 font-medium">{distance}</span>
                  <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                    <div
                      className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-emerald-700 to-emerald-400 transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/40">{day}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-[#132d1f] border border-[#1e4a33] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Download size={16} className="text-emerald-400" />
            <span className="text-sm font-medium">导出记录</span>
          </div>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="text-[10px] text-white/40 mb-1 block">开始日期</label>
              <input
                type="date"
                value={startDate}
                onChange={e => { setStartDate(e.target.value); setExportMessage(null) }}
                className="w-full bg-[#0a1f14] border border-[#1e4a33] rounded-lg px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-white/40 mb-1 block">结束日期</label>
              <input
                type="date"
                value={endDate}
                onChange={e => { setEndDate(e.target.value); setExportMessage(null) }}
                className="w-full bg-[#0a1f14] border border-[#1e4a33] rounded-lg px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <button
            onClick={handleExport}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download size={14} />
            导出记录
          </button>
          {exportMessage && (
            <div className={`mt-3 text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${
              exportMessage.type === 'success'
                ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/30'
                : 'bg-red-900/40 text-red-300 border border-red-700/30'
            }`}>
              {exportMessage.type === 'success' ? (
                <CheckCircle2 size={14} />
              ) : (
                <AlertTriangle size={14} />
              )}
              {exportMessage.text}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Clock size={14} className="text-emerald-400" />
            巡护记录
          </h2>
          <div className="space-y-3">
            {historyRecords.map((record, idx) => (
              <div key={record.id} className="bg-[#132d1f] border border-[#1e4a33] rounded-xl p-4 relative">
                {idx < historyRecords.length - 1 && (
                  <div className="absolute left-[30px] bottom-0 translate-y-full w-[2px] h-3 bg-[#1e4a33]" />
                )}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0 ring-4 ring-[#132d1f]" />
                    <div>
                      <p className="text-sm font-medium">{record.route}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{record.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">{record.distance} km</p>
                    <p className="text-[10px] text-white/40">{record.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 ml-[22px]">
                  <span className="flex items-center gap-1 text-[10px] text-white/50">
                    <MapPin size={10} /> {record.checkpoints} 个打卡点
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-white/50">
                    <CheckCircle2 size={10} /> 已完成
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
