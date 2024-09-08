import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function AddExerciseForm({ onAdd }) {
    const [exercise, setExercise] = useState({
        name: '',
        difficulty: '',
        set: '',
        silaValue: 0,
        mobilnoscValue: 0,
        dynamikaValue: 0,
        instructions: '',
        enrichment: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        await onAdd(exercise)
        setExercise({ name: '', difficulty: '', set: '', silaValue: 0, mobilnoscValue: 0, dynamikaValue: 0, instructions: '', enrichment: '' })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                placeholder="Nazwa ćwiczenia"
                value={exercise.name}
                onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
            />
            <Input
                placeholder="Poziom trudności"
                value={exercise.difficulty}
                onChange={(e) => setExercise({ ...exercise, difficulty: e.target.value })}
            />
            <Input
                placeholder="Zestaw"
                value={exercise.set}
                onChange={(e) => setExercise({ ...exercise, set: e.target.value })}
            />
            <Input
                type="number"
                placeholder="Siła (0-10)"
                value={exercise.silaValue}
                onChange={(e) => setExercise({ ...exercise, silaValue: parseInt(e.target.value) })}
            />
            <Input
                type="number"
                placeholder="Mobilność (0-10)"
                value={exercise.mobilnoscValue}
                onChange={(e) => setExercise({ ...exercise, mobilnoscValue: parseInt(e.target.value) })}
            />
            <Input
                type="number"
                placeholder="Dynamika (0-10)"
                value={exercise.dynamikaValue}
                onChange={(e) => setExercise({ ...exercise, dynamikaValue: parseInt(e.target.value) })}
            />
            <Textarea
                placeholder="Instrukcje"
                value={exercise.instructions}
                onChange={(e) => setExercise({ ...exercise, instructions: e.target.value })}
            />
            <Textarea
                placeholder="Wzbogacenie"
                value={exercise.enrichment}
                onChange={(e) => setExercise({ ...exercise, enrichment: e.target.value })}
            />
            <Button type="submit">Dodaj ćwiczenie</Button>
        </form>
    )
}