import { useState } from 'react'
import { Pickaxe, Flame, AlertTriangle, Camera, Mic, Send, Clock, MapPin, CheckCircle2, CloudOff, ChevronLeft } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { HazardReport } from '@/utils/types'

const REPORT_TYPES = [
  { key: 'illegal_mining' as const, label: '偷采偷猎', icon: Pickaxe, accent: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  { key: 'fire_source' as const, label: '火源隐患', icon: Flame, accent: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' },
  { key: 'road_block' as const, label: '临时封路', icon: AlertTriangle, accent: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10' },
]

const SEVERITY_OPTIONS = [
  { key: 'low' as const, label: '低', color: 'bg-emerald-600' },
  { key: 'medium' as const, label: '中', color: 'bg-amber-600' },
  { key: 'high' as const, label: '高', color: 'bg-orange-600' },
  { key: 'critical' as const, label: '紧急', color: 'bg-red-600' },
]

const TYPE_LABELS: Record<string, string> = {
  illegal_mining: '偷采偷猎',
  illegal_hunting: '偷采偷猎',
  fire_source: '火源隐患',
  road_block: '临时封路',
}

const TYPE_COLORS: Record<string, string> = {
  illegal_mining: 'bg-amber-500/20 text-amber-400',
  illegal_hunting: 'bg-amber-500/20 text-amber-400',
  fire_source: 'bg-red-500/20 text-red-400',
  road_block: 'bg-orange-500/20 text-orange-400',
}

const SEVERITY_DOTS: Record<string, string> = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
}

export default function Report() {
  const { hazardReports, submitReport } = useStore()
  const [selectedType, setSelectedType] = useState<HazardReport['type'] | null>(null)
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState<HazardReport['severity']>('medium')
  const [photos, setPhotos] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [hasVoiceNote, setHasVoiceNote] = useState(false)
  const [roadBlockReason, setRoadBlockReason] = useState('')
  const [roadBlockEndTime, setRoadBlockEndTime] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleStartRecording = () => {
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setHasVoiceNote(true)
  }

  const handleSubmit = () => {
    if (!selectedType || !description.trim()) return
    const report: HazardReport = {
      id: `hr${Date.now()}`,
      type: selectedType,
      description: description.trim(),
      latitude: 29.5630 + (Math.random() - 0.5) * 0.01,
      longitude: 106.5516 + (Math.random() - 0.5) * 0.01,
      photos,
      voiceNotes: hasVoiceNote ? [`voice_${Date.now()}`] : [],
      severity,
      createdAt: new Date().toISOString(),
      synced: false,
      status: 'pending',
      ...(selectedType === 'road_block' ? { roadBlockReason, roadBlockEndTime } : {}),
    }
    submitReport(report)
    setSubmitted(true)
    setTimeout(() => {
      setSelectedType(null)
      setDescription('')
      setSeverity('medium')
      setPhotos([])
      setHasVoiceNote(false)
      setRoadBlockReason('')
      setRoadBlockEndTime('')
      setSubmitted(false)
    }, 1500)
  }

  const recentReports = hazardReports.slice(0, 5)

  if (submitted) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#0a1f14] flex items-center justify-center p-6">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <p className="text-emerald-300 text-lg font-medium">上报成功</p>
          <p className="text-emerald-400/60 text-sm mt-1">报告已加入同步队列</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#0a1f14] pb-24">
      <div className="sticky top-0 z-10 bg-[#0a1f14]/90 backdrop-blur px-4 py-3 flex items-center gap-3 border-b border-[#1e4a33]">
        <ChevronLeft className="w-5 h-5 text-emerald-400" />
        <h1 className="text-lg font-bold text-emerald-50">隐患上报</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {REPORT_TYPES.map(t => {
            const Icon = t.icon
            const active = selectedType === t.key
            return (
              <button
                key={t.key}
                onClick={() => setSelectedType(t.key)}
                className={`rounded-xl border p-4 flex flex-col items-center gap-2 transition-all ${active ? `${t.bg} ${t.border} ring-1 ring-current ${t.accent}` : 'bg-[#132d1f] border-[#1e4a33] text-emerald-400/60'}`}
              >
                <Icon className={`w-8 h-8 ${active ? t.accent : ''}`} />
                <span className={`text-xs font-medium ${active ? 'text-emerald-50' : ''}`}>{t.label}</span>
              </button>
            )
          })}
        </div>

        {selectedType && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-[#132d1f] rounded-xl border border-[#1e4a33] p-4">
              <label className="text-emerald-300/80 text-xs mb-2 block">情况描述</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="请描述发现的隐患情况..."
                rows={3}
                className="w-full bg-[#0a1f14] rounded-lg border border-[#1e4a33] px-3 py-2 text-emerald-50 text-sm placeholder-emerald-700 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="bg-[#132d1f] rounded-xl border border-[#1e4a33] p-4 flex items-center gap-3">
              <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-emerald-300/60 text-xs">当前位置</p>
                <p className="text-emerald-200 text-sm font-mono">29.5630°N, 106.5516°E</p>
              </div>
            </div>

            <div className="bg-[#132d1f] rounded-xl border border-[#1e4a33] p-4">
              <label className="text-emerald-300/80 text-xs mb-3 block">严重程度</label>
              <div className="flex gap-2">
                {SEVERITY_OPTIONS.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setSeverity(s.key)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${severity === s.key ? `${s.color} text-white` : 'bg-[#0a1f14] text-emerald-400/50 border border-[#1e4a33]'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#132d1f] rounded-xl border border-[#1e4a33] p-4">
              <label className="text-emerald-300/80 text-xs mb-3 block">现场照片</label>
              <div className="flex gap-2 flex-wrap">
                {photos.map((_, i) => (
                  <div key={i} className="w-20 h-20 rounded-lg bg-[#1e4a33] border border-[#2d6b4a] flex items-center justify-center">
                    <Camera className="w-5 h-5 text-emerald-500/40" />
                  </div>
                ))}
                <button
                  onClick={() => setPhotos(p => [...p, `photo_${Date.now()}`])}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-[#1e4a33] flex items-center justify-center text-emerald-500/40 hover:border-emerald-500/60 transition-colors"
                >
                  <span className="text-2xl leading-none">+</span>
                </button>
              </div>
            </div>

            <div className="bg-[#132d1f] rounded-xl border border-[#1e4a33] p-4">
              <label className="text-emerald-300/80 text-xs mb-3 block">语音备注</label>
              {hasVoiceNote && !isRecording ? (
                <div className="flex items-center gap-3 w-full py-3 rounded-lg border bg-emerald-900/20 border-emerald-500/30">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-600">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-emerald-300 text-sm">语音备注已录制</span>
                    <p className="text-emerald-400/50 text-[10px]">将随报告一起提交</p>
                  </div>
                  <button
                    onClick={() => setHasVoiceNote(false)}
                    className="text-xs text-red-400 px-2 py-1 bg-red-900/30 rounded-lg"
                  >
                    重录
                  </button>
                </div>
              ) : (
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`flex items-center gap-3 w-full py-3 rounded-lg border transition-all ${isRecording ? 'bg-red-500/20 border-red-500/40' : 'bg-[#0a1f14] border-[#1e4a33]'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500' : 'bg-emerald-600'}`}>
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  {isRecording ? (
                    <div className="flex items-center gap-1 flex-1">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-red-400 rounded-full animate-pulse"
                          style={{ height: `${8 + Math.random() * 16}px`, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                      <span className="text-red-300 text-xs ml-2">录音中...</span>
                    </div>
                  ) : (
                    <span className="text-emerald-400/60 text-sm">点击开始录音</span>
                  )}
                </button>
              )}
            </div>

            {selectedType === 'road_block' && (
              <div className="space-y-3">
                <div className="bg-[#132d1f] rounded-xl border border-[#1e4a33] p-4">
                  <label className="text-emerald-300/80 text-xs mb-2 block">封路原因</label>
                  <input
                    value={roadBlockReason}
                    onChange={e => setRoadBlockReason(e.target.value)}
                    placeholder="如：山体滑坡、道路塌方..."
                    className="w-full bg-[#0a1f14] rounded-lg border border-[#1e4a33] px-3 py-2 text-emerald-50 text-sm placeholder-emerald-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="bg-[#132d1f] rounded-xl border border-[#1e4a33] p-4">
                  <label className="text-emerald-300/80 text-xs mb-2 block">预计解除时间</label>
                  <input
                    type="datetime-local"
                    value={roadBlockEndTime}
                    onChange={e => setRoadBlockEndTime(e.target.value)}
                    className="w-full bg-[#0a1f14] rounded-lg border border-[#1e4a33] px-3 py-2 text-emerald-50 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {recentReports.length > 0 && (
          <div className="mt-6">
            <h2 className="text-emerald-300/80 text-xs font-medium mb-3 px-1">近期上报</h2>
            <div className="space-y-2">
              {recentReports.map(r => (
                <div key={r.id} className="bg-[#132d1f] rounded-xl border border-[#1e4a33] p-3 flex items-start gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5 ${TYPE_COLORS[r.type] || 'bg-emerald-500/20 text-emerald-400'}`}>
                    {TYPE_LABELS[r.type] || r.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-emerald-100 text-sm truncate">{r.description}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${SEVERITY_DOTS[r.severity]}`} />
                      {r.voiceNotes && r.voiceNotes.length > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-sky-400">
                          <Mic className="w-3 h-3" />
                          语音
                        </span>
                      )}
                      {r.photos && r.photos.length > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
                          <Camera className="w-3 h-3" />
                          {r.photos.length}张
                        </span>
                      )}
                      <span className="text-emerald-500/50 text-[10px]">
                        <Clock className="w-3 h-3 inline mr-0.5" />
                        {new Date(r.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                  {r.synced ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <CloudOff className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedType && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-[#0a1f14]/90 backdrop-blur border-t border-[#1e4a33]">
          <button
            onClick={handleSubmit}
            disabled={!description.trim()}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:text-emerald-500/50 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            提交上报
          </button>
        </div>
      )}
    </div>
  )
}
