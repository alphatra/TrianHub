"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function WorkoutListPage() {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchWorkouts();
    }
  }, [status, router]);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts');
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data);
      } else {
        console.error('Failed to fetch workouts');
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lista treningów</h1>
        <Link href="/dashboard/workouts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Utwórz nowy konspekt
          </Button>
        </Link>
      </div>
      {workouts.length === 0 ? (
        <p>Brak treningów. Utwórz swój pierwszy konspekt!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>{workout.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Utworzono: {new Date(workout.createdAt).toLocaleDateString()}</p>
                <Link href={`/dashboard/workouts/${workout.id}`}>
                  <Button className="mt-2">Otwórz</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}