import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCalendar } from 'react-icons/fi'
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
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  const [notes, setNotes] = useState('')
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false)
  
  useEffect(() => {
    if (workout) {
      setName(workout.name)
      setDescription(workout.description || '')
      setDate(format(new Date(workout.date), 'yyyy-MM-dd'))
      setExercises(workout.exercises)
      setNotes(workout.notes || '')
    } else {
      resetForm()
    }
  }, [workout])
  
  const resetForm = () => {
    setName('')
    setDescription('')
    setDate(format(new Date(), 'yyyy-MM-dd'))
    setExercises([])
    setNotes('')
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newWorkout: Workout = {
      id: workout?.id || generateId(),
      name,
      description: description || undefined,
      date: new Date(date).toISOString(),
      completed: workout?.completed || false,
      exercises,
      notes: notes || undefined
    }
    
    saveWorkout(newWorkout)
    onClose()
    resetForm()
  }
  
  const handleAddExercises = (selectedExerciseIds: string[]) => {
    const existingExerciseIds = exercises.map(e => e.exerciseId)
    const newExerciseIds = selectedExerciseIds.filter(id => !existingExerciseIds.includes(id))
    
    if (newExerciseIds.length === 0) {
      setIsExerciseSelectorOpen(false)
      return
    }
    
    const allExercises = getExercises()
    const highestOrder = exercises.length > 0 
      ? Math.max(...exercises.map(e => e.order))
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
    
    setExercises([...exercises, ...newExercises])
    setIsExerciseSelectorOpen(false)
  }
  
  const handleRemoveExercise = (id: string) => {
    setExercises(prevExercises => 
      prevExercises
        .filter(e => e.id !== id)
        .map((e, index) => ({ ...e, order: index }))
    )
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
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-x-0 bottom-0 z-50 p-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-xl md:w-full"
          >
            <div 
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {workout ? 'Editar Treino' : 'Novo Treino'}
                </h2>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Nome do Treino *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="input w-full"
                      placeholder="ex: Treino A - Peito e Tríceps"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="input w-full min-h-[80px]"
                      placeholder="Descrição opcional do treino"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-1">
                      Data *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="input w-full pl-10"
                        required
                      />
                      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium">
                        Exercícios *
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsExerciseSelectorOpen(true)}
                        className="text-sm text-primary-500 font-medium"
                      >
                        + Adicionar
                      </button>
                    </div>
                    
                    {exercises.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        {exercises
                          .sort((a, b) => a.order - b.order)
                          .map((exercise, index) => (
                            <div 
                              key={exercise.id}
                              className="flex justify-between items-center p-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg"
                            >
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 w-6">
                                  {index + 1}.
                                </span>
                                <span>
                                  {getExercises().find(e => e.id === exercise.exerciseId)?.name || 'Exercício desconhecido'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveExercise(exercise.id)}
                                className="text-neutral-500 hover:text-red-500"
                              >
                                <FiX />
                              </button>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="bg-neutral-100 dark:bg-neutral-700 p-4 rounded-lg text-center mb-4">
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                          Nenhum exercício adicionado
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium mb-1">
                      Anotações
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="input w-full min-h-[80px]"
                      placeholder="Notas adicionais sobre o treino"
                    />
                  </div>
                </div>
              </form>
              
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary"
                  disabled={!name || exercises.length === 0}
                >
                  {workout ? 'Atualizar' : 'Criar'} Treino
                </button>
              </div>
            </div>
          </motion.div>
          
          {isExerciseSelectorOpen && (
            <ExerciseSelector
              isOpen={isExerciseSelectorOpen}
              onClose={() => setIsExerciseSelectorOpen(false)}
              onConfirm={handleAddExercises}
              selectedExerciseIds={exercises.map(e => e.exerciseId)}
            />
          )}
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default WorkoutModal