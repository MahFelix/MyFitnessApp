import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCalendar } from 'react-icons/fi'
import { format } from 'date-fns'
import { ProgressEntry } from '../../types'

interface ProgressEntryFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (entry: Omit<ProgressEntry, 'id'>) => void
  entry?: ProgressEntry | null
}

const ProgressEntryForm = ({
  isOpen,
  onClose,
  onSave,
  entry
}: ProgressEntryFormProps) => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [weight, setWeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: ''
  })
  const [notes, setNotes] = useState('')
  
  useEffect(() => {
    if (entry) {
      setDate(format(new Date(entry.date), 'yyyy-MM-dd'))
      setWeight(entry.weight ? entry.weight.toString() : '')
      setBodyFat(entry.bodyFat ? entry.bodyFat.toString() : '')
      setMeasurements({
        chest: entry.measurements?.chest ? entry.measurements.chest.toString() : '',
        waist: entry.measurements?.waist ? entry.measurements.waist.toString() : '',
        hips: entry.measurements?.hips ? entry.measurements.hips.toString() : '',
        biceps: entry.measurements?.biceps ? entry.measurements.biceps.toString() : '',
        thighs: entry.measurements?.thighs ? entry.measurements.thighs.toString() : ''
      })
      setNotes(entry.notes || '')
    } else {
      resetForm()
    }
  }, [entry])
  
  const resetForm = () => {
    setDate(format(new Date(), 'yyyy-MM-dd'))
    setWeight('')
    setBodyFat('')
    setMeasurements({
      chest: '',
      waist: '',
      hips: '',
      biceps: '',
      thighs: ''
    })
    setNotes('')
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newEntry: Omit<ProgressEntry, 'id'> = {
      date: new Date(date).toISOString(),
      weight: weight ? parseFloat(weight) : undefined,
      bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
      measurements: {
        chest: measurements.chest ? parseFloat(measurements.chest) : undefined,
        waist: measurements.waist ? parseFloat(measurements.waist) : undefined,
        hips: measurements.hips ? parseFloat(measurements.hips) : undefined,
        biceps: measurements.biceps ? parseFloat(measurements.biceps) : undefined,
        thighs: measurements.thighs ? parseFloat(measurements.thighs) : undefined
      },
      notes: notes || undefined
    }
    
    onSave(newEntry)
    onClose()
    resetForm()
  }
  
  const handleMeasurementChange = (key: keyof typeof measurements, value: string) => {
    setMeasurements({
      ...measurements,
      [key]: value
    })
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
                  {entry ? 'Editar Registro' : 'Novo Registro'}
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium mb-1">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        id="weight"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                        className="input w-full"
                        placeholder="Ex: 75.5"
                        step="0.1"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bodyFat" className="block text-sm font-medium mb-1">
                        Gordura Corporal (%)
                      </label>
                      <input
                        type="number"
                        id="bodyFat"
                        value={bodyFat}
                        onChange={e => setBodyFat(e.target.value)}
                        className="input w-full"
                        placeholder="Ex: 15.5"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Medidas (cm)</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="chest" className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Peito
                        </label>
                        <input
                          type="number"
                          id="chest"
                          value={measurements.chest}
                          onChange={e => handleMeasurementChange('chest', e.target.value)}
                          className="input w-full"
                          placeholder="Ex: 100"
                          step="0.1"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="waist" className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Cintura
                        </label>
                        <input
                          type="number"
                          id="waist"
                          value={measurements.waist}
                          onChange={e => handleMeasurementChange('waist', e.target.value)}
                          className="input w-full"
                          placeholder="Ex: 80"
                          step="0.1"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="hips" className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Quadril
                        </label>
                        <input
                          type="number"
                          id="hips"
                          value={measurements.hips}
                          onChange={e => handleMeasurementChange('hips', e.target.value)}
                          className="input w-full"
                          placeholder="Ex: 95"
                          step="0.1"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="biceps" className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Bíceps
                        </label>
                        <input
                          type="number"
                          id="biceps"
                          value={measurements.biceps}
                          onChange={e => handleMeasurementChange('biceps', e.target.value)}
                          className="input w-full"
                          placeholder="Ex: 35"
                          step="0.1"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="thighs" className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Coxas
                        </label>
                        <input
                          type="number"
                          id="thighs"
                          value={measurements.thighs}
                          onChange={e => handleMeasurementChange('thighs', e.target.value)}
                          className="input w-full"
                          placeholder="Ex: 55"
                          step="0.1"
                          min="0"
                        />
                      </div>
                    </div>
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
                      placeholder="Observações, sensações, etc."
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
                >
                  {entry ? 'Atualizar' : 'Salvar'} Registro
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

export default ProgressEntryForm