import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Calendar from 'react-calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getWorkouts } from '../utils/storage'
import { Workout } from '../types'
import WorkoutCard from '../components/workout/WorkoutCard'
import 'react-calendar/dist/Calendar.css'
import '../styles/calendar.css'

const CalendarPage = () => {
  const [date, setDate] = useState(new Date())
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [workoutsOnDate, setWorkoutsOnDate] = useState<Workout[]>([])

  useEffect(() => {
    const data = getWorkouts()
    setWorkouts(data)

    // Filter workouts for the selected date
    const selectedDateStr = format(date, 'yyyy-MM-dd')
    const filtered = data.filter(workout => {
      const workoutDate = new Date(workout.date)
      return format(workoutDate, 'yyyy-MM-dd') === selectedDateStr
    })

    setWorkoutsOnDate(filtered)
  }, [date])

  const handleDateChange = (newDate: Date) => {
    setDate(newDate)
  }

  // Function to add class to tiles with workouts
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null

    const hasWorkout = workouts.some(workout => {
      const workoutDate = new Date(workout.date)
      return format(workoutDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    })

    return hasWorkout ? 'has-workout' : null
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Calendário de Treinos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <Calendar
              onChange={handleDateChange}
              value={date}
              locale="pt-BR"
              tileClassName={tileClassName}
              formatDay={(_, date) => format(date, 'd')}
              formatMonthYear={(_, date) => format(date, 'MMMM yyyy', { locale: ptBR })}
              next2Label={null}
              prev2Label={null}
              showNeighboringMonth={false}
            />
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-card p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">
              {format(date, "d 'de' MMMM, yyyy", { locale: ptBR })}
            </h2>

            {workoutsOnDate.length > 0 ? (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {workoutsOnDate.length} {workoutsOnDate.length === 1 ? 'treino' : 'treinos'} neste dia
              </p>
            ) : (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Nenhum treino agendado para este dia
              </p>
            )}
          </div>

          <div className="space-y-4">
            {workoutsOnDate.length > 0 ? (
              workoutsOnDate.map(workout => (
                <Link key={workout.id} to={`/workouts/${workout.id}`}>
                  <div className="card">
                    <WorkoutCard workout={workout} />
                  </div>
                </Link>
              ))
            ) : (
              <div className="card p-6 text-center">
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Nenhum treino agendado para este dia
                </p>
                <Link to="/workouts" className="btn btn-primary">
                  Adicionar treino
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage