import { useState, useEffect } from 'react'
import { FiPlus, FiFilter } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { getExercises } from '../utils/storage'
import { Exercise, MuscleGroup } from '../types'
import ExerciseCard from '../components/exercise/ExerciseCard'
import ExerciseModal from '../components/exercise/ExerciseModal'
import EmptyState from '../components/common/EmptyState'
import { getMuscleGroupLabel } from '../utils/helpers'

const Exercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
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
  
  const handleOpenModal = () => {
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Refresh exercises after closing modal
    setExercises(getExercises().sort((a, b) => a.name.localeCompare(b.name)))
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exercícios</h1>
        <button 
          onClick={handleOpenModal}
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Novo Exercício
        </button>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar exercícios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input w-full"
          />
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <FiFilter className="text-neutral-500 mr-2" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Filtrar:</span>
          </div>
          
          <select
            value={selectedMuscleGroup}
            onChange={(e) => setSelectedMuscleGroup(e.target.value as MuscleGroup | 'all')}
            className="input bg-white dark:bg-neutral-800"
          >
            <option value="all">Todos</option>
            {muscleGroups.map((group) => (
              <option key={group} value={group}>
                {getMuscleGroupLabel(group)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ExerciseCard exercise={exercise} />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState 
          title={
            exercises.length === 0
              ? "Nenhum exercício encontrado"
              : "Nenhum exercício corresponde aos filtros"
          }
          description={
            exercises.length === 0
              ? "Adicione seu primeiro exercício para começar"
              : "Tente ajustar seus filtros ou criar um novo exercício"
          }
          buttonText="Adicionar Exercício"
          buttonAction={handleOpenModal}
          icon={<FiPlus className="w-12 h-12 text-primary-500" />}
        />
      )}
      
      <ExerciseModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  )
}

export default Exercises