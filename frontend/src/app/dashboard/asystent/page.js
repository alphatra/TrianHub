import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PauseIcon, PlayIcon, HeartPulse } from "lucide-react";

export default function AsystentPage() {
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      
      {/* Main content */}
      <div className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cyfrowy Asystent Treningowy</h1>
          <div className="bg-blue-500 text-white text-4xl font-bold p-4 rounded-lg">03</div>
        </div>
        <p className="text-xl">Taekwondo ITF - Workout 1</p>
        
        {/* Timer and controls */}
        <div className="flex space-x-4 items-center">
          <Button variant="outline" size="lg">
            <PauseIcon className="mr-2 h-4 w-4" /> STOP
          </Button>
          <div className="text-6xl font-bold">00:15:16</div>
        </div>
        
        {/* Circular progress and exercise list */}
        <div className="flex space-x-6">
          <div className="relative w-64 h-64">
            <Progress value={66} className="w-64 h-64" />
            <div className="absolute inset-0 flex items-center justify-center">
              <HeartPulse className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Lista ćwiczeń</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th>Ćwiczenie</th>
                  <th>Czas</th>
                  <th>Poziom</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1. Pompki</td>
                  <td>3 min</td>
                  <td>Średnie</td>
                  <td>Szczegóły</td>
                </tr>
                <tr>
                  <td>2. Pajacyki</td>
                  <td>3 min</td>
                  <td>Średnie</td>
                  <td>Szczegóły</td>
                </tr>
                <tr>
                  <td>3. Deska</td>
                  <td>3 min</td>
                  <td>Średnie</td>
                  <td>Szczegóły</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Additional info panels */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Ćwiczenia</h3>
            <ul className="space-y-2">
              <li className="font-bold text-blue-500">1. Pompki <span className="float-right">3 min</span></li>
              <li>2. Pajacyki <span className="float-right">3 min</span></li>
              <li>3. Deska <span className="float-right">3 min</span></li>
            </ul>
            <div className="mt-4 text-4xl font-bold">00:24</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Intensywność ćwiczeń</h3>
            <div className="h-32 flex items-end space-x-2">
              <div className="bg-blue-500 w-1/3 h-full rounded-t"></div>
              <div className="bg-blue-500 w-1/3 h-3/4 rounded-t"></div>
              <div className="bg-blue-500 w-1/3 h-1/2 rounded-t"></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>Pompki</span>
              <span>Pajacyki</span>
              <span>Deska</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Założenia treningowe</h3>
            <ul className="space-y-2 text-sm">
              <li>• Zwiększenie wytrzymałości</li>
              <li>• Poprawa techniki</li>
              <li>• Spalenie 300 kcal</li>
              <li>• Utrzymanie tętna 120-140 bpm</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

