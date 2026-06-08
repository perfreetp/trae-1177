import { useNavigate, useLocation } from 'react-router-dom'
import { Home, MapPin, AlertTriangle, Users, Package, WifiOff, BarChart3 } from 'lucide-react'

const tabs = [
  { path: '/', label: '首页', icon: Home },
  { path: '/route', label: '路线', icon: MapPin },
  { path: '/report', label: '上报', icon: AlertTriangle },
  { path: '/contact', label: '联络', icon: Users },
  { path: '/supply', label: '物资', icon: Package },
  { path: '/offline', label: '离线', icon: WifiOff },
  { path: '/stats', label: '统计', icon: BarChart3 },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a1f14]/95 backdrop-blur-lg border-t border-[#1e4a33]">
      <div className="max-w-md mx-auto flex items-center justify-around py-1.5">
        {tabs.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-400 scale-105'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-normal'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
