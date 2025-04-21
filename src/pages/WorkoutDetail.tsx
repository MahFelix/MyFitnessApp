import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { getWorkout, saveWorkout, deleteWorkout } from '../utils/storage'
import { formatDate } from '../utils/helpers'
import { Workout } from '../types'
import ExerciseList from '../components/workout/ExerciseList'
import ConfirmDialog from '../components/common/ConfirmDialog'
import WorkoutModal from '../components/workout/WorkoutModal'

const WorkoutDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  useEffect(() => {
    if (id) {
      const data = getWorkout(id)
      if (data) {
        setWorkout(data)
      } else {
        // Workout not found, redirect to workouts page
        navigate('/workouts')
      }
    }
  }, [id, navigate])
  
  const handleGoBack = () => {
    navigate(-1)
  }
  
  const handleToggleComplete = () => {
    if (workout) {
      const updatedWorkout = {
        ...workout,
        completed: !workout.completed
      }
      
      saveWorkout(updatedWorkout)
      setWorkout(updatedWorkout)
    }
  }
  
  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }
  
  const confirmDelete = () => {
    if (id) {
      deleteWorkout(id)
      navigate('/workouts')
    }
  }
  
  const handleEdit = () => {
    setIsEditModalOpen(true)
  }
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    // Refresh workout data
    if (id) {
      const data = getWorkout(id)
      if (data) {
        setWorkout(data)
      }
    }
  }
  
  if (!workout) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>
  }
  
  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-neutral-600 dark:text-neutral-400 mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Voltar
        </button>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{workout.name}</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {formatDate(workout.date)}
            </p>
          </div>
          
          <div className="flex mt-4 sm:mt-0 space-x-2">
            <button 
              onClick={handleToggleComplete}
              className={`btn flex items-center ${
                workout.completed 
                  ? 'bg-success-100 text-success-700 hover:bg-success-200 dark:bg-success-900/20 dark:text-success-400'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              {workout.completed ? (
                <>
                  <FiCheck className="mr-2" />
                  Completo
                </>
              ) : (
                <>
                  <FiX className="mr-2" />
                  Incompleto
                </>
              )}
            </button>
            
            <button 
              onClick={handleEdit}
              className="btn btn-secondary flex items-center"
            >
              <FiEdit2 className="mr-2" />
              Editar
            </button>
            
            <button 
              onClick={handleDelete}
              className="btn bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 flex items-center"
            >
              <FiTrash2 className="mr-2" />
              Excluir
            </button>
          </div>
        </div>
        
        {workout.description && (
          <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg mb-6">
            <p className="text-neutral-700 dark:text-neutral-300">{workout.description}</p>
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Exercícios</h2>
          <ExerciseList workout={workout} onWorkoutUpdate={setWorkout} />
        </div>
        
        {workout.notes && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Anotações</h2>
            <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
              <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">{workout.notes}</p>
            </div>
          </div>
        )}
      </div>
      
      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Treino"
        message="Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita."
      />
      
      {isEditModalOpen && (
        <WorkoutModal 
          isOpen={isEditModalOpen} 
          onClose={handleCloseEditModal} 
          workout={workout}
        />
      )}
    </div>
  )
}

export default WorkoutDetail