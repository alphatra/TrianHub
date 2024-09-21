# Użyj obrazu Node.js opartego na Debianie Bookworm
FROM node:18

# Ustaw katalog roboczy
WORKDIR /usr/src/app

# Zainstaluj Pythona i narzędzia
RUN apt-get update && apt-get install -y \
    python3 \
    python3-venv

# Utwórz wirtualne środowisko
RUN python3 -m venv /opt/venv

# Aktywuj wirtualne środowisko
ENV PATH="/opt/venv/bin:$PATH"

# Zweryfikuj wersję Pythona
RUN python --version

# Zaktualizuj pip do najnowszej wersji
RUN pip install --upgrade pip

# Zainstaluj PyTorch w wirtualnym środowisku
RUN pip install torch==2.0.1+cpu torchvision==0.15.2+cpu torchaudio==2.0.2+cpu --index-url https://download.pytorch.org/whl/cpu

# Kopiuj pliki package.json i package-lock.json
COPY package*.json ./

# Zainstaluj zależności Node.js
RUN npm ci

# Kopiuj resztę kodu źródłowego
COPY . .

# Kopiuj requirements.txt
COPY ./requirements.txt ./requirements.txt

# Zainstaluj pozostałe zależności Pythona w wirtualnym środowisku
RUN pip install --no-cache-dir -r ./requirements.txt

# Wygeneruj Prisma Client
RUN npx prisma generate

# Eksponuj port 3000
EXPOSE 3000

# Uruchom aplikację
CMD ["npm", "run", "dev"]