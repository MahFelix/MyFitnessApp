import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiHome, 
  FiCalendar, 
  FiList, 
  FiActivity, 
  FiSettings,
  FiPieChart
} from 'react-icons/fi'

const navItems = [
  { name: 'Dashboard', path: '/', icon: <FiHome className="w-5 h-5" /> },
  { name: 'Workouts', path: '/workouts', icon: <FiActivity className="w-5 h-5" /> },
  { name: 'Calendar', path: '/calendar', icon: <FiCalendar className="w-5 h-5" /> },
  { name: 'Exercises', path: '/exercises', icon: <FiList className="w-5 h-5" /> },
  { name: 'Admin', path: '/admin', icon: <FiPieChart className="w-5 h-5" /> },
  { name: 'Settings', path: '/settings', icon: <FiSettings className="w-5 h-5" /> },
]

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <h1 className="text-xl font-bold text-primary-500">MyFitness</h1>
      </div>
      
      <nav className="flex-1 py-6 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-medium' 
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`mr-3 ${isActive ? 'text-primary-500' : ''}`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
            <span className="font-medium">U</span>
          </div>
          <div>
            <p className="font-medium">User</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Personal Account</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar