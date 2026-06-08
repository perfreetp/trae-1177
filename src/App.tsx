import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import Home from '@/pages/Home'
import RoutePage from '@/pages/Route'
import Report from '@/pages/Report'
import Contact from '@/pages/Contact'
import Supply from '@/pages/Supply'
import Offline from '@/pages/Offline'
import Stats from '@/pages/Stats'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a1f14] text-white">
        <div className="max-w-md mx-auto relative">
          <main className="pb-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/route" element={<RoutePage />} />
              <Route path="/report" element={<Report />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/supply" element={<Supply />} />
              <Route path="/offline" element={<Offline />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </div>
    </Router>
  )
}
