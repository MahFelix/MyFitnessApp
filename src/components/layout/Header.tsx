import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiPlus, FiMoon, FiSun } from 'react-icons/fi'
import { useThemeStore } from '../../stores/themeStore'

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Dashboard'
    case '/workouts':
      return 'Workouts'
    case '/calendar':
      return 'Calendar'
    case '/exercises':
      return 'Exercises'
    case '/admin':
      return 'Admin Dashboard'
    case '/settings':
      return 'Settings'
    default:
      if (pathname.startsWith('/workouts/')) {
        return 'Workout Details'
      }
      return 'My Fitness'
  }
}

const Header = () => {
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useThemeStore()
  const [searchOpen, setSearchOpen] = useState(false)
  
  const pageTitle = getPageTitle(location.pathname)

  return (
    <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 py-4 px-4 md:px-6">
      <div className="container-app flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-semibold">{pageTitle}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {searchOpen ? (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="relative"
            >
              <input
                type="text"
                placeholder="Search..."
                className="input w-full"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </motion.div>
          ) : (
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </button>
          )}
          
          {location.pathname === '/workouts' && (
            <button 
              className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600"
              aria-label="Add workout"
            >
              <FiPlus className="w-5 h-5" />
            </button>
          )}
          
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 ml-2"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header