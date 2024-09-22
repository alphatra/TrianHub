import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
  return new Promise(async (resolve, reject) => {
    try {
      const { prompt } = await request.json();

      if (!prompt || prompt.trim() === '') {
        resolve(NextResponse.json({ error: 'Prompt jest wymagany' }, { status: 400 }));
        return;
      }

      const scriptPath = path.join(process.cwd(), 'src', 'scripts', 'generate_exercises.py');
      console.log('Ścieżka do skryptu Pythona:', scriptPath);

      const pythonProcess = spawn('python3', [scriptPath, prompt]);

      let data = '';
      let error = '';

      pythonProcess.stdout.on('data', (chunk) => {
        data += chunk.toString();
      });

      pythonProcess.stderr.on('data', (chunk) => {
        error += chunk.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Błąd w skrypcie Pythona:', error);
          resolve(NextResponse.json({ error: 'Błąd podczas generowania ćwiczeń' }, { status: 500 }));
          return;
        }

        try {
          const workoutPlan = JSON.parse(data);

          if (workoutPlan.error) {
            resolve(NextResponse.json({ error: workoutPlan.error }, { status: 500 }));
            return;
          }

          resolve(NextResponse.json(workoutPlan));
        } catch (parseError) {
          console.error('Błąd parsowania danych z Pythona:', parseError);
          resolve(NextResponse.json({ error: 'Nie udało się przetworzyć odpowiedzi AI' }, { status: 500 }));
        }
      });

      pythonProcess.on('error', (err) => {
        console.error('Błąd podczas uruchamiania Pythona:', err);
        resolve(NextResponse.json({ error: 'Błąd podczas uruchamiania Pythona' }, { status: 500 }));
      });

    } catch (error) {
      console.error('Błąd podczas generowania ćwiczeń:', error);
      resolve(NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 }));
    }
  });
}