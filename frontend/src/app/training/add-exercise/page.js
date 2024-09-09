"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddExercisePage() {
    const [newExercise, setNewExercise] = useState({ name: '', set: '', difficulty: '', silaValue: 0, mobilnoscValue: 0, dynamikaValue: 0, instructions: '', enrichment: '', videoUrl: '' });
    const router = useRouter();

    const handleAddExercise = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/exercises', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExercise),
            });

            if (res.ok) {
                router.push('/training');
            } else {
                console.error('Błąd podczas dodawania ćwiczenia');
            }
        } catch (error) {
            console.error('Błąd podczas dodawania ćwiczenia:', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Dodaj Nowe Ćwiczenie</h1>
            <form onSubmit={handleAddExercise} className="space-y-4">
                <Input 
                    placeholder="Nazwa Ćwiczenia" 
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                />
                <Input 
                    placeholder="Zestaw" 
                    value={newExercise.set}
                    onChange={(e) => setNewExercise({ ...newExercise, set: e.target.value })}
                />
                <Input 
                    placeholder="Poziom Trudności" 
                    value={newExercise.difficulty}
                    onChange={(e) => setNewExercise({ ...newExercise, difficulty: e.target.value })}
                />
                <Input 
                    placeholder="Siła" 
                    type="number"
                    value={newExercise.silaValue}
                    onChange={(e) => setNewExercise({ ...newExercise, silaValue: parseInt(e.target.value) })}
                />
                <Input 
                    placeholder="Mobilność" 
                    type="number"
                    value={newExercise.mobilnoscValue}
                    onChange={(e) => setNewExercise({ ...newExercise, mobilnoscValue: parseInt(e.target.value) })}
                />
                <Input 
                    placeholder="Dynamika" 
                    type="number"
                    value={newExercise.dynamikaValue}
                    onChange={(e) => setNewExercise({ ...newExercise, dynamikaValue: parseInt(e.target.value) })}
                />
                <Input 
                    placeholder="Instrukcje" 
                    value={newExercise.instructions}
                    onChange={(e) => setNewExercise({ ...newExercise, instructions: e.target.value })}
                />
                <Input 
                    placeholder="Wzbogacenia" 
                    value={newExercise.enrichment}
                    onChange={(e) => setNewExercise({ ...newExercise, enrichment: e.target.value })}
                />
                <Input 
                    placeholder="Link do Wideo" 
                    value={newExercise.videoUrl}
                    onChange={(e) => setNewExercise({ ...newExercise, videoUrl: e.target.value })}
                />
                <Button type="submit">Dodaj Ćwiczenie</Button>
            </form>
        </div>
    );
}