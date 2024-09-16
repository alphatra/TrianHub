"use client";
import { useState, useMemo } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, PlusIcon } from 'lucide-react'

export default function CalendarPage() {
  const [date, setDate] = useState(new Date())
  const [workouts, setWorkouts] = useState([
    { id: 1, name: "Taekwondo ITF - Workout 1", date: new Date(2024, 9, 15), duration: 45 },
    { id: 2, name: "Cardio Training", date: new Date(2024, 9, 12), duration: 30 },
    { id: 3, name: "Strength Training", date: new Date(2024, 9, 22), duration: 60 },
  ])

  const workoutDates = useMemo(() => {
    return workouts.reduce((acc, workout) => {
      const dateString = workout.date.toDateString()
      acc[dateString] = true
      return acc
    }, {})
  }, [workouts])

  const filteredWorkouts = workouts.filter(
    workout => workout.date.toDateString() === date?.toDateString()
  )

  return (
    <div className="p-6 bg-background">
      <h1 className="text-3xl font-bold mb-6">Harmonogram</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kalendarz</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                workout: (date) => workoutDates[date.toDateString()]
              }}
              modifiersStyles={{
                workout: { backgroundColor: 'rgba(59, 130, 246, 0.1)', fontWeight: 'bold' }
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Zaplanowane treningi</CardTitle>
            <Button size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Dodaj trening
            </Button>
          </CardHeader>
          <CardContent>
            {filteredWorkouts.length > 0 ? (
              <ul className="space-y-4">
                {filteredWorkouts.map(workout => (
                  <li key={workout.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-sm text-muted-foreground">
                        <CalendarIcon className="inline-block mr-1 h-4 w-4" />
                        {workout.date.toLocaleDateString()} - {workout.duration} min
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Szczegóły</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Brak zaplanowanych treningów na ten dzień.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}