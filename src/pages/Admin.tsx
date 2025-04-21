import { useState, useEffect } from 'react'
import { FiPlusCircle, FiBarChart2, FiCalendar, FiList } from 'react-icons/fi'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  getProgressEntries, 
  saveProgressEntry, 
  deleteProgressEntry 
} from '../utils/storage'
import { ProgressEntry } from '../types'
import { generateId } from '../utils/helpers'
import ProgressEntryForm from '../components/progress/ProgressEntryForm'
import ProgressEntryCard from '../components/progress/ProgressEntryCard'
import ProgressChart from '../components/progress/ProgressChart'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Tab from '../components/common/Tab'

type TabType = 'progress' | 'entries' | 'statistics'

const Admin = () => {
  const [entries, setEntries] = useState<ProgressEntry[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<ProgressEntry | null>(null)
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('progress')
  
  useEffect(() => {
    const data = getProgressEntries()
    // Sort by date, newest first
    const sorted = [...data].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    setEntries(sorted)
  }, [])
  
  const handleAddEntry = () => {
    setEditingEntry(null)
    setIsFormOpen(true)
  }
  
  const handleEditEntry = (entry: ProgressEntry) => {
    setEditingEntry(entry)
    setIsFormOpen(true)
  }
  
  const handleDeleteEntry = (id: string) => {
    setDeleteEntryId(id)
  }
  
  const confirmDeleteEntry = () => {
    if (deleteEntryId) {
      deleteProgressEntry(deleteEntryId)
      setEntries(prevEntries => 
        prevEntries.filter(entry => entry.id !== deleteEntryId)
      )
      setDeleteEntryId(null)
    }
  }
  
  const handleSaveEntry = (entry: Omit<ProgressEntry, 'id'>) => {
    const newEntry: ProgressEntry = editingEntry
      ? { ...entry, id: editingEntry.id }
      : { ...entry, id: generateId() }
    
    saveProgressEntry(newEntry)
    
    setEntries(prevEntries => {
      const filtered = prevEntries.filter(e => e.id !== newEntry.id)
      return [newEntry, ...filtered].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    })
    
    setIsFormOpen(false)
    setEditingEntry(null)
  }
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'progress':
        return (
          <div className="card h-96">
            <h2 className="text-lg font-semibold mb-4">Progresso de Peso</h2>
            <ProgressChart />
          </div>
        )
      case 'entries':
        return (
          <div className="space-y-4">
            {entries.length > 0 ? (
              entries.map(entry => (
                <ProgressEntryCard 
                  key={entry.id} 
                  entry={entry}
                  onEdit={() => handleEditEntry(entry)}
                  onDelete={() => handleDeleteEntry(entry.id)}
                />
              ))
            ) : (
              <div className="card p-6 text-center">
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Nenhum registro de progresso encontrado
                </p>
                <button onClick={handleAddEntry} className="btn btn-primary">
                  Adicionar registro
                </button>
              </div>
            )}
          </div>
        )
      case 'statistics':
        return (
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Estatísticas</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {entries.length > 0 ? (
                <>
                  <span className="block mb-2">
                    <strong>Primeiro registro:</strong> {format(new Date(entries[entries.length - 1].date), 'PPP', { locale: ptBR })}
                  </span>
                  <span className="block mb-2">
                    <strong>Último registro:</strong> {format(new Date(entries[0].date), 'PPP', { locale: ptBR })}
                  </span>
                  <span className="block mb-2">
                    <strong>Total de registros:</strong> {entries.length}
                  </span>
                </>
              ) : (
                'Nenhum dado disponível ainda.'
              )}
            </p>
          </div>
        )
      default:
        return null
    }
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administração</h1>
        <button 
          onClick={handleAddEntry}
          className="btn btn-primary flex items-center"
        >
          <FiPlusCircle className="mr-2" />
          Novo Registro
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-neutral-200 dark:border-neutral-700">
          <Tab 
            isActive={activeTab === 'progress'}
            onClick={() => setActiveTab('progress')}
            icon={<FiBarChart2 className="mr-2" />}
            label="Gráficos"
          />
          <Tab 
            isActive={activeTab === 'entries'}
            onClick={() => setActiveTab('entries')}
            icon={<FiList className="mr-2" />}
            label="Registros"
          />
          <Tab 
            isActive={activeTab === 'statistics'}
            onClick={() => setActiveTab('statistics')}
            icon={<FiCalendar className="mr-2" />}
            label="Estatísticas"
          />
        </div>
      </div>
      
      {renderTabContent()}
      
      {isFormOpen && (
        <ProgressEntryForm 
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setEditingEntry(null)
          }}
          onSave={handleSaveEntry}
          entry={editingEntry}
        />
      )}
      
      <ConfirmDialog 
        isOpen={!!deleteEntryId}
        onClose={() => setDeleteEntryId(null)}
        onConfirm={confirmDeleteEntry}
        title="Excluir Registro"
        message="Tem certeza que deseja excluir este registro de progresso? Esta ação não pode ser desfeita."
      />
    </div>
  )
}

export default Admin