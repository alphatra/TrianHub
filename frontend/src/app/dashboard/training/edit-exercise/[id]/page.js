'use client'

import { ExerciseForm } from '@/components/ExerciseForm'

export default function EditExercisePage({ params }) {
  return <ExerciseForm id={params.id} />
}