import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSearch, FiPlus } from 'react-icons/fi'
import { getExercises } from '../../utils/storage'
import { Exercise, MuscleGroup } from '../../types'
import { getMuscleGroupLabel } from '../../utils/helpers'
import ExerciseModal from '../exercise/ExerciseModal'

interface ExerciseSelectorProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedIds: string[]) => void
  selectedExerciseIds: string[]
}

const ExerciseSelector = ({
  isOpen,
  onClose,
  onConfirm,
  selectedExerciseIds
}: ExerciseSelectorProps) => {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [selected, setSelected] = useState<string[]>(selectedExerciseIds)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'all'>('all')
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false)
  
  const muscleGroups: MuscleGroup[] = [
    'chest', 'back', 'legs', 'shoulders', 'arms', 'abs', 'fullBody', 'cardio', 'other'
  ]
  
  useEffect(() => {
    const fetchExercises = () => {
      const data = getExercises()
      // Sort alphabetically by name
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name))
      setExercises(sorted)
      setFilteredExercises(sorted)
    }
    
    fetchExercises()
  }, [])
  
  useEffect(() => {
    let filtered = exercises
    
    // Apply muscle group filter
    if (selectedMuscleGroup !== 'all') {
      filtered = filtered.filter(ex => ex.muscleGroup === selectedMuscleGroup)
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(ex => 
        ex.name.toLowerCase().includes(term) || 
        (ex.description && ex.description.toLowerCase().includes(term))
      )
    }
    
    setFilteredExercises(filtered)
  }, [exercises, searchTerm, selectedMuscleGroup])
  
  const toggleSelectExercise = (id: string) => {
    setSelected(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }
  
  const handleConfirm = () => {
    onConfirm(selected)
  }
  
  const handleExerciseModalClose = () => {
    setIsExerciseModalOpen(false)
    // Refresh exercises
    setExercises(getExercises().sort((a, b) => a.name.localeCompare(b.name)))
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
                  Selecionar Exercícios
                </h2>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar exercícios..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="input w-full pl-10"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <select
                      value={selectedMuscleGroup}
                      onChange={e => setSelectedMuscleGroup(e.target.value as MuscleGroup | 'all')}
                      className="input bg-white dark:bg-neutral-800 w-full"
                    >
                      <option value="all">Todos os grupos musculares</option>
                      {muscleGroups.map((group) => (
                        <option key={group} value={group}>
                          {getMuscleGroupLabel(group)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button 
                    onClick={() => setIsExerciseModalOpen(true)}
                    className="flex items-center ml-3 text-primary-500"
                  >
                    <FiPlus className="mr-1" />
                    Novo
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[50vh]">
                <div className="p-4 space-y-2">
                  {filteredExercises.length > 0 ? (
                    filteredExercises.map(exercise => (
                      <div 
                        key={exercise.id}
                        onClick={() => toggleSelectExercise(exercise.id)}
                        className={`p-3 rounded-lg cursor-pointer flex items-center transition-colors ${
                          selected.includes(exercise.id)
                            ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/30'
                            : 'bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600'
                        }`}
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{exercise.name}</h3>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getMuscleGroupColor(exercise.muscleGroup)}`}>
                            {getMuscleGroupLabel(exercise.muscleGroup)}
                          </span>
                        </div>
                        <div className={`h-5 w-5 flex-shrink-0 rounded-full border border-neutral-300 dark:border-neutral-500 ${
                          selected.includes(exercise.id)
                            ? 'bg-primary-500 border-transparent'
                            : 'bg-white dark:bg-neutral-800'
                        }`}>
                          {selected.includes(exercise.id) && (
                            <FiCheck className="text-white m-auto h-4 w-4" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Nenhum exercício encontrado
                      </p>
                      <button 
                        onClick={() => setIsExerciseModalOpen(true)}
                        className="btn btn-primary mt-4"
                      >
                        Criar novo exercício
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {selected.length} {selected.length === 1 ? 'exercício' : 'exercícios'} selecionado{selected.length !== 1 ? 's' : ''}
                </div>
                <div className="space-x-3">
                  <button
                    onClick={onClose}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="btn btn-primary"
                    disabled={selected.length === 0}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          
          <ExerciseModal 
            isOpen={isExerciseModalOpen}
            onClose={handleExerciseModalClose}
          />
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

// Helper function for rendering check icon
const FiCheck = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// Helper function to generate color classes based on muscle group
const getMuscleGroupColor = (muscleGroup: string): string => {
  switch (muscleGroup) {
    case 'chest':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'back':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'legs':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    case 'shoulders':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'arms':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
    case 'abs':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'fullBody':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    case 'cardio':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

export default ExerciseSelector