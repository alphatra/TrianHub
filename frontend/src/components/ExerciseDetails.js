import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ExerciseDetails({ exercise, onBack, onEdit, onDelete }) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{exercise.name}</h2>
        <Button onClick={onBack} variant="outline">
          Wróć do ćwiczeń
        </Button>
      </div>
      <div className="flex space-x-2 mb-4">
        <Button variant="outline" onClick={onEdit}>
          Edytuj
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Usuń
        </Button>
      </div>
      <div className="bg-gray-200 p-4 rounded-lg mb-4">
        <div className="flex justify-between mb-2">
          <span>Poziom: {exercise.difficulty}</span>
          <span>Zestaw: {exercise.set}</span>
        </div>
        <div className="flex justify-between">
          <span>Siła: {exercise.silaValue}/10</span>
          <span>Mobilność: {exercise.mobilnoscValue}/10</span>
          <span>Dynamika: {exercise.dynamikaValue}/10</span>
        </div>
      </div>
      {exercise.videoUrl ? (
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <video
            src={exercise.videoUrl}
            controls
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-w-16 aspect-h-9 bg-gray-300 flex items-center justify-center mb-4 rounded-lg">
          <span className="text-gray-500">Brak wideo</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Instrukcje</h3>
          <p className="bg-gray-100 p-4 rounded-lg">
            {exercise.instructions}
          </p>
        </div>
        {exercise.enrichment && (
          <div>
            <h3 className="font-bold mb-2">Wzbogacenie</h3>
            <p className="bg-gray-100 p-4 rounded-lg">
              {exercise.enrichment}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}