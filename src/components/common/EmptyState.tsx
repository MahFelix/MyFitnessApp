import { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  buttonText?: string
  buttonAction?: () => void
  icon?: ReactNode
}

const EmptyState = ({
  title,
  description,
  buttonText,
  buttonAction,
  icon
}: EmptyStateProps) => {
  return (
    <div className="card flex flex-col items-center justify-center p-8 text-center">
      {icon && <div className="mb-4">{icon}</div>}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
        {description}
      </p>
      {buttonText && buttonAction && (
        <button onClick={buttonAction} className="btn btn-primary">
          {buttonText}
        </button>
      )}
    </div>
  )
}

export default EmptyState