import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MuscleGroup } from '../types'

// Generate random ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Format date for display
export const formatDate = (dateString: string, formatString: string = 'PPP'): string => {
  const date = new Date(dateString)
  return format(date, formatString, { locale: ptBR })
}

// Get relative time for display
export const getRelativeTimeString = (dateString: string): string => {
  const date = new Date(dateString)
  
  if (isToday(date)) {
    return 'Hoje'
  } else if (isYesterday(date)) {
    return 'Ontem'
  } else if (isThisWeek(date)) {
    return format(date, 'EEEE', { locale: ptBR })
  } else if (isThisMonth(date)) {
    return format(date, 'dd MMM', { locale: ptBR })
  } else {
    return format(date, 'dd/MM/yyyy', { locale: ptBR })
  }
}

// Get color for muscle group
export const getMuscleGroupColor = (muscleGroup: MuscleGroup): string => {
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

export const getMuscleGroupLabel = (muscleGroup: MuscleGroup): string => {
  switch (muscleGroup) {
    case 'chest':
      return 'Peito'
    case 'back':
      return 'Costas'
    case 'legs':
      return 'Pernas'
    case 'shoulders':
      return 'Ombros'
    case 'arms':
      return 'Braços'
    case 'abs':
      return 'Abdômen'
    case 'fullBody':
      return 'Corpo inteiro'
    case 'cardio':
      return 'Cardio'
    default:
      return 'Outro'
  }
}

// Format weight for display
export const formatWeight = (weight?: number): string => {
  if (weight === undefined) return '-'
  return `${weight} kg`
}

// Calculate total volume (weight * reps * sets)
export const calculateVolume = (weight: number, reps: number, sets: number): number => {
  return weight * reps * sets
}