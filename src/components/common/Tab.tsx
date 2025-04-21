import { ReactNode } from 'react'

interface TabProps {
  isActive: boolean
  onClick: () => void
  icon?: ReactNode
  label: string
}

const Tab = ({ isActive, onClick, icon, label }: TabProps) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center px-4 py-3 border-b-2 transition-colors
        ${isActive 
          ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-medium' 
          : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-primary-500 hover:border-primary-300'
        }`}
    >
      {icon}
      {label}
    </button>
  )
}

export default Tab