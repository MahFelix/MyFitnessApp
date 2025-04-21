export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  description?: string
  instructions?: string
  imageUrl?: string
  customExercise?: boolean
}

export interface ExerciseSet {
  id: string
  reps: number
  weight?: number // in kg
  time?: number // in seconds (for timed exercises)
  completed: boolean
  notes?: string
}

export interface WorkoutExercise {
  id: string
  exerciseId: string
  sets: ExerciseSet[]
  order: number
}

export interface Workout {
  id: string
  name: string
  description?: string
  date: string
  completed: boolean
  exercises: WorkoutExercise[]
  notes?: string
}

export interface ProgressEntry {
  id: string
  date: string
  weight?: number // in kg
  bodyFat?: number // percentage
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    biceps?: number
    thighs?: number
  }
  photos?: string[] // URLs to photos
  notes?: string
}

export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'abs'
  | 'fullBody'
  | 'cardio'
  | 'other'