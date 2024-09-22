'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, DumbbellIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import Link from 'next/link'

export default function DashboardPage() {
  const [scheduledWorkouts, setScheduledWorkouts] = useState([])
  const [recentWorkouts, setRecentWorkouts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Pobierz zaplanowane treningi
      const scheduledResponse = await fetch('/api/scheduled-workouts')
      const scheduledData = await scheduledResponse.json()

      // Pobierz ostatnie treningi (jeśli masz endpoint do pobierania historii)
      const workoutsResponse = await fetch('/api/workouts')
      const workoutsData = await workoutsResponse.json()

      // Ustaw dane w stanie komponentu
      setScheduledWorkouts(scheduledData)
      setRecentWorkouts(workoutsData.slice(0, 5)) // Pokaż 5 ostatnich treningów
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Witaj w TrainHub!</h1>

      {/* Sekcja zaplanowanych treningów */}
      <Card>
        <CardHeader>
          <CardTitle>Twoje nadchodzące treningi</CardTitle>
        </CardHeader>
        <CardContent>
          {scheduledWorkouts.length > 0 ? (
            <ul className="space-y-4">
              {scheduledWorkouts.map((workout) => (
                <li
                  key={workout.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{workout.name}</p>
                    <p className="text-sm text-muted-foreground">
                      <CalendarIcon className="inline-block mr-1 h-4 w-4" />{' '}
                      {format(new Date(workout.date), 'dd.MM.yyyy', {
                        locale: pl,
                      })}{' '}
                      - {workout.duration} min
                    </p>
                  </div>
                  <Link href="/dashboard/calendar">
                    <Button variant="outline" size="sm">
                      Szczegóły
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nie masz zaplanowanych treningów.</p>
          )}
        </CardContent>
      </Card>

      {/* Sekcja ostatnich treningów */}
      <Card>
        <CardHeader>
          <CardTitle>Twoje treningi</CardTitle>
        </CardHeader>
        <CardContent>
          {recentWorkouts.length > 0 ? (
            <ul className="space-y-4">
              {recentWorkouts.map((workout) => (
                <li
                  key={workout.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{workout.title}</p>
                    <p className="text-sm text-muted-foreground">
                      <DumbbellIcon className="inline-block mr-1 h-4 w-4" />{' '}
                      Utworzono:{' '}
                      {format(new Date(workout.createdAt), 'dd.MM.yyyy', {
                        locale: pl,
                      })}
                    </p>
                  </div>
                  <Link href={`/dashboard/workouts/${workout.id}`}>
                    <Button variant="outline" size="sm">
                      Otwórz
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nie masz jeszcze żadnych treningów.</p>
          )}
        </CardContent>
      </Card>

      {/* Przyciski akcji */}
      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/dashboard/workouts/new">
          <Button className="flex-1">Stwórz nowy trening</Button>
        </Link>
        <Link href="/dashboard/calendar">
          <Button className="flex-1">Przejdź do kalendarza</Button>
        </Link>
      </div>
    </div>
  )
}
