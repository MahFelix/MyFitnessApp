import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle } from 'react-icons/fi'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}: ConfirmDialogProps) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  
  useEffect(() => {
    if (isOpen) {
      // Focus the confirm button when dialog opens
      confirmButtonRef.current?.focus()
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])
  
  const handleConfirm = () => {
    onConfirm()
    onClose()
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div 
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4">
                  <FiAlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">{message}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  ref={confirmButtonRef}
                  onClick={handleConfirm}
                  className="btn bg-red-500 hover:bg-red-600 text-white"
                >
                  Confirmar
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

export default ConfirmDialog