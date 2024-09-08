FROM node:18-alpine

WORKDIR /usr/src/app

# Kopiuj pliki package.json i package-lock.json (jeśli istnieje)
COPY package*.json ./

# Zainstaluj zależności
RUN npm ci

# Kopiuj resztę kodu źródłowego
COPY . .

# Generuj Prisma Client
RUN npx prisma generate

# Eksponuj port 3000
EXPOSE 3000

# Uruchom aplikację w trybie deweloperskim
CMD ["npm", "run", "dev"]