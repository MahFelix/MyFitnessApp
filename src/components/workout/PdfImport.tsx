import { useState, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { FiUpload, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

// Set worker path for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PdfImportProps {
  onImport: (text: string) => void
}

const PdfImport = ({ onImport }: PdfImportProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setFile(file)
    } else {
      alert('Please select a valid PDF file')
    }
  }

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const handleImport = async () => {
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('pdf', file)

      // Here you would typically send the PDF to a server for processing
      // For now, we'll just pass the file name as a simple example
      onImport(`Imported workout from ${file.name}`)
      
      // Reset the form
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error importing PDF:', error)
      alert('Failed to import PDF')
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Import Workout from PDF</h3>
        {file && (
          <button
            onClick={() => setFile(null)}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-center items-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-6">
          <label className="flex flex-col items-center cursor-pointer">
            <FiUpload className="w-8 h-8 text-neutral-400 mb-2" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Click to select PDF or drag and drop
            </span>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4"
            >
              <Document
                file={file}
                onLoadSuccess={handleDocumentLoadSuccess}
                className="flex justify-center"
              >
                <Page
                  pageNumber={pageNumber}
                  width={300}
                  className="border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden"
                />
              </Document>
              
              {numPages && numPages > 1 && (
                <div className="flex justify-center items-center mt-4 space-x-4">
                  <button
                    onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                    disabled={pageNumber <= 1}
                    className="btn btn-secondary px-3 py-1"
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                    disabled={pageNumber >= numPages}
                    className="btn btn-secondary px-3 py-1"
                  >
                    Next
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleImport}
          disabled={!file}
          className="btn btn-primary w-full"
        >
          Import Workout
        </button>
      </div>
    </div>
  )
}

export default PdfImport