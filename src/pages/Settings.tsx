import { useState } from 'react'
import { FiSun, FiMoon, FiDownload, FiUpload, FiTrash2 } from 'react-icons/fi'
import { useThemeStore } from '../stores/themeStore'
import { 
  getWorkouts, saveWorkouts,
  getExercises, saveExercises,
  getProgressEntries, saveProgressEntries
} from '../utils/storage'
import ConfirmDialog from '../components/common/ConfirmDialog'

const Settings = () => {
  const { darkMode, toggleDarkMode } = useThemeStore()
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  
  const handleExportData = () => {
    const data = {
      workouts: getWorkouts(),
      exercises: getExercises(),
      progressEntries: getProgressEntries(),
      exportDate: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    
    const exportFilename = `myfitness_backup_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFilename)
    linkElement.click()
  }
  
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        
        // Validate imported data structure
        if (!json.workouts || !json.exercises || !json.progressEntries) {
          throw new Error('Invalid backup file format')
        }
        
        // Import data
        saveWorkouts(json.workouts)
        saveExercises(json.exercises)
        saveProgressEntries(json.progressEntries)
        
        setImportError(null)
        alert('Dados importados com sucesso!')
        
        // Reset file input
        e.target.value = ''
      } catch (error) {
        console.error('Import error:', error)
        setImportError('Erro ao importar: formato de arquivo inválido')
      }
    }
    
    reader.readAsText(file)
  }
  
  const handleResetData = () => {
    setIsResetDialogOpen(true)
  }
  
  const confirmResetData = () => {
    // Clear all data
    saveWorkouts([])
    saveExercises([])
    saveProgressEntries([])
    
    setIsResetDialogOpen(false)
    alert('Todos os dados foram apagados com sucesso')
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Aparência</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Tema</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Escolha entre tema claro ou escuro
              </p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Dados</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Exportar dados</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Baixe seus dados para fazer backup
                </p>
              </div>
              <button 
                onClick={handleExportData}
                className="btn btn-primary flex items-center"
              >
                <FiDownload className="mr-2" />
                Exportar
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Importar dados</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Restaure a partir de um backup anterior
                </p>
                {importError && (
                  <p className="text-sm text-red-500 mt-1">{importError}</p>
                )}
              </div>
              <label className="btn btn-secondary flex items-center cursor-pointer">
                <FiUpload className="mr-2" />
                Importar
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={handleImportData}
                />
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Resetar dados</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Limpar todos os dados do aplicativo
                </p>
              </div>
              <button 
                onClick={handleResetData}
                className="btn bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 flex items-center"
              >
                <FiTrash2 className="mr-2" />
                Resetar
              </button>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Sobre</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            MyFitness - Versão 1.0.0
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Um aplicativo pessoal para acompanhar seus treinos e progresso.
          </p>
        </div>
      </div>
      
      <ConfirmDialog 
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={confirmResetData}
        title="Resetar todos os dados"
        message="Tem certeza que deseja apagar todos os seus dados? Esta ação não pode ser desfeita."
      />
    </div>
  )
}

export default Settings