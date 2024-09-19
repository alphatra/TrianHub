import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { title, sections } = await req.json();

    // Create a workout entry with sections and exercises
    const workout = await prisma.workout.create({
      data: {
        title,
        sections: {
          create: sections.map(section => ({
            name: section.name,
            exercises: {
              create: section.exercises.map(exercise => ({
                name: exercise.name,
                sets: exercise.sets,
                quantity: exercise.quantity,
                unit: exercise.unit,
              })),
            },
          })),
        },
      },
      include: { sections: { include: { exercises: true } } },
    });

    return new Response(JSON.stringify(workout), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST /api/workouts:', error); // Enhanced error log
    return new Response(JSON.stringify({ error: error.message || 'Failed to create workout' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req) {
    const url = new URL(req.url);
    const workoutId = url.searchParams.get('id');
  
    try {
      if (workoutId) {
        // Pobierz szczegóły pojedynczego treningu
        const workout = await prisma.workout.findUnique({
          where: { id: workoutId },
          include: { sections: { include: { exercises: true } } },
        });
  
        if (!workout) {
          return new Response(JSON.stringify({ error: 'Workout not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }
  
        return new Response(JSON.stringify(workout), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // Pobierz wszystkie treningi
        const workouts = await prisma.workout.findMany({
          include: { sections: { include: { exercises: true } } },
        });
  
        return new Response(JSON.stringify(workouts), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (error) {
      console.error('Error in GET /api/workouts:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch workouts' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }