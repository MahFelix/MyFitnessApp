import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiTrash2, FiInfo } from 'react-icons/fi'
import { Exercise } from '../../types'
import { getMuscleGroupLabel, getMuscleGroupColor } from '../../utils/helpers'
import { deleteExercise } from '../../utils/storage'
import ExerciseModal from './ExerciseModal'
import ConfirmDialog from '../common/ConfirmDialog'

interface ExerciseCardProps {
  exercise: Exercise
}

const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  
  const handleEdit = () => {
    setIsModalOpen(true)
  }
  
  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }
  
  const confirmDelete = () => {
    deleteExercise(exercise.id)
    setIsDeleteDialogOpen(false)
    // Force re-render of parent component - in a real app, we'd use context/state management
    window.location.reload()
  }
  
  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }
  
  return (
    <>
      <motion.div 
        className="card h-full"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">{exercise.name}</h3>
            <div className="flex space-x-1">
              <button 
                onClick={toggleInfo}
                className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
              >
                <FiInfo className="w-4 h-4" />
              </button>
              <button 
                onClick={handleEdit}
                className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={handleDelete}
                className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-red-100 hover:text-red-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="mt-2">
            <span className={`inline-block px-3 py-1 text-xs rounded-full ${getMuscleGroupColor(exercise.muscleGroup)}`}>
              {getMuscleGroupLabel(exercise.muscleGroup)}
            </span>
            
            {exercise.customExercise && (
              <span className="inline-block ml-2 px-3 py-1 text-xs rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                Customizado
              </span>
            )}
          </div>
          
          {exercise.description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">
              {exercise.description}
            </p>
          )}
          
          {showInfo && exercise.instructions && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
            >
              <h4 className="font-medium text-sm mb-1">Instruções:</h4>
              <p className="text-xs text-neutral-700 dark:text-neutral-300">
                {exercise.instructions}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <ExerciseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        exercise={exercise}
      />
      
      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Exercício"
        message="Tem certeza que deseja excluir este exercício? Esta ação não pode ser desfeita."
      />
    </>
  )
}

export default ExerciseCard