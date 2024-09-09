"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutDashboard, Dumbbell, Brain, Calendar, Search, Loader2 } from "lucide-react";
import { ExerciseDetails } from "@/components/ExerciseDetails";

export default function TrainingPage() {
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isAddingExercise, setIsAddingExercise] = useState(false);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Fetch exercises from API
        const fetchExercises = async () => {
            try {
                const res = await fetch('/api/exercises');
                if (!res.ok) {
                    throw new Error('Failed to fetch exercises');
                }
                const data = await res.json();
                setExercises(data);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            }
        };
        fetchExercises();
    }, []);


    const filteredExercises = exercises.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addExercise = async (exercise) => {
        const res = await fetch('/api/exercises', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(exercise),
        });
        const newExercise = await res.json();
        setExercises([...exercises, newExercise]);
        setIsAddingExercise(false);
    };

    const viewExercise = (exercise) => {
        setSelectedExercise(exercise);
    };

    const backToList = () => {
        setSelectedExercise(null);
    };

    return (
                <Card className="p-6">
                    {selectedExercise ? (
                        <ExerciseDetails
                            exercise={selectedExercise}
                            onBack={() => setSelectedExercise(null)}
                        />
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold mb-6 flex items-center space-x-4">
                            <span>Trening</span>
                            <Button variant="outline" onClick={() => router.push('/training/add-exercise')}>+</Button>
                            </h1>
                            <div className="flex items-center mb-6 space-x-4">
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
                                <Button variant="outline">Zaawansowane</Button>
                                <Button variant="outline">Średni</Button>
                                <Button variant="outline">Początkujące</Button>
                            </div>
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
                                            <TableCell className="font-medium">{exercise.name}</TableCell>
                                            <TableCell>{exercise.set}</TableCell>
                                            <TableCell>{exercise.difficulty}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" onClick={() => viewExercise(exercise)}>
                                                    Szczegóły
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>
                    )}
                </Card>
    );
}