'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plus,
  Loader2,
  Edit,
  Trash,
  Dumbbell,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function WorkoutListPage() {
  const [workouts, setWorkouts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchWorkouts()
    }
  }, [status])

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts')
      if (response.ok) {
        const data = await response.json()
        setWorkouts(data)
      } else {
        console.error('Failed to fetch workouts')
      }
    } catch (error) {
      console.error('Error fetching workouts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Czy na pewno chcesz usunąć ten trening?')) {
      try {
        const response = await fetch(`/api/workouts/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setWorkouts(workouts.filter((workout) => workout.id !== id))
        } else {
          const errorData = await response.json()
          console.error('Błąd podczas usuwania treningu:', errorData.error)
          alert(`Nie udało się usunąć treningu: ${errorData.error}`)
        }
      } catch (error) {
        console.error('Błąd podczas usuwania treningu:', error)
        alert('Wystąpił błąd podczas usuwania treningu.')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-4xl font-bold text-primary">Lista Treningów</h1>
        <Link href="/dashboard/workouts/new">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
            <Plus className="mr-2 h-5 w-5" />
            Stwórz Nowy Trening
          </Button>
        </Link>
      </motion.div>

      <AnimatePresence>
        {workouts.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-600 text-xl mt-8"
          >
            Nie znaleziono żadnych treningów. Stwórz swój pierwszy trening!
          </motion.p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {workouts.map((workout) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <CardTitle className="text-2xl font-bold">
                      {workout.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Utworzono:{' '}
                        {new Date(workout.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Link href={`/dashboard/workouts/${workout.id}`}>
                        <Button
                          variant="outline"
                          className="flex items-center space-x-2 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-300"
                        >
                          <Dumbbell className="h-4 w-4" />
                          <span>Otwórz</span>
                        </Button>
                      </Link>
                      <Link href={`/dashboard/workouts/edit/${workout.id}`}>
                        <Button
                          variant="outline"
                          className="flex items-center space-x-2 hover:bg-green-100 dark:hover:bg-green-900 transition-colors duration-300"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edytuj</span>
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(workout.id)}
                        className="flex items-center space-x-2 hover:bg-red-600 transition-colors duration-300"
                      >
                        <Trash className="h-4 w-4" />
                        <span>Usuń</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
