import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiExternalLink } from 'react-icons/fi'

interface WgerWorkout {
  id: number
  name: string
  description: string
  creation_date: string
}

const WgerWorkouts = () => {
  const [workouts, setWorkouts] = useState<WgerWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('https://wger.de/api/v2/workout/', {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Token ' // No token needed for public workouts
          }
        })
        setWorkouts(response.data.results)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch workouts from WGER')
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">WGER Workouts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workouts.map((workout) => (
          <div key={workout.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium mb-2">{workout.name}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {workout.description || 'No description available'}
                </p>
                <p className="text-xs text-neutral-500">
                  Created: {new Date(workout.creation_date).toLocaleDateString()}
                </p>
              </div>
              <a
                href={`https://wger.de/en/workout/${workout.id}/view`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <FiExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WgerWorkouts