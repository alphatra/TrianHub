// app/api/exercises/route.js

import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const exercises = await prisma.exercise.findMany()
    return NextResponse.json(exercises)
  } catch (error) {
    console.error('Błąd podczas pobierania ćwiczeń:', error)
    return NextResponse.json(
      { error: 'Nie udało się pobrać ćwiczeń' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
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

    const exercise = await prisma.exercise.create({
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

    return NextResponse.json(exercise, { status: 201 })
  } catch (error) {
    console.error('Błąd podczas tworzenia ćwiczenia:', error)
    return NextResponse.json(
      { error: 'Nie udało się utworzyć ćwiczenia' },
      { status: 500 }
    )
  }
}
