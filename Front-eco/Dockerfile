FROM node:18-alpine

# Instalar dependencias que expo necesita
RUN apk add --no-cache bash git python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Exponer los puertos que usa Expo
EXPOSE 8081

# Comando para arrancar expo
CMD ["npx", "expo", "start"]