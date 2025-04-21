import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-6xl font-bold text-primary-500 mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
        A página que você está procurando não existe ou foi movida para outro lugar.
      </p>
      <Link to="/" className="btn btn-primary flex items-center">
        <FiArrowLeft className="mr-2" />
        Voltar para a página inicial
      </Link>
    </div>
  )
}

export default NotFound