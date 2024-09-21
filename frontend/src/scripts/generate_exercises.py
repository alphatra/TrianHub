import sys
import json
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer

def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Prompt jest wymagany'}))
        sys.exit(1)

    prompt = sys.argv[1]
    model_name = "distilgpt2"

    try:
        tokenizer = GPT2Tokenizer.from_pretrained(model_name)
        model = GPT2LMHeadModel.from_pretrained(model_name)
        
        # Set pad_token_id to eos_token_id
        model.config.pad_token_id = model.config.eos_token_id
        tokenizer.pad_token = tokenizer.eos_token
    except Exception as e:
        print(json.dumps({'error': f'Failed to load model: {str(e)}'}))
        sys.exit(1)

    # Przygotowanie promptu
    ai_prompt = f'''
    Jesteś doświadczonym trenerem fitness. Na podstawie poniższego opisu wygeneruj plan treningowy:
    "{prompt}"
    Przedstaw plan treningowy w następującym formacie JSON:
    {{
      "title": "Tytuł Treningu",
      "sections": [
        {{
          "name": "Nazwa Sekcji",
          "exercises": [
            {{
              "name": "Nazwa Ćwiczenia",
              "sets": "Liczba serii",
              "quantity": "Liczba powtórzeń lub czas",
              "unit": "reps lub time",
              "duration": czas w sekundach (jeśli unit to time),
              "rest": czas przerwy w sekundach
            }}
          ]
        }}
      ]
    }}
    '''

    # Kodowanie promptu
    inputs = tokenizer(ai_prompt, return_tensors='pt', padding=True, truncation=True)

    try:
        # Generowanie tekstu
        with torch.no_grad():
            output = model.generate(
                **inputs,
                max_length=1024,
                num_return_sequences=1,
                no_repeat_ngram_size=2,
                early_stopping=True
            )

        # Dekodowanie wygenerowanego tekstu
        generated_text = tokenizer.decode(output[0], skip_special_tokens=True)

        # Wyodrębnienie części JSON z wygenerowanego tekstu
        start_index = generated_text.find('{')
        end_index = generated_text.rfind('}') + 1
        if start_index == -1 or end_index == 0:
            raise ValueError("No JSON object found in generated text")
        json_text = generated_text[start_index:end_index]
        workout_plan = json.loads(json_text)
        print(json.dumps(workout_plan))
    except Exception as e:
        # Jeśli nie uda się wygenerować lub sparsować JSON-a, zwróć błąd
        print(json.dumps({'error': f'Nie udało się przetworzyć odpowiedzi AI: {str(e)}'}))
        sys.exit(1)

if __name__ == '__main__':
    main()