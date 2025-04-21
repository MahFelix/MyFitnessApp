import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNav from './MobileNav'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="container-app animate-enter">
            {children}
          </div>
        </main>
        
        {/* Mobile navigation - visible only on mobile */}
        <MobileNav />
      </div>
    </div>
  )
}

export default Layout