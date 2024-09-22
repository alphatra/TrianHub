'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Loader2, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { ExerciseDetails } from "@/components/ExerciseDetails"
import { motion } from "framer-motion"

export default function TrainingPage() {
  const [exercises, setExercises] = useState([])
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [difficulty, setDifficulty] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/exercises')
      if (!res.ok) throw new Error('Failed to fetch exercises')
      const data = await res.json()
      setExercises(data)
    } catch (error) {
      console.error('Error fetching exercises:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (difficulty === "all" ||
        exercise.difficulty.toLowerCase() === difficulty)
  )

  const addExercise = () => router.push('/dashboard/training/add-exercise')
  const editExercise = (exercise) =>
    router.push(`/dashboard/training/edit-exercise/${exercise.id}`)
  const deleteExercise = async (id) => {
    if (confirm("Czy na pewno chcesz usunąć to ćwiczenie?")) {
      try {
        const res = await fetch(`/api/exercises/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to delete exercise')
        await fetchExercises()
      } catch (error) {
        console.error('Error deleting exercise:', error)
      }
    }
  }

  const viewExercise = (exercise) => setSelectedExercise(exercise)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl">
        {selectedExercise ? (
          <ExerciseDetails
            exercise={selectedExercise}
            onBack={() => setSelectedExercise(null)}
            onEdit={() => editExercise(selectedExercise)}
            onDelete={() => deleteExercise(selectedExercise.id)}
          />
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6 flex items-center justify-between">
              <span>Trening</span>
              <Button
                onClick={addExercise}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                <Plus className="mr-2 h-4 w-4" /> Dodaj ćwiczenie
              </Button>
            </h1>
            <div className="flex flex-wrap items-center mb-6 gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Wyszukaj ćwiczenie"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {["all", "zaawansowany", "średni", "początkujący"].map(
                (level) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? "default" : "outline"}
                    onClick={() => setDifficulty(level)}
                    className="capitalize"
                  >
                    {level === "all" ? "Wszystkie" : level}
                  </Button>
                )
              )}
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nazwa Ćwiczenia</TableHead>
                      <TableHead>Zestaw</TableHead>
                      <TableHead>Poziom Trudności</TableHead>
                      <TableHead>Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell className="font-medium">
                          {exercise.name}
                        </TableCell>
                        <TableCell>{exercise.set}</TableCell>
                        <TableCell>{exercise.difficulty}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewExercise(exercise)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editExercise(exercise)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteExercise(exercise.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </Card>
    </motion.div>
  )
}