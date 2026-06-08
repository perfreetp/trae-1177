import { useState } from 'react'
import { Phone, MessageCircle, MapPin, User, Radio, AlertOctagon, Send, ChevronRight } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { mockTeamMembers } from '@/utils/mockData'

const ROLE_LABELS: Record<string, string> = {
  ranger: '护林员',
  captain: '巡护队长',
  dispatcher: '值班调度',
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`
}

export default function Contact() {
  const currentUser = useStore(s => s.currentUser)
  const [showSosConfirm, setShowSosConfirm] = useState(false)
  const [sosHold, setSosHold] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, sender: '张建国', time: '10:32', content: '西区巡护完毕，一切正常' },
    { id: 2, sender: '李明辉', time: '10:15', content: '发现疑似盗猎痕迹，已标记位置' },
    { id: 3, sender: '王大山', time: '09:48', content: '今日天气转阴，注意安全' },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), sender: '我', time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }), content: message }])
    setMessage('')
  }

  const handleSosDown = () => setSosHold(true)
  const handleSosUp = () => {
    if (sosHold) setSosHold(false)
  }

  return (
    <div className="min-h-screen bg-[#0a1f14] text-white max-w-md mx-auto pb-6">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Radio className="w-5 h-5 text-green-400" /> 通讯联络
        </h1>
      </div>

      <div className="px-4 mb-4">
        <div className="relative w-full h-48 rounded-xl bg-[#0d2818] overflow-hidden border border-[#1e4a33]">
          <div className="absolute top-2 left-2 text-xs text-green-400/70 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> 队员位置分布
          </div>
          <div className="absolute w-3 h-3 bg-green-400 rounded-full top-[35%] left-[25%] animate-pulse" />
          <span className="absolute top-[30%] left-[30%] text-[10px] text-green-300">张建国</span>
          <div className="absolute w-3 h-3 bg-blue-400 rounded-full top-[55%] left-[60%] animate-pulse" />
          <span className="absolute top-[50%] left-[65%] text-[10px] text-blue-300">李明辉</span>
          <div className="absolute w-3 h-3 bg-yellow-400 rounded-full top-[25%] left-[70%] animate-pulse" />
          <span className="absolute top-[20%] left-[75%] text-[10px] text-yellow-300">王大山</span>
          <div className="absolute w-3 h-3 bg-red-400 rounded-full top-[65%] left-[35%] animate-pulse" />
          <span className="absolute top-[60%] left-[40%] text-[10px] text-red-300">赵铁柱</span>
          <div className="absolute w-2.5 h-2.5 bg-white rounded-full top-[50%] left-[45%] ring-2 ring-green-500" />
          <span className="absolute top-[45%] left-[50%] text-[10px] text-white font-bold">我</span>
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="absolute border border-green-800/40 rounded-full"
                style={{ width: 60 + i * 30, height: 60 + i * 30, top: '50%', left: '45%', transform: 'translate(-50%, -50%)' }} />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-2 mb-4">
        <h2 className="text-sm font-semibold text-green-300 mb-1">队员列表</h2>
        {mockTeamMembers.map((member) => (
          <div key={member.id} className="bg-[#132d1f] border border-[#1e4a33] rounded-xl p-3 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-[#1e4a33] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-400" />
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#132d1f] ${member.online ? 'bg-green-400' : 'bg-gray-500'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{member.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e4a33] text-green-400">{ROLE_LABELS[member.role] || member.role}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-400">{member.phone}</span>
                <span className="text-[10px] text-green-400/70">· {getDistance(currentUser.latitude, currentUser.longitude, member.latitude, member.longitude)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-[#1e4a33] flex items-center justify-center active:scale-95 transition-transform">
                <MessageCircle className="w-4 h-4 text-green-400" />
              </button>
              <button className="w-8 h-8 rounded-full bg-[#1e4a33] flex items-center justify-center active:scale-95 transition-transform">
                <Phone className="w-4 h-4 text-blue-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mb-4">
        <div className="bg-[#132d1f] border border-[#1e4a33] rounded-xl p-4 flex flex-col items-center">
          <button className="relative w-20 h-20 rounded-full flex items-center justify-center group active:scale-95 transition-transform">
            <div className="absolute inset-0 rounded-full border-2 border-red-500/50 animate-[spin_3s_linear_infinite] group-active:border-red-400" style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }} />
            <div className="absolute inset-1 rounded-full border-2 border-red-600/30 animate-[spin_4s_linear_infinite_reverse]" style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent' }} />
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/30 group-active:bg-red-500">
              <Phone className="w-6 h-6 text-white" />
            </div>
          </button>
          <span className="mt-2 text-sm font-medium text-red-400">呼叫值班室</span>
        </div>
      </div>

      <div className="px-4 mb-4">
        <button
          onMouseDown={handleSosDown}
          onMouseUp={handleSosUp}
          onTouchStart={handleSosDown}
          onTouchEnd={handleSosUp}
          onClick={() => setShowSosConfirm(true)}
          className="w-full py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-xl flex items-center justify-center gap-2 font-bold text-base shadow-lg shadow-red-600/30 active:scale-[0.98] transition-transform"
        >
          <AlertOctagon className="w-5 h-5 animate-pulse" />
          紧急求助
        </button>
        {sosHold && (
          <div className="mt-2 text-center text-xs text-red-400 animate-pulse">长按发送求助信号...</div>
        )}
      </div>

      {showSosConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-8">
          <div className="bg-[#132d1f] border border-red-600/50 rounded-2xl p-6 w-full max-w-sm text-center">
            <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">确认发送紧急求助？</h3>
            <p className="text-sm text-gray-400 mb-4">此操作将通知所有在线队员及值班室</p>
            <div className="flex gap-3">
              <button onClick={() => setShowSosConfirm(false)} className="flex-1 py-2.5 rounded-xl bg-[#1e4a33] text-gray-300 font-medium active:scale-95 transition-transform">取消</button>
              <button onClick={() => setShowSosConfirm(false)} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold active:scale-95 transition-transform">确认求助</button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4">
        <h2 className="text-sm font-semibold text-green-300 mb-2 flex items-center gap-1">
          <MessageCircle className="w-4 h-4" /> 群组消息
        </h2>
        <div className="bg-[#132d1f] border border-[#1e4a33] rounded-xl overflow-hidden">
          <div className="max-h-40 overflow-y-auto p-3 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-green-400">{msg.sender}</span>
                  <span className="text-[10px] text-gray-500">{msg.time}</span>
                </div>
                <span className="text-xs text-gray-300 mt-0.5">{msg.content}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#1e4a33] p-2 flex items-center gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="输入消息..."
              className="flex-1 bg-[#0d2818] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none border border-[#1e4a33] focus:border-green-500/50"
            />
            <button onClick={handleSendMessage} className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center active:scale-95 transition-transform">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
