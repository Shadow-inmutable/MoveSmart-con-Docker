# ==================================================
#  Construcción de la aplicación Imagen base de Node.js
# ==================================================
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --omit=dev
# Copiar el código fuente
COPY . .
# Exponer el puerto de la aplicación
EXPOSE 4000
# Comando para iniciar la aplicación donde ejecute el archivo index.js
CMD ["node", "index.js"]

