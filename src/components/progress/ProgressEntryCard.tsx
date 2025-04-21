import { FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ProgressEntry } from '../../types'

interface ProgressEntryCardProps {
  entry: ProgressEntry
  onEdit: () => void
  onDelete: () => void
}

const ProgressEntryCard = ({ entry, onEdit, onDelete }: ProgressEntryCardProps) => {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-3 md:mb-0">
          <div className="flex items-center">
            <FiCalendar className="text-neutral-500 mr-2" />
            <h3 className="font-semibold">
              {format(new Date(entry.date), 'PPP', { locale: ptBR })}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            {entry.weight && (
              <div className="text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Peso: </span>
                <span className="font-medium">{entry.weight} kg</span>
              </div>
            )}
            
            {entry.bodyFat && (
              <div className="text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Gordura: </span>
                <span className="font-medium">{entry.bodyFat}%</span>
              </div>
            )}
            
            {entry.measurements?.chest && (
              <div className="text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Peito: </span>
                <span className="font-medium">{entry.measurements.chest} cm</span>
              </div>
            )}
            
            {entry.measurements?.waist && (
              <div className="text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Cintura: </span>
                <span className="font-medium">{entry.measurements.waist} cm</span>
              </div>
            )}
            
            {entry.measurements?.hips && (
              <div className="text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Quadril: </span>
                <span className="font-medium">{entry.measurements.hips} cm</span>
              </div>
            )}
            
            {entry.measurements?.biceps && (
              <div className="text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Bíceps: </span>
                <span className="font-medium">{entry.measurements.biceps} cm</span>
              </div>
            )}
            
            {entry.measurements?.thighs && (
              <div className="text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Coxas: </span>
                <span className="font-medium">{entry.measurements.thighs} cm</span>
              </div>
            )}
          </div>
          
          {entry.notes && (
            <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-medium">Notas: </span>
              {entry.notes}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={onEdit}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-red-100 hover:text-red-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProgressEntryCard