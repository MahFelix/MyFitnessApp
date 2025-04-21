import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useThemeStore } from './stores/themeStore'
import Layout from './components/layout/Layout'

// Pages
import Dashboard from './pages/Dashboard'
import Workouts from './pages/Workouts'
import WorkoutDetail from './pages/WorkoutDetail'
import Calendar from './pages/Calendar'
import Exercises from './pages/Exercises'
import Admin from './pages/Admin'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  const { darkMode } = useThemeStore()

  // Apply dark mode class to document when theme changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workouts/:id" element={<WorkoutDetail />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App