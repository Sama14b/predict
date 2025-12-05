# Dockerfile para el Microservicio PREDICT

# Imagen base ligera
FROM node:22-slim

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiamos manifiestos
COPY package*.json ./

# Instalamos dependencias de producción (incluyendo @tensorflow/tfjs-node y mongoose)
RUN npm ci --omit=dev

# Copiamos el resto del código (incluye server.js y la carpeta 'model')
COPY . .

# El servicio predict escucha en 3003 (asumiendo su mapeo)
EXPOSE 3003

# Comando de arranque
CMD ["node", "server.js"]