import prisma from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const exercises = await prisma.exercise.findMany()
    return NextResponse.json(exercises)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 })
  }
}

export async function POST(request) {
    try {
        const data = await request.json()
        const exercise = await prisma.exercise.create({ data })
        return NextResponse.json(exercise, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create exercise' }, { status: 500 })
    }
}