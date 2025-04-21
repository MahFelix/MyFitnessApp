import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { getWorkouts } from '../utils/storage'
import { Workout } from '../types'
import WorkoutCard from '../components/workout/WorkoutCard'
import EmptyState from '../components/common/EmptyState'
import WorkoutModal from '../components/workout/WorkoutModal'
import PdfImport from '../components/workout/PdfImport'
import WgerWorkouts from '../components/workout/WgerWorkouts'

const Workouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'my-workouts' | 'wger'>('my-workouts')
  
  useEffect(() => {
    const fetchWorkouts = () => {
      const data = getWorkouts()
      // Sort by date, newest first
      const sorted = [...data].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      setWorkouts(sorted)
    }
    
    fetchWorkouts()
  }, [])
  
  const handleOpenModal = () => {
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Refresh workouts after closing modal
    setWorkouts(getWorkouts().sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ))
  }

  const handlePdfImport = (text: string) => {
    // Handle the imported PDF text
    console.log('Imported PDF:', text)
    // You could parse the text and create a workout from it
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Treinos</h1>
        <button 
          onClick={handleOpenModal}
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Novo Treino
        </button>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 border-b border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setActiveTab('my-workouts')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'my-workouts'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400'
            }`}
          >
            My Workouts
          </button>
          <button
            onClick={() => setActiveTab('wger')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'wger'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400'
            }`}
          >
            WGER Workouts
          </button>
        </div>
      </div>

      {activeTab === 'my-workouts' ? (
        <>
          <div className="mb-6">
            <PdfImport onImport={handlePdfImport} />
          </div>
          
          {workouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/workouts/${workout.id}`}>
                    <div className="card h-full">
                      <WorkoutCard workout={workout} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="Nenhum treino encontrado"
              description="Adicione seu primeiro treino para começar a acompanhar seu progresso"
              buttonText="Adicionar Treino"
              buttonAction={handleOpenModal}
              icon={<FiPlus className="w-12 h-12 text-primary-500" />}
            />
          )}
        </>
      ) : (
        <WgerWorkouts />
      )}
      
      <WorkoutModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  )
}

export default Workouts