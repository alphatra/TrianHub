import React, { useState, useCallback, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Minus, GripVertical, X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

const DraggableExercise = ({
  exercise,
  index,
  sectionId,
  moveExercise,
  removeExercise,
  updateExercise,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'EXERCISE',
    item: { id: exercise.id, index, sectionId, type: 'EXERCISE' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'EXERCISE',
    hover(item) {
      if (item.type !== 'EXERCISE') return
      if (item.id === exercise.id) return

      const dragIndex = item.index
      const hoverIndex = index
      const sourceSectionId = item.sectionId
      const targetSectionId = sectionId

      if (sourceSectionId !== targetSectionId || dragIndex !== hoverIndex) {
        moveExercise(
          item.id,
          sourceSectionId,
          targetSectionId,
          dragIndex,
          hoverIndex
        )
        item.index = hoverIndex
        item.sectionId = targetSectionId
      }
    },
  })

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center gap-2 mb-2 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <GripVertical className="cursor-move" />
      <div className="flex-grow bg-secondary text-secondary-foreground px-3 py-2 rounded-md">
        {exercise.name}
      </div>
      <Input
        type="text"
        placeholder="Serie"
        value={exercise.sets}
        onChange={(e) =>
          updateExercise(sectionId, exercise.id, { sets: e.target.value })
        }
        className="w-16"
      />
      <span className="text-lg font-bold">x</span>
      {exercise.unit === 'reps' ? (
        <Input
          type="text"
          placeholder="Powtórzenia"
          value={exercise.quantity}
          onChange={(e) =>
            updateExercise(sectionId, exercise.id, {
              quantity: e.target.value,
            })
          }
          className="w-20"
        />
      ) : (
        <Input
          type="text"
          placeholder="Czas (sekundy)"
          value={exercise.duration || ''}
          onChange={(e) =>
            updateExercise(sectionId, exercise.id, {
              duration: e.target.value,
            })
          }
          className="w-24"
        />
      )}
      <Select
        value={exercise.unit}
        onValueChange={(value) =>
          updateExercise(sectionId, exercise.id, { unit: value })
        }
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Jednostka" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="reps">Powt.</SelectItem>
          <SelectItem value="time">Sekundy</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        placeholder="Przerwa (sek)"
        value={exercise.rest || ''}
        onChange={(e) =>
          updateExercise(sectionId, exercise.id, { rest: e.target.value })
        }
        className="w-24"
      />
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

const DraggableSection = ({
  section,
  index,
  moveSectionUp,
  moveSectionDown,
  removeSection,
  moveExercise,
  removeExercise,
  updateExercise,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'SECTION',
    item: { id: section.id, index, type: 'SECTION' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: ['SECTION', 'EXERCISE'],
    hover(item) {
      if (item.type === 'SECTION' && item.id !== section.id) {
        const dragIndex = item.index
        const hoverIndex = index

        if (dragIndex !== hoverIndex) {
          if (dragIndex < hoverIndex) {
            moveSectionDown(dragIndex)
            item.index = dragIndex + 1
          } else {
            moveSectionUp(dragIndex)
            item.index = dragIndex - 1
          }
        }
      } else if (item.type === 'EXERCISE') {
        const sourceSectionId = item.sectionId
        const targetSectionId = section.id
        const dragIndex = item.index
        const hoverIndex = section.exercises.length

        if (sourceSectionId !== targetSectionId) {
          moveExercise(
            item.id,
            sourceSectionId,
            targetSectionId,
            dragIndex,
            hoverIndex
          )
          item.index = hoverIndex
          item.sectionId = targetSectionId
        }
      }
    },
  })

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`mb-4 ${isDragging ? 'opacity-50' : ''}`}
    >
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
      {section.exercises && section.exercises.length > 0 ? (
        section.exercises.map((exercise, exerciseIndex) => (
          <DraggableExercise
            key={exercise.id}
            exercise={exercise}
            index={exerciseIndex}
            sectionId={section.id}
            moveExercise={moveExercise}
            removeExercise={removeExercise}
            updateExercise={updateExercise}
          />
        ))
      ) : (
        <div className="h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400">
          Przeciągnij ćwiczenie tutaj
        </div>
      )}
    </div>
  )
}

export default function WorkoutPlanner({ initialWorkout, onSave }) {
  const [exercises, setExercises] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [planTitle, setPlanTitle] = useState(initialWorkout?.title || '')
  const [sections, setSections] = useState(initialWorkout?.sections || [])
  const [newSectionName, setNewSectionName] = useState('')

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/exercises')
        if (!response.ok) throw new Error('Failed to fetch exercises')
        const data = await response.json()
        setExercises(data)
      } catch (error) {
        console.error('Error fetching exercises:', error)
      }
    }
    fetchExercises()
  }, [])

  const addSection = () => {
    if (newSectionName.trim()) {
      setSections((prevSections) => [
        ...prevSections,
        { id: uuidv4(), name: newSectionName, exercises: [] },
      ])
      setNewSectionName('')
    }
  }

  const removeSection = (sectionId) => {
    setSections((prevSections) =>
      prevSections.filter((section) => section.id !== sectionId)
    )
  }

  const moveSectionUp = (index) => {
    setSections((prevSections) => {
      if (index > 0) {
        const newSections = [...prevSections]
        ;[newSections[index - 1], newSections[index]] = [
          newSections[index],
          newSections[index - 1],
        ]
        return newSections
      }
      return prevSections
    })
  }

  const moveSectionDown = (index) => {
    setSections((prevSections) => {
      if (index < prevSections.length - 1) {
        const newSections = [...prevSections]
        ;[newSections[index], newSections[index + 1]] = [
          newSections[index + 1],
          newSections[index],
        ]
        return newSections
      }
      return prevSections
    })
  }

  const addExerciseToSection = (exercise) => {
    if (sections.length > 0) {
      const newExercise = {
        id: uuidv4(),
        name: exercise.name,
        sets: '',
        quantity: '',
        unit: 'reps',
        duration: '',
        rest: '',
      }
      setSections((prevSections) => {
        const newSections = [...prevSections]
        // Możesz pozwolić użytkownikowi wybrać, do której sekcji dodać ćwiczenie
        const lastSectionIndex = newSections.length - 1
        newSections[lastSectionIndex].exercises.push(newExercise)
        return newSections
      })
    } else {
      alert('Najpierw dodaj sekcję treningu.')
    }
  }

  const updateExercise = (sectionId, exerciseId, updates) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              exercises: section.exercises.map((exercise) =>
                exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
              ),
            }
          : section
      )
    )
  }

  const removeExerciseFromSection = (sectionId, exerciseId) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              exercises: section.exercises.filter(
                (exercise) => exercise.id !== exerciseId
              ),
            }
          : section
      )
    )
  }

  const moveExercise = useCallback(
    (exerciseId, sourceSectionId, targetSectionId, fromIndex, toIndex) => {
      setSections((prevSections) => {
        const newSections = prevSections.map((section) => ({
          ...section,
          exercises: [...section.exercises],
        }))

        const sourceSection = newSections.find(
          (section) => section.id === sourceSectionId
        )
        const targetSection = newSections.find(
          (section) => section.id === targetSectionId
        )

        if (sourceSection && targetSection) {
          const [movedExercise] = sourceSection.exercises.splice(fromIndex, 1)
          targetSection.exercises.splice(toIndex, 0, movedExercise)
        }

        return newSections
      })
    },
    []
  )

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const saveWorkout = () => {
    if (!planTitle.trim()) {
      alert('Proszę podać tytuł treningu.')
      return
    }

    if (sections.length === 0) {
      alert('Trening musi zawierać co najmniej jedną sekcję.')
      return
    }

    const workoutData = {
      id: initialWorkout?.id,
      title: planTitle,
      sections: sections,
    }
    onSave(workoutData)
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
            <Button className="w-full" onClick={saveWorkout}>
              {initialWorkout ? 'Zapisz zmiany' : 'Zapisz konspekt'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  )
}
