import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCalendar, FiPlus, FiTrash2 } from 'react-icons/fi'
import { format } from 'date-fns'
import { Workout, WorkoutExercise } from '../../types'
import { generateId } from '../../utils/helpers'
import { saveWorkout, getExercises } from '../../utils/storage'
import ExerciseSelector from './ExerciseSelector'

interface WorkoutModalProps {
  isOpen: boolean
  onClose: () => void
  workout?: Workout
}

const WorkoutModal = ({ isOpen, onClose, workout }: WorkoutModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    exercises: [] as WorkoutExercise[],
    notes: ''
  })
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false)
  
  useEffect(() => {
    if (workout) {
      setFormData({
        name: workout.name,
        description: workout.description || '',
        date: format(new Date(workout.date), 'yyyy-MM-dd'),
        exercises: workout.exercises,
        notes: workout.notes || ''
      })
    } else {
      resetForm()
    }
  }, [workout])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      exercises: [],
      notes: ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newWorkout: Workout = {
      id: workout?.id || generateId(),
      name: formData.name,
      description: formData.description || undefined,
      date: new Date(formData.date).toISOString(),
      completed: workout?.completed || false,
      exercises: formData.exercises,
      notes: formData.notes || undefined
    }
    
    saveWorkout(newWorkout)
    onClose()
    resetForm()
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddExercises = (selectedExerciseIds: string[]) => {
    const existingExerciseIds = formData.exercises.map(e => e.exerciseId)
    const newExerciseIds = selectedExerciseIds.filter(id => !existingExerciseIds.includes(id))
    
    if (newExerciseIds.length === 0) {
      setIsExerciseSelectorOpen(false)
      return
    }
    
    const highestOrder = formData.exercises.length > 0 
      ? Math.max(...formData.exercises.map(e => e.order))
      : -1
    
    const newExercises = newExerciseIds.map((exerciseId, index) => ({
      id: generateId(),
      exerciseId,
      sets: [
        {
          id: generateId(),
          reps: 12,
          weight: undefined,
          completed: false,
          notes: undefined
        }
      ],
      order: highestOrder + index + 1
    }))
    
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, ...newExercises]
    }))
    setIsExerciseSelectorOpen(false)
  }

  const handleRemoveExercise = (id: string) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises
        .filter(e => e.id !== id)
        .map((e, index) => ({ ...e, order: index }))
    }))
  }

  if (!isOpen) return null
  
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ 
              type: 'spring', 
              damping: 20,
              stiffness: 300
            }}
            className="fixed inset-x-0 bottom-0 z-50 p-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-xl md:w-full"
          >
            <motion.div 
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
              layout
            >
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                <motion.h2 
                  className="text-xl font-semibold"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {workout ? 'Editar Treino' : 'Novo Treino'}
                </motion.h2>
                <motion.button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX className="w-5 h-5" />
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 overflow-y-auto">
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Nome do Treino *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className="input w-full"
                      placeholder="ex: Treino A - Peito e Tríceps"
                      required
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={e => handleInputChange('description', e.target.value)}
                      className="input w-full min-h-[80px]"
                      placeholder="Descrição opcional do treino"
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label htmlFor="date" className="block text-sm font-medium mb-1">
                      Data *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="date"
                        value={formData.date}
                        onChange={e => handleInputChange('date', e.target.value)}
                        className="input w-full pl-10"
                        required
                      />
                      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium">
                        Exercícios *
                      </label>
                      <motion.button
                        type="button"
                        onClick={() => setIsExerciseSelectorOpen(true)}
                        className="text-sm text-primary-500 font-medium flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiPlus className="mr-1" />
                        Adicionar
                      </motion.button>
                    </div>
                    
                    <AnimatePresence>
                      {formData.exercises.length > 0 ? (
                        <motion.div 
                          className="space-y-2 mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.35 }}
                        >
                          {formData.exercises
                            .sort((a, b) => a.order - b.order)
                            .map((exercise, index) => {
                              const exerciseDetails = getExercises().find(e => e.id === exercise.exerciseId)
                              return (
                                <motion.div 
                                  key={exercise.id}
                                  className="flex justify-between items-center p-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, x: -50 }}
                                  layout
                                >
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 w-6">
                                      {index + 1}.
                                    </span>
                                    <span>
                                      {exerciseDetails?.name || 'Exercício desconhecido'}
                                    </span>
                                  </div>
                                  <motion.button
                                    type="button"
                                    onClick={() => handleRemoveExercise(exercise.id)}
                                    className="text-neutral-500 hover:text-red-500"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <FiTrash2 />
                                  </motion.button>
                                </motion.div>
                              )
                            })
                          }
                        </motion.div>
                      ) : (
                        <motion.div 
                          className="bg-neutral-100 dark:bg-neutral-700 p-4 rounded-lg text-center mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.35 }}
                        >
                          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                            Nenhum exercício adicionado
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label htmlFor="notes" className="block text-sm font-medium mb-1">
                      Anotações
                    </label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={e => handleInputChange('notes', e.target.value)}
                      className="input w-full min-h-[80px]"
                      placeholder="Notas adicionais sobre o treino"
                    />
                  </motion.div>
                </div>
              </form>
              
              <motion.div 
                className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary"
                  disabled={!formData.name || formData.exercises.length === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {workout ? 'Atualizar' : 'Criar'} Treino
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <AnimatePresence>
            {isExerciseSelectorOpen && (
              <ExerciseSelector
                isOpen={isExerciseSelectorOpen}
                onClose={() => setIsExerciseSelectorOpen(false)}
                onConfirm={handleAddExercises}
                selectedExerciseIds={formData.exercises.map(e => e.exerciseId)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default WorkoutModal