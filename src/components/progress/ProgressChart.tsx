/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { format } from 'date-fns'
import { getProgressEntries } from '../../utils/storage'
import { ProgressEntry } from '../../types'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const ProgressChart = () => {
  const [entries, setEntries] = useState<ProgressEntry[]>([])
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: []
  })
  
  useEffect(() => {
    const data = getProgressEntries()
    
    // Sort by date, oldest first for chronological display
    const sorted = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    setEntries(sorted)
  }, [])
  
  useEffect(() => {
    if (entries.length === 0) return
    
    const labels = entries.map(entry => 
      format(new Date(entry.date), 'dd/MM')
    )
    
    const weightData = entries.map(entry => entry.weight || null)
    const bodyFatData = entries.map(entry => entry.bodyFat || null)
    
    setChartData({
      labels,
      datasets: [
        {
          label: 'Peso (kg)',
          data: weightData,
          borderColor: '#0077FF',
          backgroundColor: 'rgba(0, 119, 255, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Gordura Corporal (%)',
          data: bodyFatData,
          borderColor: '#FF9500',
          backgroundColor: 'rgba(255, 149, 0, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: 'y1'
        }
      ]
    })
  }, [entries])
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(200, 200, 200, 0.1)'
        },
        ticks: {
          color: '#697586'
        }
      },
      y1: {
        position: 'right' as const,
        beginAtZero: true,
        max: 40,
        grid: {
          display: false
        },
        ticks: {
          color: '#697586'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#697586'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#697586',
          usePointStyle: true,
          boxWidth: 8,
          padding: 20
        }
      }
    }
  }
  
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-neutral-600 dark:text-neutral-400 mb-2">
          Nenhum dado de progresso disponível
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-500">
          Adicione registros de peso e medidas para visualizar seu progresso
        </p>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col">
      <Line data={chartData} options={options} />
    </div>
  )
}

export default ProgressChart