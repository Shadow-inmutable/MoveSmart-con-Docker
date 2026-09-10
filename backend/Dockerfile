# Imagen base ligera
FROM node:22-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias (solo producción)
RUN npm ci --omit=dev

# Copiar código fuente
COPY . .

# Variables de entorno (opcional, si usas .env)
ENV NODE_ENV=production

# Exponer puerto
EXPOSE 4000

# Comando de inicio
CMD ["node", "index.js"]
