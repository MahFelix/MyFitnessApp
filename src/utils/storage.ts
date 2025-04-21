import { Workout, Exercise, ProgressEntry } from '../types'

// Local storage keys
const WORKOUTS_KEY = 'myfit-workouts'
const EXERCISES_KEY = 'myfit-exercises'
const PROGRESS_KEY = 'myfit-progress'

// Helper to safely parse JSON from localStorage
const safelyParse = <T>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : defaultValue
  } catch (error) {
    console.error(`Error parsing data from localStorage (${key}):`, error)
    return defaultValue
  }
}

// Helper to safely stringify and save JSON to localStorage
const safelySave = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving data to localStorage (${key}):`, error)
  }
}

// Workout operations
export const getWorkouts = (): Workout[] => safelyParse<Workout[]>(WORKOUTS_KEY, [])

export const saveWorkouts = (workouts: Workout[]): void => {
  safelySave(WORKOUTS_KEY, workouts)
}

export const getWorkout = (id: string): Workout | undefined => {
  const workouts = getWorkouts()
  return workouts.find(workout => workout.id === id)
}

export const saveWorkout = (workout: Workout): void => {
  const workouts = getWorkouts()
  const existingIndex = workouts.findIndex(w => w.id === workout.id)
  
  if (existingIndex >= 0) {
    workouts[existingIndex] = workout
  } else {
    workouts.push(workout)
  }
  
  saveWorkouts(workouts)
}

export const deleteWorkout = (id: string): void => {
  const workouts = getWorkouts()
  const filteredWorkouts = workouts.filter(workout => workout.id !== id)
  saveWorkouts(filteredWorkouts)
}

// Exercise operations
export const getExercises = (): Exercise[] => safelyParse<Exercise[]>(EXERCISES_KEY, [])

export const saveExercises = (exercises: Exercise[]): void => {
  safelySave(EXERCISES_KEY, exercises)
}

export const getExercise = (id: string): Exercise | undefined => {
  const exercises = getExercises()
  return exercises.find(exercise => exercise.id === id)
}

export const saveExercise = (exercise: Exercise): void => {
  const exercises = getExercises()
  const existingIndex = exercises.findIndex(e => e.id === exercise.id)
  
  if (existingIndex >= 0) {
    exercises[existingIndex] = exercise
  } else {
    exercises.push(exercise)
  }
  
  saveExercises(exercises)
}

export const deleteExercise = (id: string): void => {
  const exercises = getExercises()
  const filteredExercises = exercises.filter(exercise => exercise.id !== id)
  saveExercises(filteredExercises)
}

// Progress entries operations
export const getProgressEntries = (): ProgressEntry[] => 
  safelyParse<ProgressEntry[]>(PROGRESS_KEY, [])

export const saveProgressEntries = (entries: ProgressEntry[]): void => {
  safelySave(PROGRESS_KEY, entries)
}

export const getProgressEntry = (id: string): ProgressEntry | undefined => {
  const entries = getProgressEntries()
  return entries.find(entry => entry.id === id)
}

export const saveProgressEntry = (entry: ProgressEntry): void => {
  const entries = getProgressEntries()
  const existingIndex = entries.findIndex(e => e.id === entry.id)
  
  if (existingIndex >= 0) {
    entries[existingIndex] = entry
  } else {
    entries.push(entry)
  }
  
  saveProgressEntries(entries)
}

export const deleteProgressEntry = (id: string): void => {
  const entries = getProgressEntries()
  const filteredEntries = entries.filter(entry => entry.id !== id)
  saveProgressEntries(filteredEntries)
}