import { useState } from 'react'
import { FiPlus, FiMinus, FiEdit, FiCheck, FiTrash2 } from 'react-icons/fi'
import { Workout, WorkoutExercise, ExerciseSet } from '../../types'
import { getExercises, saveWorkout } from '../../utils/storage'
import { generateId, getMuscleGroupLabel, formatWeight } from '../../utils/helpers'

interface ExerciseListProps {
  workout: Workout
  onWorkoutUpdate: (workout: Workout) => void
}

const ExerciseList = ({ workout, onWorkoutUpdate }: ExerciseListProps) => {
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({})
  const exercises = getExercises()
  
  const toggleExpand = (exerciseId: string) => {
    setExpandedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }))
  }
  
  const handleSetComplete = (exerciseId: string, setId: string, completed: boolean) => {
    const updatedWorkout = { ...workout }
    const workoutExercise = updatedWorkout.exercises.find(e => e.id === exerciseId)
    
    if (workoutExercise) {
      const exerciseSet = workoutExercise.sets.find(s => s.id === setId)
      if (exerciseSet) {
        exerciseSet.completed = completed
        
        saveWorkout(updatedWorkout)
        onWorkoutUpdate(updatedWorkout)
      }
    }
  }
  
  const addSet = (exerciseId: string) => {
    const updatedWorkout = { ...workout }
    const workoutExercise = updatedWorkout.exercises.find(e => e.id === exerciseId)
    
    if (workoutExercise) {
      const lastSet = workoutExercise.sets[workoutExercise.sets.length - 1]
      
      const newSet: ExerciseSet = {
        id: generateId(),
        reps: lastSet?.reps || 12,
        weight: lastSet?.weight,
        completed: false
      }
      
      workoutExercise.sets.push(newSet)
      
      saveWorkout(updatedWorkout)
      onWorkoutUpdate(updatedWorkout)
    }
  }
  
  const removeSet = (exerciseId: string, setId: string) => {
    const updatedWorkout = { ...workout }
    const workoutExercise = updatedWorkout.exercises.find(e => e.id === exerciseId)
    
    if (workoutExercise && workoutExercise.sets.length > 1) {
      workoutExercise.sets = workoutExercise.sets.filter(s => s.id !== setId)
      
      saveWorkout(updatedWorkout)
      onWorkoutUpdate(updatedWorkout)
    }
  }
  
  const updateSetValue = (
    exerciseId: string, 
    setId: string, 
    field: 'reps' | 'weight', 
    value: number
  ) => {
    const updatedWorkout = { ...workout }
    const workoutExercise = updatedWorkout.exercises.find(e => e.id === exerciseId)
    
    if (workoutExercise) {
      const exerciseSet = workoutExercise.sets.find(s => s.id === setId)
      if (exerciseSet) {
        exerciseSet[field] = value
        
        saveWorkout(updatedWorkout)
        onWorkoutUpdate(updatedWorkout)
      }
    }
  }
  
  return (
    <div className="space-y-4">
      {workout.exercises
        .sort((a, b) => a.order - b.order)
        .map((workoutExercise) => {
          const exercise = exercises.find(e => e.id === workoutExercise.exerciseId)
          const isExpanded = expandedExercises[workoutExercise.id] || false
          
          if (!exercise) return null
          
          return (
            <div key={workoutExercise.id} className="card">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(workoutExercise.id)}
              >
                <div>
                  <h3 className="text-lg font-medium">{exercise.name}</h3>
                  <span className={`inline-block px-3 py-1 text-xs rounded-full mt-1 ${
                    getMuscleGroupColor(exercise.muscleGroup)
                  }`}>
                    {getMuscleGroupLabel(exercise.muscleGroup)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 mr-2">
                    {workoutExercise.sets.length} {workoutExercise.sets.length === 1 ? 'série' : 'séries'}
                  </span>
                  {isExpanded ? <FiMinus /> : <FiPlus />}
                </div>
              </div>
              
              {isExpanded && (
                <div className="mt-4">
                  <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    <div className="col-span-1">#</div>
                    <div className="col-span-3 md:col-span-2">Reps</div>
                    <div className="col-span-3 md:col-span-2">Peso</div>
                    <div className="col-span-5 md:col-span-7 text-right">Ações</div>
                  </div>
                  
                  {workoutExercise.sets.map((set, index) => (
                    <div 
                      key={set.id} 
                      className={`grid grid-cols-12 gap-2 items-center p-2 rounded-lg mb-2 ${
                        set.completed 
                          ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800/30' 
                          : 'bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      <div className="col-span-1 text-neutral-600 dark:text-neutral-400">
                        {index + 1}
                      </div>
                      
                      <div className="col-span-3 md:col-span-2">
                        <input
                          type="number"
                          min="1"
                          value={set.reps}
                          onChange={(e) => updateSetValue(workoutExercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                          className="input w-full py-1 px-2 text-center"
                        />
                      </div>
                      
                      <div className="col-span-3 md:col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={set.weight || ''}
                          onChange={(e) => updateSetValue(workoutExercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                          className="input w-full py-1 px-2 text-center"
                          placeholder="kg"
                        />
                      </div>
                      
                      <div className="col-span-5 md:col-span-7 flex justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => handleSetComplete(workoutExercise.id, set.id, !set.completed)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            set.completed
                              ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                              : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                          }`}
                          title={set.completed ? 'Marcar como incompleto' : 'Marcar como completo'}
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => removeSet(workoutExercise.id, set.id)}
                          className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-red-100 hover:text-red-700 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                          title="Remover série"
                          disabled={workoutExercise.sets.length <= 1}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    type="button"
                    onClick={() => addSet(workoutExercise.id)}
                    className="btn btn-secondary w-full mt-2 text-sm py-1.5"
                  >
                    <FiPlus className="mr-1" /> Adicionar série
                  </button>
                  
                  {exercise.instructions && (
                    <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <h4 className="font-medium mb-1">Instruções:</h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {exercise.instructions}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })
      }
      
      {workout.exercises.length === 0 && (
        <div className="text-center p-8 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <p className="text-neutral-600 dark:text-neutral-400">
            Nenhum exercício adicionado a este treino
          </p>
        </div>
      )}
    </div>
  )
}

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

export default ExerciseList