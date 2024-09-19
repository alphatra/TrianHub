"use client"

import { useState, useCallback, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, GripVertical, X } from "lucide-react"
import { useRouter } from 'next/navigation'

const DraggableExercise = ({ exercise, index, sectionId, moveExercise, removeExercise, updateExercise }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'EXERCISE',
    item: { id: exercise.id, index, sectionId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'EXERCISE',
    hover(item, monitor) {
      if (!drag) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      const sourceSectionId = item.sectionId
      const targetSectionId = sectionId

      if (dragIndex === hoverIndex && sourceSectionId === targetSectionId) {
        return
      }

      moveExercise(item.id, sourceSectionId, targetSectionId, dragIndex, hoverIndex)
      item.index = hoverIndex
      item.sectionId = targetSectionId
    },
  })

  return (
    <div ref={(node) => drag(drop(node))} className={`flex items-center gap-2 mb-2 ${isDragging ? 'opacity-50' : ''}`}>
      <GripVertical className="cursor-move" />
      <div className="flex-grow bg-secondary text-secondary-foreground px-3 py-2 rounded-md">
        {exercise.name}
      </div>
      <Input
        type="text"
        placeholder="Serie"
        value={exercise.sets}
        onChange={(e) => updateExercise(sectionId, exercise.id, { sets: e.target.value })}
        className="w-16"
      />
      <span className="text-lg font-bold">x</span>
      <Input
        type="text"
        placeholder="Ilość"
        value={exercise.quantity}
        onChange={(e) => updateExercise(sectionId, exercise.id, { quantity: e.target.value })}
        className="w-20"
      />
      <Select
        value={exercise.unit}
        onValueChange={(value) => updateExercise(sectionId, exercise.id, { unit: value })}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Jednostka" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="min">min</SelectItem>
          <SelectItem value="reps">powt.</SelectItem>
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => removeExercise(sectionId, exercise.id)}
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  )
}

const DraggableSection = ({ section, index, moveSectionUp, moveSectionDown, removeSection, moveExercise, removeExercise, updateExercise }) => {
  const [, drag] = useDrag({
    type: 'SECTION',
    item: { id: section.id, index },
  })

  const [, drop] = useDrop({
    accept: 'SECTION',
    hover(item) {
      if (item.index !== index) {
        if (item.index < index) {
          moveSectionDown(item.index)
        } else {
          moveSectionUp(index)
        }
        item.index = index
      }
    },
  })

  return (
    <div ref={(node) => drag(drop(node))} className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{section.name}</h3>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => removeSection(section.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {section.exercises.map((exercise, exerciseIndex) => (
        <DraggableExercise
          key={exercise.id}
          exercise={exercise}
          index={exerciseIndex}
          sectionId={section.id}
          moveExercise={moveExercise}
          removeExercise={removeExercise}
          updateExercise={updateExercise}
        />
      ))}
    </div>
  )
}

export default function WorkoutPlanner() {
  const [exercises, setExercises] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [planTitle, setPlanTitle] = useState('')
  const [sections, setSections] = useState([])
  const [newSectionName, setNewSectionName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchExercises = async () => {
      const response = await fetch('/api/exercises')
      const data = await response.json()
      setExercises(data)
    }
    fetchExercises()
  }, [])

  const addSection = () => {
    if (newSectionName.trim()) {
      setSections([...sections, { id: Date.now().toString(), name: newSectionName, exercises: [] }])
      setNewSectionName('')
    }
  }

  const removeSection = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId))
  }

  const moveSectionUp = (index) => {
    if (index > 0) {
      const newSections = [...sections]
      const temp = newSections[index - 1]
      newSections[index - 1] = newSections[index]
      newSections[index] = temp
      setSections(newSections)
    }
  }

  const moveSectionDown = (index) => {
    if (index < sections.length - 1) {
      const newSections = [...sections]
      const temp = newSections[index + 1]
      newSections[index + 1] = newSections[index]
      newSections[index] = temp
      setSections(newSections)
    }
  }

  const addExerciseToSection = (exercise) => {
    if (sections.length > 0) {
      const newSections = [...sections]
      const lastSectionIndex = newSections.length - 1
      newSections[lastSectionIndex].exercises.push({ 
        id: Date.now().toString(),
        name: exercise.name, 
        sets: '',
        quantity: '',
        unit: 'reps'
      })
      setSections(newSections)
    }
  }

  const updateExercise = (sectionId, exerciseId, updates) => {
    const newSections = sections.map(section => 
      section.id === sectionId
        ? {
            ...section,
            exercises: section.exercises.map(exercise => 
              exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
            )
          }
        : section
    )
    setSections(newSections)
  }

  const removeExerciseFromSection = (sectionId, exerciseId) => {
    const newSections = sections.map(section => 
      section.id === sectionId
        ? {
            ...section,
            exercises: section.exercises.filter(exercise => exercise.id !== exerciseId)
          }
        : section
    )
    setSections(newSections)
  }

  const moveExercise = useCallback((exerciseId, sourceSectionId, targetSectionId, fromIndex, toIndex) => {
    setSections(prevSections => {
      const newSections = [...prevSections]
      const sourceSection = newSections.find(section => section.id === sourceSectionId)
      const targetSection = newSections.find(section => section.id === targetSectionId)

      if (sourceSection && targetSection) {
        const [movedExercise] = sourceSection.exercises.splice(fromIndex, 1)
        targetSection.exercises.splice(toIndex, 0, movedExercise)
      }

      return newSections
    })
  }, [])

  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const saveWorkout = async () => {
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: planTitle,
          sections: sections,
        }),
      })

      if (response.ok) {
        router.push('/dashboard/workouts')
      } else {
        console.error('Failed to save workout')
      }
    } catch (error) {
      console.error('Error saving workout:', error)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Baza ćwiczeń</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Wyszukaj..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            {filteredExercises.map((exercise) => (
              <div key={exercise.id} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{exercise.name}</h3>
                  <Button size="sm" onClick={() => addExerciseToSection(exercise)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Konspekt treningu</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Tytuł"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="mb-4"
            />
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="Wpisz nazwę sekcji... (np. Rozgrzewka)"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
              />
              <Button onClick={addSection}>Dodaj Sekcję</Button>
            </div>
            {sections.map((section, index) => (
              <DraggableSection
                key={section.id}
                section={section}
                index={index}
                moveSectionUp={moveSectionUp}
                moveSectionDown={moveSectionDown}
                removeSection={removeSection}
                moveExercise={moveExercise}
                removeExercise={removeExerciseFromSection}
                updateExercise={updateExercise}
              />
            ))}
            <Button className="w-full" onClick={saveWorkout}>Zapisz konspekt</Button>
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  )
}