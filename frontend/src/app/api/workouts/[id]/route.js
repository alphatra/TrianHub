import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { id } = params
  try {
    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            exercises: true,
          },
        },
      },
    })

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(workout)
  } catch (error) {
    console.error('Error fetching workout:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workout' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  const { id } = params
  try {
    const { title, sections } = await request.json()

    // Walidacja danych
    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      )
    }

    if (!Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json(
        { error: 'Sections must be a non-empty array' },
        { status: 400 }
      )
    }

    // Transakcja
    const updatedWorkout = await prisma.$transaction(async (tx) => {
      // Usuwanie istniejących sekcji (kaskadowe usuwanie usunie ćwiczenia)
      await tx.workoutSection.deleteMany({
        where: { workoutId: id },
      })

      // Aktualizacja treningu
      return await tx.workout.update({
        where: { id },
        data: {
          title,
          sections: {
            create: sections.map((section) => ({
              name: section.name,
              exercises: {
                create: section.exercises.map((exercise) => ({
                  name: exercise.name,
                  sets: exercise.sets,
                  quantity: exercise.quantity,
                  unit: exercise.unit,
                  duration: exercise.duration
                    ? parseInt(exercise.duration, 10)
                    : null,
                  rest: exercise.rest
                    ? parseInt(exercise.rest, 10)
                    : null,
                })),
              },
            })),
          },
        },
        include: {
          sections: {
            include: {
              exercises: true,
            },
          },
        },
      })
    })

    return NextResponse.json(updatedWorkout)
  } catch (error) {
    console.error('Error updating workout:', error)
    return NextResponse.json(
      { error: 'Failed to update workout' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  const { id } = params
  try {
    // Usuwanie treningu (kaskadowe usuwanie usunie powiązane dane)
    await prisma.workout.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Workout deleted successfully' })
  } catch (error) {
    console.error('Error deleting workout:', error)
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    )
  }
}
