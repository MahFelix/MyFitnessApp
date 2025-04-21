import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiActivity, FiTrendingUp, FiClock } from 'react-icons/fi'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { getWorkouts } from '../utils/storage'
import { Workout } from '../types'
import WorkoutCard from '../components/workout/WorkoutCard'
import ProgressChart from '../components/progress/ProgressChart'

const Dashboard = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([])
  const [upcomingWorkout, setUpcomingWorkout] = useState<Workout | null>(null)
  const [todayDate] = useState(format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR }))
  
  useEffect(() => {
    const allWorkouts = getWorkouts()
    
    setWorkouts(allWorkouts)
    
    // Get recent workouts (last 5 completed)
    const completed = allWorkouts
      .filter(w => w.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
    
    setRecentWorkouts(completed)
    
    // Get upcoming workout (next scheduled)
    const today = new Date()
    const upcoming = allWorkouts
      .filter(w => !w.completed && new Date(w.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
    
    setUpcomingWorkout(upcoming || null)
  }, [])
  
  const completedCount = workouts.filter(w => w.completed).length
  const totalCount = workouts.length
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold">Olá!</h2>
        <p className="text-neutral-600 dark:text-neutral-400">{todayDate}</p>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full">
              <FiActivity className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">Treinos Completos</p>
              <p className="text-2xl font-bold">{completedCount}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="bg-success-100 dark:bg-success-900/30 p-3 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
            <div className="ml-4">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">Progresso</p>
              <p className="text-2xl font-bold">
                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="bg-accent-100 dark:bg-accent-900/30 p-3 rounded-full">
              <FiCalendar className="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div className="ml-4">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">Próximo Treino</p>
              <p className="text-2xl font-bold">{upcomingWorkout ? format(new Date(upcomingWorkout.date), 'dd/MM') : '-'}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center">
            <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-full">
              <FiClock className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div className="ml-4">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">Total de Treinos</p>
              <p className="text-2xl font-bold">{totalCount}</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Next workout */}
      {upcomingWorkout && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Próximo Treino</h2>
            <Link to={`/workouts/${upcomingWorkout.id}`} className="text-primary-500 text-sm font-medium">
              Ver detalhes
            </Link>
          </div>
          
          <div className="card">
            <WorkoutCard workout={upcomingWorkout} />
          </div>
        </div>
      )}
      
      {/* Progress Chart */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Progresso</h2>
          <Link to="/admin" className="text-primary-500 text-sm font-medium">
            Ver todos
          </Link>
        </div>
        
        <div className="card h-64">
          <ProgressChart />
        </div>
      </div>
      
      {/* Recent workouts */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Treinos Recentes</h2>
          <Link to="/workouts" className="text-primary-500 text-sm font-medium">
            Ver todos
          </Link>
        </div>
        
        {recentWorkouts.length > 0 ? (
          <div className="space-y-4">
            {recentWorkouts.map((workout) => (
              <Link key={workout.id} to={`/workouts/${workout.id}`}>
                <div className="card">
                  <WorkoutCard workout={workout} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center p-8">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">Você ainda não completou nenhum treino</p>
            <Link to="/workouts" className="btn btn-primary">
              Iniciar treino
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard