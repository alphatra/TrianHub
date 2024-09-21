'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import WorkoutPlanner from '@/components/WorkoutPlanner'

export default function EditWorkoutPage() {
  const { id } = useParams()
  const [workout, setWorkout] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`/api/workouts/${id}`)
        if (response.ok) {
          const data = await response.json()
          setWorkout(data)
        } else {
          console.error('Failed to fetch workout')
        }
      } catch (error) {
        console.error('Error fetching workout:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchWorkout()
    }
  }, [id])

  const handleSave = async (updatedWorkout) => {
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWorkout),
      })

      if (response.ok) {
        router.push('/dashboard/workouts')
      } else {
        console.error('Failed to update workout')
      }
    } catch (error) {
      console.error('Error updating workout:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    )
  } else if (!workout) {
    return <div>Trening nie został znaleziony</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edytuj trening</h1>
      <WorkoutPlanner initialWorkout={workout} onSave={handleSave} />
    </div>
  )
}
