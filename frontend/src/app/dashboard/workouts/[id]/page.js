'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, ChevronRight, Check } from 'lucide-react'
import useSound from 'use-sound'
import { Noto_Sans } from 'next/font/google'
import { useParams } from 'next/navigation'

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
})

async function fetchWorkoutData(id) {
    try {
      const response = await fetch(`/api/workouts/${id}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching workout data:', error)
      throw error
    }
  }

export default function WorkoutTimer() {
  const [isRepsExercise, setIsRepsExercise] = useState(false)
  const [workoutData, setWorkoutData] = useState(null)
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [activityTimeRemaining, setActivityTimeRemaining] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [completedWorkout, setCompletedWorkout] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentSet, setCurrentSet] = useState(1)

  const [playShortBeep] = useSound('/sounds/beep-07a.mp3')
  const [playLongBeep] = useSound('/sounds/beep-09.mp3')

  const params = useParams()
  const workoutId = params.id

  useEffect(() => {
    async function loadWorkoutData() {
      if (workoutId) {
        try {
          setIsLoading(true)
          setError(null)
          const data = await fetchWorkoutData(workoutId)
          if (data) {
            setWorkoutData(data)
            const allActivities = flattenActivities(data)
            setActivityTimeRemaining(allActivities[0]?.duration || 0)
            setIsRepsExercise(allActivities[0]?.unit === 'reps')
            setCurrentSet(allActivities[0]?.currentSet || 1)
          }
        } catch (err) {
          console.error('Error in loadWorkoutData:', err)
          setError('Nie udało się załadować danych treningu. Spróbuj ponownie.')
        } finally {
          setIsLoading(false)
        }
      } else {
        setError('Brak identyfikatora treningu. Sprawdź adres URL.')
        setIsLoading(false)
      }
    }
    loadWorkoutData()
  }, [workoutId])

  function flattenActivities(data) {
    return data.sections.flatMap((section) =>
      section.exercises.flatMap((exercise) => {
        const sets = parseInt(exercise.sets) || 1
        return Array(sets)
          .fill()
          .flatMap((_, setIndex) => [
            {
              ...exercise,
              type: 'exercise',
              sectionName: section.name,
              currentSet: setIndex + 1,
              totalSets: sets,
            },
            ...(exercise.rest
              ? [
                  {
                    id: `rest-${exercise.id}-${setIndex}`,
                    name: 'Odpoczynek',
                    duration: parseInt(exercise.rest),
                    type: 'rest',
                    sectionName: section.name,
                    unit: 'time',
                    currentSet: setIndex + 1,
                    totalSets: sets,
                  },
                ]
              : []),
          ])
      })
    )
  }

  const allActivities = workoutData ? flattenActivities(workoutData) : []
  const currentActivity = allActivities[currentActivityIndex]
  const nextActivity = allActivities[currentActivityIndex + 1]

  const totalDuration = allActivities.reduce(
    (acc, activity) => acc + (activity.duration || 0),
    0
  )

  useEffect(() => {
    let wakeLock = null
    let timerId

    if (isRunning) {
      timerId = setInterval(() => {
        if (
          currentActivity &&
          currentActivity.unit === 'time' &&
          activityTimeRemaining > 0
        ) {
          setActivityTimeRemaining((prev) => prev - 1)
          setTimeElapsed((prev) => prev + 1)

          if (activityTimeRemaining <= 4 && activityTimeRemaining > 1) {
            playShortBeep()
          } else if (activityTimeRemaining === 1) {
            playLongBeep()
          }
        } else if (
          currentActivity &&
          currentActivity.unit === 'time' &&
          activityTimeRemaining === 0
        ) {
          if (currentActivityIndex < allActivities.length - 1) {
            const nextIndex = currentActivityIndex + 1
            setCurrentActivityIndex(nextIndex)
            const nextActivity = allActivities[nextIndex]
            setActivityTimeRemaining(nextActivity.duration || 0)
            setIsRepsExercise(nextActivity.unit === 'reps')
            setCurrentSet(nextActivity.currentSet)
          } else {
            setIsRunning(false)
            setCompletedWorkout(true)
          }
        }
      }, 1000)

      if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen').then((wl) => {
          wakeLock = wl
        })
      }
    }

    return () => {
      clearInterval(timerId)
      if (wakeLock) {
        wakeLock.release()
      }
    }
  }, [
    isRunning,
    activityTimeRemaining,
    currentActivityIndex,
    allActivities,
    currentActivity,
    playShortBeep,
    playLongBeep,
  ])

  const handleStart = () => {
    setCompletedWorkout(false)
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setCurrentActivityIndex(0)
    setActivityTimeRemaining(allActivities[0]?.duration || 0)
    setTimeElapsed(0)
    setCompletedWorkout(false)
    setIsRepsExercise(allActivities[0]?.unit === 'reps')
    setCurrentSet(allActivities[0]?.currentSet || 1)
  }

  const handleSetCurrentActivity = (index) => {
    setCurrentActivityIndex(index)
    setActivityTimeRemaining(allActivities[index].duration || 0)
    const elapsed = allActivities
      .slice(0, index)
      .reduce((acc, activity) => acc + (activity.duration || 0), 0)
    setTimeElapsed(elapsed)
    setCompletedWorkout(false)
    setIsRepsExercise(allActivities[index].unit === 'reps')
    setCurrentSet(allActivities[index].currentSet)
  }

  const handleCompleteReps = () => {
    if (currentActivityIndex < allActivities.length - 1) {
      const nextIndex = currentActivityIndex + 1
      setCurrentActivityIndex(nextIndex)
      const nextActivity = allActivities[nextIndex]
      setActivityTimeRemaining(nextActivity.duration || 0)
      setIsRepsExercise(nextActivity.unit === 'reps')
      setCurrentSet(nextActivity.currentSet)
    } else {
      setIsRunning(false)
      setCompletedWorkout(true)
    }
  }

  if (isLoading) {
    return <div className="text-center">Ładowanie danych treningu...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!workoutData) {
    return <div className="text-center">Brak danych treningu.</div>
  }

  return (
    <div
      className={`${notoSans.className} min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 text-white p-8`}
    >
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">{workoutData.title}</h1>
          <p className="text-xl text-purple-200">Przygotuj się do treningu!</p>
        </header>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <ActivityDisplay
            currentActivity={currentActivity}
            nextActivity={nextActivity}
            completedWorkout={completedWorkout}
            isRepsExercise={isRepsExercise}
          />
          {!isRepsExercise ? (
            <>
              <TimerDisplay timeSeconds={activityTimeRemaining} />
              <ProgressBar
                timeRemaining={activityTimeRemaining}
                totalDuration={currentActivity?.duration || 0}
              />
            </>
          ) : (
            <RepsDisplay reps={currentActivity?.quantity} />
          )}
          <SetDisplay
            currentSet={currentSet}
            totalSets={currentActivity?.totalSets}
          />
          <GlobalProgress
            timeElapsed={timeElapsed}
            totalDuration={totalDuration}
          />
          <Controls
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onCompleteReps={handleCompleteReps}
            isRunning={isRunning}
            isRepsExercise={isRepsExercise}
          />
        </div>

        <WorkoutSetTable
          activities={allActivities}
          currentActivityIndex={currentActivityIndex}
          onSetCurrentActivity={handleSetCurrentActivity}
        />
      </div>
    </div>
  )
}

function ActivityDisplay({
  currentActivity,
  nextActivity,
  completedWorkout,
  isRepsExercise,
}) {
  return (
    <div className="text-center mb-8">
      <AnimatePresence mode="wait">
        <motion.h2
          key={`${currentActivity?.id}-${currentActivity?.currentSet}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`text-5xl font-bold mb-4 ${
            currentActivity?.type === 'exercise'
              ? 'text-yellow-300'
              : 'text-green-300'
          }`}
        >
          {completedWorkout ? 'Trening zakończony! 🎉' : currentActivity?.name}
        </motion.h2>
      </AnimatePresence>
      {!completedWorkout && (
        <p className="text-2xl text-purple-200">
          {isRepsExercise
            ? `${currentActivity?.quantity} powtórzeń`
            : `${currentActivity?.duration} sekund`}
        </p>
      )}
      {!completedWorkout && nextActivity && (
        <p className="text-2xl text-purple-200 mt-2">
          Następnie: {nextActivity.name}
          <ChevronRight className="inline" />
        </p>
      )}
    </div>
  )
}

function RepsDisplay({ reps }) {
  return (
    <div className="text-8xl font-bold text-center mb-8">
      {reps}
      <span className="text-4xl ml-2">powt.</span>
    </div>
  )
}

function TimerDisplay({ timeSeconds }) {
  const minutes = String(Math.floor(timeSeconds / 60)).padStart(2, '0')
  const seconds = String(timeSeconds % 60).padStart(2, '0')

  return (
    <div className="text-8xl font-bold text-center mb-8">
      {minutes}:{seconds}
    </div>
  )
}

function SetDisplay({ currentSet, totalSets }) {
  return (
    <div className="text-2xl font-bold text-center mb-4">
      Seria {currentSet} z {totalSets}
    </div>
  )
}

function ProgressBar({ timeRemaining, totalDuration }) {
  const progress =
    ((totalDuration - timeRemaining) / totalDuration) * 100 || 0

  return (
    <div className="w-full h-4 bg-white/20 rounded-full mb-8 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-green-400 to-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}

function GlobalProgress({ timeElapsed, totalDuration }) {
  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0')
    const seconds = String(time % 60).padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between text-lg mb-2">
        <span>{formatTime(timeElapsed)}</span>
        <span>{formatTime(totalDuration)}</span>
      </div>
      <ProgressBar
        timeRemaining={totalDuration - timeElapsed}
        totalDuration={totalDuration}
      />
    </div>
  )
}

function Controls({
  onStart,
  onPause,
  onReset,
  onCompleteReps,
  isRunning,
  isRepsExercise,
}) {
  return (
    <div className="flex justify-center space-x-6">
      {isRepsExercise ? (
        <button
          onClick={onCompleteReps}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full transition duration-300 flex items-center"
        >
          <Check className="mr-2" />
          Zakończ
        </button>
      ) : (
        <button
          onClick={isRunning ? onPause : onStart}
          className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-full transition duration-300 flex items-center"
        >
          {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
          {isRunning ? 'Pauza' : 'Start'}
        </button>
      )}
      <button
        onClick={onReset}
        className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-full transition duration-300 flex items-center"
      >
        <RotateCcw className="mr-2" />
        Resetuj
      </button>
    </div>
  )
}

function WorkoutSetTable({
  activities,
  currentActivityIndex,
  onSetCurrentActivity,
}) {
  const totalDuration = activities.reduce(
    (acc, activity) => acc + (activity.duration || 0),
    0
  )
  const totalDurationMinutes = Math.floor(totalDuration / 60)
  const totalDurationSeconds = totalDuration % 60

  return (
    <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
      <h3 className="text-2xl font-bold mb-4">Plan treningu</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="py-2 px-4 text-left">Sekcja</th>
              <th className="py-2 px-4 text-left">Aktywność</th>
              <th className="py-2 px-4 text-right">Seria</th>
              <th className="py-2 px-4 text-right">Czas/Powt.</th>
              <th className="py-2 px-4 text-right">Typ</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr
                key={`${activity.id}-${activity.currentSet}`}
                className={`border-b border-white/10 cursor-pointer transition duration-300 ${
                  index === currentActivityIndex
                    ? 'bg-white/20'
                    : 'hover:bg-white/5'
                }`}
                onClick={() => onSetCurrentActivity(index)}
              >
                <td className="py-2 px-4">{activity.sectionName}</td>
                <td className="py-2 px-4">{activity.name}</td>
                <td className="py-2 px-4 text-right">
                  {activity.currentSet}/{activity.totalSets}
                </td>
                <td className="py-2 px-4 text-right">
                  {activity.unit === 'reps'
                    ? `${activity.quantity} powt.`
                    : activity.unit === 'time'
                    ? `${activity.duration}s`
                    : '-'}
                </td>
                <td className="py-2 px-4 text-right">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                      activity.type === 'exercise'
                        ? 'bg-yellow-500 text-yellow-900'
                        : 'bg-green-500 text-green-900'
                    }`}
                  >
                    {activity.type === 'exercise' ? 'Ćwiczenie' : 'Odpoczynek'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-right text-sm">
        Łączny czas: {totalDurationMinutes} min {totalDurationSeconds} sek
      </p>
    </div>
  )
}
