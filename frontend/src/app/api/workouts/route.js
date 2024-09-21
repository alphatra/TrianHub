import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const workouts = await prisma.workout.findMany({
      include: {
        sections: {
          include: {
            exercises: true,
          },
        },
      },
    })
    return NextResponse.json(workouts)
  } catch (error) {
    console.error('Error fetching workouts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
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

    // Walidacja każdej sekcji i ćwiczenia
    for (const section of sections) {
      if (!section.name || typeof section.name !== 'string') {
        return NextResponse.json(
          { error: 'Each section must have a valid name' },
          { status: 400 }
        )
      }
      if (
        !Array.isArray(section.exercises) ||
        section.exercises.length === 0
      ) {
        return NextResponse.json(
          { error: 'Each section must have exercises' },
          { status: 400 }
        )
      }
      for (const exercise of section.exercises) {
        if (!exercise.name || typeof exercise.name !== 'string') {
          return NextResponse.json(
            { error: 'Each exercise must have a valid name' },
            { status: 400 }
          )
        }
        // Dodatkowa walidacja może być dodana tutaj
      }
    }

    // Tworzenie treningu
    const workout = await prisma.workout.create({
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

    return NextResponse.json(workout, { status: 201 })
  } catch (error) {
    console.error('Error creating workout:', error)
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    )
  }
}
