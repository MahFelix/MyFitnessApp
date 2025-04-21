import { NavLink } from 'react-router-dom'
import { 
  FiHome, 
  FiCalendar, 
  FiActivity, 
  FiList, 
  FiPieChart
} from 'react-icons/fi'

const navItems = [
  { name: 'Home', path: '/', icon: <FiHome className="w-5 h-5" /> },
  { name: 'Workouts', path: '/workouts', icon: <FiActivity className="w-5 h-5" /> },
  { name: 'Calendar', path: '/calendar', icon: <FiCalendar className="w-5 h-5" /> },
  { name: 'Exercises', path: '/exercises', icon: <FiList className="w-5 h-5" /> },
  { name: 'Admin', path: '/admin', icon: <FiPieChart className="w-5 h-5" /> },
]

const MobileNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 z-10">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center py-3 px-2 transition-colors ${
                isActive 
                  ? 'text-primary-500' 
                  : 'text-neutral-600 dark:text-neutral-400'
              }`
            }
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav