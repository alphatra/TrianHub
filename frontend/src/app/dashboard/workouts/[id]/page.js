"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";

export default function AsystentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false); // Obsługa przerw
  const [timer, setTimer] = useState(0); // Sekundy dla aktualnego ćwiczenia/przerwy
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Pobranie treningu z API
  useEffect(() => {
    if (id) {
      fetch(`/api/workouts?id=${id}`)
        .then(response => response.json())
        .then(data => {
          setWorkout(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching workout:', error);
          setLoading(false);
        });
    }
  }, [id]);

  // Start Timera
  const startTimer = () => {
    if (!isRunning && !isExerciseBasedOnReps()) { // Uruchom tylko jeśli ćwiczenie jest oparte na czasie
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
  };

  // Stop Timera
  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  // Reset Timera
  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setTimer(getCurrentTime());
  };

  // Funkcja, która zwraca czas bieżącego ćwiczenia lub przerwy
  const getCurrentTime = () => {
    const currentExercise = getCurrentExercise();
    return isResting ? currentExercise.rest || 30 : currentExercise.duration || 30;
  };

  // Aktualne ćwiczenie z listy
  const getCurrentExercise = () => {
    const allExercises = workout.sections.flatMap(section => section.exercises);
    return allExercises[currentExerciseIndex];
  };

  // Ustal czas ćwiczenia i rozpocznij odliczanie
  useEffect(() => {
    if (!workout) return;
    setTimer(getCurrentTime());

    if (isRunning && !isExerciseBasedOnReps()) { // Tylko uruchom timer, jeśli ćwiczenie jest oparte na czasie
      startTimer();
    }

    // Stop Timer przy zmianie ćwiczenia
    return () => stopTimer();
  }, [currentExerciseIndex, isResting, workout]);

  // Obsługa zakończenia ćwiczenia/przerwy
  useEffect(() => {
    if (timer <= 0 && isRunning) {
      stopTimer();
      if (isResting) {
        // Koniec przerwy -> przejście do kolejnego ćwiczenia
        setIsResting(false);
        if (currentExerciseIndex < workout.sections.flatMap(section => section.exercises).length - 1) {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
        } else {
          // Koniec treningu
          console.log('Trening zakończony!');
        }
      } else {
        // Koniec ćwiczenia -> ustawienie przerwy
        setIsResting(true);
        setTimer(getCurrentExercise().rest || 30);
      }
    }
  }, [timer, isRunning, isResting]);

  // Sprawdzenie, czy aktualne ćwiczenie jest oparte na powtórzeniach
  const isExerciseBasedOnReps = () => {
    const currentExercise = getCurrentExercise();
    return currentExercise.type === 'reps';
  };

  // Formatowanie czasu
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Przechodzenie do następnego ćwiczenia
  const nextExercise = () => {
    if (currentExerciseIndex < workout.sections.flatMap(section => section.exercises).length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setIsResting(false);
      resetTimer();
    }
  };

  // Przechodzenie do poprzedniego ćwiczenia
  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setIsResting(false);
      resetTimer();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!workout) {
    return <div>Workout not found</div>;
  }

  const currentExercise = getCurrentExercise();

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <div className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{workout.title}</h1>
        </div>
        <p className="text-xl">
          {isResting ? 'Przerwa' : `Ćwiczenie: ${currentExercise.name}`} {isExerciseBasedOnReps() ? `(${currentExercise.quantity} powtórzeń)` : ''}
        </p>
        
        {/* Timer i kontrolki */}
        <div className="flex space-x-4 items-center">
          <Button variant="outline" size="lg" onClick={isRunning ? stopTimer : startTimer}>
            {isRunning ? <PauseIcon className="mr-2 h-4 w-4" /> : <PlayIcon className="mr-2 h-4 w-4" />}
            {isRunning ? 'STOP' : 'START'}
          </Button>
          {!isExerciseBasedOnReps() && <div className="text-6xl font-bold">{formatTime(timer)}</div>}
          <Button variant="outline" size="lg" onClick={prevExercise}>
            Poprzednie
          </Button>
          <Button variant="outline" size="lg" onClick={nextExercise}>
            Następne
          </Button>
        </div>
        
        {/* Lista ćwiczeń */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Lista ćwiczeń</h3>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th>Ćwiczenie</th>
                <th>Serie</th>
                <th>Ilość</th>
                <th>Czas</th>
                <th>Przerwa</th>
              </tr>
            </thead>
            <tbody>
              {workout.sections.flatMap(section =>
                section.exercises.map((exercise, index) => (
                  <tr key={exercise.id} className={`${currentExerciseIndex === index ? 'text-blue-500 font-bold' : ''}`}>
                    <td>{exercise.name}</td>
                    <td>{exercise.sets}</td>
                    <td>{exercise.quantity} {exercise.unit}</td>
                    <td>{exercise.duration ? `${exercise.duration} s` : 'N/A'}</td>
                    <td>{exercise.rest ? `${exercise.rest} s` : 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
