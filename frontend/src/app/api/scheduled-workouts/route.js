import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const scheduledWorkouts = await prisma.scheduledWorkout.findMany()
    return NextResponse.json(scheduledWorkouts)
  } catch (error) {
    console.error('Error in GET:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const { name, date, duration } = await req.json()

    // Walidacja danych
    if (!name || !date || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    const scheduledWorkout = await prisma.scheduledWorkout.create({
      data: {
        name,
        date: parsedDate,
        duration,
      },
    })
    return NextResponse.json(scheduledWorkout, { status: 201 })
  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
