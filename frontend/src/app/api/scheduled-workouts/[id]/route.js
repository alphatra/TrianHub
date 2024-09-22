import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(req, { params }) {
  try {
    const { id } = params
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

    const updatedWorkout = await prisma.scheduledWorkout.update({
      where: { id },
      data: {
        name,
        date: parsedDate,
        duration,
      },
    })
    return NextResponse.json(updatedWorkout)
  } catch (error) {
    console.error('Error in PUT:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params

    await prisma.scheduledWorkout.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Workout deleted' })
  } catch (error) {
    console.error('Error in DELETE:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
