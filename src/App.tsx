import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Game from './pages/Game'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Results from './pages/Results'
import Review from './pages/Review'
import Upload from './pages/Upload'
import { useQuizStore } from './store/useQuizStore'

function App() {
  const location = useLocation()
  const theme = useQuizStore((state) => state.settings.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-screen text-ink">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 md:px-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/game" element={<Game />} />
            <Route path="/results" element={<Results />} />
            <Route path="/review" element={<Review />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
