'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Save, Plus } from "lucide-react"

export function ExerciseForm({ id = null }) {
  const [formData, setFormData] = useState({
    name: "",
    set: "",
    difficulty: "",
    silaValue: 0,
    mobilnoscValue: 0,
    dynamikaValue: 0,
    instructions: "",
    enrichment: "",
    videoUrl: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (id) {
      const fetchExercise = async () => {
        try {
          const res = await fetch(`/api/exercises/${id}`)
          if (!res.ok) throw new Error('Failed to fetch exercise')
          const data = await res.json()
          setFormData(data)
        } catch (error) {
          console.error('Error fetching exercise:', error)
          setError('Nie udało się załadować danych ćwiczenia')
        }
      }
      fetchExercise()
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/exercises${id ? `/${id}` : ''}`, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(
          errorData.error ||
            `Nie udało się ${id ? 'zaktualizować' : 'dodać'} ćwiczenia`
        )
      }
      router.push('/dashboard/training')
    } catch (error) {
      console.error(
        `Error ${id ? 'updating' : 'adding'} exercise:`,
        error
      )
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {id ? "Edytuj ćwiczenie" : "Dodaj nowe ćwiczenie"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Błąd</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nazwa ćwiczenia</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set">Zestaw</Label>
              <Input
                id="set"
                name="set"
                value={formData.set}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Poziom trudności</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, difficulty: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz poziom trudności" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="początkujący">
                    Początkujący
                  </SelectItem>
                  <SelectItem value="średni">Średni</SelectItem>
                  <SelectItem value="zaawansowany">
                    Zaawansowany
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label>Wartości</Label>
              <div className="space-y-2">
                <Label htmlFor="silaValue">
                  Siła: {formData.silaValue}
                </Label>
                <Slider
                  id="silaValue"
                  min={0}
                  max={10}
                  step={1}
                  value={[formData.silaValue]}
                  onValueChange={(value) =>
                    handleSliderChange('silaValue', value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobilnoscValue">
                  Mobilność: {formData.mobilnoscValue}
                </Label>
                <Slider
                  id="mobilnoscValue"
                  min={0}
                  max={10}
                  step={1}
                  value={[formData.mobilnoscValue]}
                  onValueChange={(value) =>
                    handleSliderChange('mobilnoscValue', value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dynamikaValue">
                  Dynamika: {formData.dynamikaValue}
                </Label>
                <Slider
                  id="dynamikaValue"
                  min={0}
                  max={10}
                  step={1}
                  value={[formData.dynamikaValue]}
                  onValueChange={(value) =>
                    handleSliderChange('dynamikaValue', value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Instrukcje</Label>
              <Textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrichment">Dodatki (opcjonalnie)</Label>
              <Textarea
                id="enrichment"
                name="enrichment"
                value={formData.enrichment}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL do wideo (opcjonalnie)</Label>
              <Input
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                type="url"
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                "Przetwarzanie..."
              ) : id ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Zaktualizuj ćwiczenie
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Dodaj ćwiczenie
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}