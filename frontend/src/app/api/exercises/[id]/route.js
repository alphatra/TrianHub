// app/api/exercises/[id]/route.js

import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { id } = params
  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
    })

    if (!exercise) {
      return NextResponse.json(
        { error: 'Ćwiczenie nie zostało znalezione' },
        { status: 404 }
      )
    }

    return NextResponse.json(exercise)
  } catch (error) {
    console.error('Błąd podczas pobierania ćwiczenia:', error)
    return NextResponse.json(
      { error: 'Nie udało się pobrać ćwiczenia' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  const { id } = params
  try {
    const {
      name,
      set,
      difficulty,
      silaValue,
      mobilnoscValue,
      dynamikaValue,
      instructions,
      enrichment,
      videoUrl,
    } = await request.json()

    // Walidacja danych
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Nazwa jest wymagana i musi być tekstem' },
        { status: 400 }
      )
    }

    // Dodatkowa walidacja innych pól (jeśli potrzebna)

    const updatedExercise = await prisma.exercise.update({
      where: { id },
      data: {
        name,
        set,
        difficulty,
        silaValue,
        mobilnoscValue,
        dynamikaValue,
        instructions,
        enrichment,
        videoUrl,
      },
    })

    return NextResponse.json(updatedExercise)
  } catch (error) {
    console.error('Błąd podczas aktualizacji ćwiczenia:', error)
    return NextResponse.json(
      { error: 'Nie udało się zaktualizować ćwiczenia' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  const { id } = params
  try {
    await prisma.exercise.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Ćwiczenie zostało usunięte' })
  } catch (error) {
    console.error('Błąd podczas usuwania ćwiczenia:', error)
    return NextResponse.json(
      { error: 'Nie udało się usunąć ćwiczenia' },
      { status: 500 }
    )
  }
}
