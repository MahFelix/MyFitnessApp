import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { Exercise, MuscleGroup } from '../../types'
import { generateId, getMuscleGroupLabel } from '../../utils/helpers'
import { saveExercise } from '../../utils/storage'

interface ExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  exercise?: Exercise
}

const ExerciseModal = ({ isOpen, onClose, exercise }: ExerciseModalProps) => {
  const [name, setName] = useState('')
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('chest')
  const [description, setDescription] = useState('')
  const [instructions, setInstructions] = useState('')
  
  const muscleGroups: MuscleGroup[] = [
    'chest', 'back', 'legs', 'shoulders', 'arms', 'abs', 'fullBody', 'cardio', 'other'
  ]
  
  useEffect(() => {
    if (exercise) {
      setName(exercise.name)
      setMuscleGroup(exercise.muscleGroup)
      setDescription(exercise.description || '')
      setInstructions(exercise.instructions || '')
    } else {
      resetForm()
    }
  }, [exercise])
  
  const resetForm = () => {
    setName('')
    setMuscleGroup('chest')
    setDescription('')
    setInstructions('')
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newExercise: Exercise = {
      id: exercise?.id || generateId(),
      name,
      muscleGroup,
      description: description || undefined,
      instructions: instructions || undefined,
      customExercise: true
    }
    
    saveExercise(newExercise)
    onClose()
    resetForm()
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
                  {exercise ? 'Editar Exercício' : 'Novo Exercício'}
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
                      Nome do Exercício *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="input w-full"
                      placeholder="ex: Supino Reto"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="muscleGroup" className="block text-sm font-medium mb-1">
                      Grupo Muscular *
                    </label>
                    <select
                      id="muscleGroup"
                      value={muscleGroup}
                      onChange={e => setMuscleGroup(e.target.value as MuscleGroup)}
                      className="input w-full"
                      required
                    >
                      {muscleGroups.map((group) => (
                        <option key={group} value={group}>
                          {getMuscleGroupLabel(group)}
                        </option>
                      ))}
                    </select>
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
                      placeholder="Breve descrição do exercício"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="instructions" className="block text-sm font-medium mb-1">
                      Instruções
                    </label>
                    <textarea
                      id="instructions"
                      value={instructions}
                      onChange={e => setInstructions(e.target.value)}
                      className="input w-full min-h-[120px]"
                      placeholder="Passo a passo para executar o exercício corretamente"
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
                  disabled={!name}
                >
                  {exercise ? 'Atualizar' : 'Criar'} Exercício
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default ExerciseModal