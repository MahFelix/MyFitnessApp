import { FiClock, FiActivity, FiCheckCircle } from 'react-icons/fi'
import { Workout } from '../../types'
import { getRelativeTimeString } from '../../utils/helpers'

interface WorkoutCardProps {
  workout: Workout
}

const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const exerciseCount = workout.exercises.length
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{workout.name}</h3>
        {workout.completed ? (
          <span className="flex items-center text-sm text-success-600 dark:text-success-400">
            <FiCheckCircle className="mr-1" />
            Completo
          </span>
        ) : (
          <span className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
            <FiClock className="mr-1" />
            Pendente
          </span>
        )}
      </div>
      
      <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 mb-3">
        <span>{getRelativeTimeString(workout.date)}</span>
      </div>
      
      {workout.description && (
        <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-3 line-clamp-2">
          {workout.description}
        </p>
      )}
      
      <div className="mt-auto flex items-center text-sm text-neutral-600 dark:text-neutral-400">
        <FiActivity className="mr-1" />
        <span>
          {exerciseCount} {exerciseCount === 1 ? 'exercício' : 'exercícios'}
        </span>
      </div>
    </div>
  )
}

export default WorkoutCard