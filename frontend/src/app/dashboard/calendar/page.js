"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Plus, Pencil, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

export default function CalendarPage() {
  const { toast } = useToast()
  const [date, setDate] = useState(new Date())
  const [workouts, setWorkouts] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState(null)
  const [formData, setFormData] = useState({ name: '', date: '', duration: '' })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/scheduled-workouts')
      if (!response.ok) {
        throw new Error('Failed to fetch workouts')
      }
      const data = await response.json()
      setWorkouts(data)
    } catch (error) {
      console.error('Error fetching workouts:', error)
      toast({
        title: 'Błąd',
        description: 'Nie udało się załadować treningów. Spróbuj ponownie.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const workoutDates = useMemo(() => {
    return workouts.reduce((acc, workout) => {
      const dateString = new Date(workout.date).toDateString()
      acc[dateString] = true
      return acc
    }, {})
  }, [workouts])

  const filteredWorkouts = useMemo(() => {
    return workouts.filter(
      (workout) =>
        new Date(workout.date).toDateString() === date?.toDateString()
    )
  }, [workouts, date])

  const handleAddWorkout = () => {
    setEditingWorkout(null)
    setFormData({
      name: '',
      date: formatDateToYYYYMMDD(date),
      duration: '',
    })
    setIsDialogOpen(true)
  }

  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout)
    setFormData({
      name: workout.name,
      date: formatDateToYYYYMMDD(new Date(workout.date)),
      duration: workout.duration.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDeleteWorkout = async (id) => {
    if (confirm('Czy na pewno chcesz usunąć ten trening?')) {
      try {
        const response = await fetch(`/api/scheduled-workouts/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Failed to delete workout')
        }
        await fetchWorkouts()
        toast({ title: 'Sukces', description: 'Trening został usunięty.' })
      } catch (error) {
        console.error('Error deleting workout:', error)
        toast({
          title: 'Błąd',
          description: 'Nie udało się usunąć treningu. Spróbuj ponownie.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editingWorkout ? 'PUT' : 'POST'
    let url = '/api/scheduled-workouts'

    const duration = parseInt(formData.duration, 10)
    if (isNaN(duration)) {
      toast({
        title: 'Błąd',
        description: 'Czas trwania musi być liczbą.',
        variant: 'destructive',
      })
      return
    }

    const workoutData = {
      name: formData.name,
      date: new Date(formData.date).toISOString(), // Ensure date is in ISO format
      duration,
    }

    if (editingWorkout) {
      url = `/api/scheduled-workouts/${editingWorkout.id}`
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      })

      if (!response.ok) {
        throw new Error('Failed to save workout')
      }

      setIsDialogOpen(false)
      await fetchWorkouts()
      toast({
        title: 'Sukces',
        description: editingWorkout
          ? 'Trening został zaktualizowany.'
          : 'Trening został dodany.',
      })
      setFormData({ name: '', date: '', duration: '' })
      setEditingWorkout(null)
    } catch (error) {
      console.error('Error saving workout:', error)
      toast({
        title: 'Błąd',
        description: 'Nie udało się zapisać treningu. Spróbuj ponownie.',
        variant: 'destructive',
      })
    }
  }

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
                workout: (date) => workoutDates[date.toDateString()],
              }}
              modifiersStyles={{
                workout: {
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fontWeight: 'bold',
                },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Zaplanowane treningi</CardTitle>
            <Button size="sm" onClick={handleAddWorkout}>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj trening
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Ładowanie treningów...</p>
            ) : filteredWorkouts.length > 0 ? (
              <ul className="space-y-4">
                {filteredWorkouts.map((workout) => (
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
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleEditWorkout(workout)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteWorkout(workout.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                Brak zaplanowanych treningów na ten dzień.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingWorkout ? 'Edytuj trening' : 'Dodaj nowy trening'}
            </DialogTitle>
            <DialogDescription>
              {editingWorkout
                ? 'Zmień szczegóły treningu poniżej.'
                : 'Wprowadź szczegóły nowego treningu poniżej.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nazwa treningu</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Czas trwania (minuty)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">
                {editingWorkout ? 'Zapisz zmiany' : 'Dodaj trening'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
