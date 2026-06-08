import { useState } from 'react'
import { Package, Minus, Plus, ClipboardList, Users, ChevronDown, ChevronUp, MapPin, Clock } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { ReturnRecord } from '@/utils/types'

const CATEGORIES = ['全部', '通讯设备', '医疗物资', '防护装备', '生活物资', '消防物资', '照明设备']

const CATEGORY_COLORS: Record<string, string> = {
  '通讯设备': 'bg-blue-900/50 text-blue-300',
  '医疗物资': 'bg-red-900/50 text-red-300',
  '防护装备': 'bg-amber-900/50 text-amber-300',
  '生活物资': 'bg-emerald-900/50 text-emerald-300',
  '消防物资': 'bg-orange-900/50 text-orange-300',
  '照明设备': 'bg-yellow-900/50 text-yellow-300',
}

const RETURN_REASONS = ['误入封山区', '采药', '驴友误入', '其他']

function formatTime(iso: string) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function Supply() {
  const { supplyItems, returnRecords, claimSupply, addReturnRecord, currentUser } = useStore()
  const [activeCategory, setActiveCategory] = useState('全部')
  const [claimQty, setClaimQty] = useState<Record<string, number>>({})
  const [showReturn, setShowReturn] = useState(false)
  const [peopleCount, setPeopleCount] = useState(1)
  const [reason, setReason] = useState(RETURN_REASONS[0])
  const [direction, setDirection] = useState('')

  const filtered = activeCategory === '全部'
    ? supplyItems
    : supplyItems.filter(item => item.category === activeCategory)

  const getAvailable = (item: typeof supplyItems[0]) => item.quantity - item.claimed

  const getQty = (itemId: string) => claimQty[itemId] ?? 1

  const adjustQty = (itemId: string, delta: number) => {
    const available = getAvailable(supplyItems.find(i => i.id === itemId)!)
    setClaimQty(prev => {
      const current = prev[itemId] ?? 1
      const next = Math.max(1, Math.min(current + delta, available))
      return { ...prev, [itemId]: next }
    })
  }

  const handleClaim = (itemId: string) => {
    const qty = getQty(itemId)
    claimSupply(itemId, qty)
    setClaimQty(prev => {
      const next = { ...prev }
      delete next[itemId]
      return next
    })
  }

  const handleReturnSubmit = () => {
    if (!direction.trim()) return
    const record: ReturnRecord = {
      id: `rr${Date.now()}`,
      userId: currentUser.id,
      peopleCount,
      reason,
      direction: direction.trim(),
      createdAt: new Date().toISOString(),
      synced: false,
    }
    addReturnRecord(record)
    setPeopleCount(1)
    setReason(RETURN_REASONS[0])
    setDirection('')
  }

  return (
    <div className="min-h-screen bg-[#0a1f14] text-gray-100 max-w-md mx-auto pb-24">
      <div className="sticky top-0 z-10 bg-[#0a1f14] pt-4 pb-2 px-4">
        <h1 className="text-lg font-bold flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-emerald-400" />
          物资领取
        </h1>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#132d1f] text-gray-400 border border-[#1e4a33] hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-3 mt-2">
        {filtered.map(item => {
          const available = getAvailable(item)
          return (
            <div
              key={item.id}
              className="bg-[#132d1f] border border-[#1e4a33] rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{item.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${CATEGORY_COLORS[item.category] || 'bg-gray-800 text-gray-400'}`}>
                    {item.category}
                  </span>
                </div>
                <span className={`text-sm font-bold ${available > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {available > 0 ? `余 ${available}` : '已领完'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span>总 {item.quantity} {item.unit}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.locationName}
                </span>
              </div>
              {available > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustQty(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-[#0a1f14] border border-[#1e4a33] flex items-center justify-center text-emerald-400 active:bg-emerald-900/30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{getQty(item.id)}</span>
                    <button
                      onClick={() => adjustQty(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-[#0a1f14] border border-[#1e4a33] flex items-center justify-center text-emerald-400 active:bg-emerald-900/30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleClaim(item.id)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    领取
                  </button>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center text-gray-600 py-12 text-sm">暂无该分类物资</div>
        )}
      </div>

      <div className="px-4 mt-6">
        <button
          onClick={() => setShowReturn(!showReturn)}
          className="w-full flex items-center justify-between bg-[#132d1f] border border-[#1e4a33] rounded-xl p-4 active:bg-[#1a3d2a] transition-colors"
        >
          <span className="flex items-center gap-2 font-medium text-sm">
            <ClipboardList className="w-4 h-4 text-amber-400" />
            劝返登记
          </span>
          {showReturn ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {showReturn && (
          <div className="bg-[#132d1f] border border-t-0 border-[#1e4a33] rounded-b-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400 w-10 shrink-0">人数</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPeopleCount(v => Math.max(1, v - 1))}
                  className="w-7 h-7 rounded-lg bg-[#0a1f14] border border-[#1e4a33] flex items-center justify-center text-emerald-400"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{peopleCount}</span>
                <button
                  onClick={() => setPeopleCount(v => v + 1)}
                  className="w-7 h-7 rounded-lg bg-[#0a1f14] border border-[#1e4a33] flex items-center justify-center text-emerald-400"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400 w-10 shrink-0">原因</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="flex-1 bg-[#0a1f14] border border-[#1e4a33] rounded-lg px-3 py-1.5 text-sm text-gray-200 outline-none focus:border-emerald-600"
              >
                {RETURN_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400 w-10 shrink-0">方向</label>
              <input
                type="text"
                value={direction}
                onChange={e => setDirection(e.target.value)}
                placeholder="返回方向"
                className="flex-1 bg-[#0a1f14] border border-[#1e4a33] rounded-lg px-3 py-1.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-emerald-600"
              />
            </div>
            <button
              onClick={handleReturnSubmit}
              disabled={!direction.trim()}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              登记
            </button>

            {returnRecords.length > 0 && (
              <div className="mt-2 pt-3 border-t border-[#1e4a33]">
                <p className="text-xs text-gray-500 mb-2">近期记录</p>
                <div className="space-y-2">
                  {returnRecords.slice(0, 5).map(record => (
                    <div key={record.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-300">{record.peopleCount}人</span>
                        <span className="text-gray-500">{record.reason}</span>
                        <span className="text-gray-500">{record.direction}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gray-600" />
                        <span className="text-gray-600">{formatTime(record.createdAt)}</span>
                        {!record.synced && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
