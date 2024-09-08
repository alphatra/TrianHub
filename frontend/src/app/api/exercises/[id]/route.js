import prisma from '../../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    const { id } = params
    try {
        const exercise = await prisma.exercise.findUnique({
            where: { id: String(id) },
        })
        if (exercise) {
            return NextResponse.json(exercise)
        } else {
            return NextResponse.json({ message: 'Exercise not found' }, { status: 404 })
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching exercise', error: error.message }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    const { id } = params
    try {
        const data = await request.json()
        const updatedExercise = await prisma.exercise.update({
            where: { id: String(id) },
            data,
        })
        return NextResponse.json(updatedExercise)
    } catch (error) {
        return NextResponse.json({ message: 'Error updating exercise', error: error.message }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    const { id } = params
    try {
        await prisma.exercise.delete({
            where: { id: String(id) },
        })
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting exercise', error: error.message }, { status: 500 })
    }
}