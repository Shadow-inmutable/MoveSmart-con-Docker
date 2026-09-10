# ============================
# Etapa 1: Build de la app
# ============================
FROM node:22-alpine AS build

WORKDIR /app

# Copiar dependencias
COPY package*.json ./

RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación (asegúrate de tener el script "build" en package.json)
RUN npm run build

# ============================
# Etapa 2: Servidor Nginx
# ============================
FROM nginx:alpine

# Copiar los archivos generados por Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
