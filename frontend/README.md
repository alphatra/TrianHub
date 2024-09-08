# Projekt Frontend

Ten projekt to aplikacja frontendowa stworzona przy użyciu Next.js, zintegrowana z Prisma ORM i skonfigurowana do uruchamiania w środowisku Docker.

## Wymagania wstępne

- [Node.js](https://nodejs.org/) (wersja 18 lub nowsza)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## Instalacja

1. Sklonuj repozytorium:
   ```
   git clone https://github.com/twoj-username/nazwa-repo.git
   cd nazwa-repo
   ```

2. Zainstaluj zależności:
   ```
   npm install
   ```

3. Skonfiguruj zmienne środowiskowe:
   - Skopiuj plik `.env.example` do `.env`:
     ```
     cp .env.example .env
     ```
   - Edytuj plik `.env` i ustaw odpowiednie wartości, szczególnie `DATABASE_URL`.

4. Wygeneruj Prisma Client:
   ```
   npx prisma generate
   ```

## Uruchamianie aplikacji

### Lokalnie

1. Uruchom serwer deweloperski:
   ```
   npm run dev
   ```

2. Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

### Używając Dockera

1. Zbuduj i uruchom kontenery:
   ```
   docker-compose up --build
   ```

2. Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000).

## Struktura projektu

- `/app` - Główny katalog aplikacji Next.js
- `/components` - Komponenty React
- `/lib` - Biblioteki i narzędzia pomocnicze
- `/prisma` - Schemat i migracje Prisma
- `/public` - Statyczne zasoby

## Migracje bazy danych

Aby utworzyć nową migrację:

```
npx prisma migrate dev --name nazwa_migracji
```

## Testy

Uruchom testy:

```
npm test
```

## Deployment

Instrukcje dotyczące wdrożenia projektu znajdziesz w pliku [DEPLOYMENT.md](DEPLOYMENT.md).

## Współpraca

Jeśli chcesz przyczynić się do rozwoju projektu, zapoznaj się z [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencja

Ten projekt jest licencjonowany na podstawie [MIT License](LICENSE).
