FROM node:22-alpine AS build

WORKDIR /app

# Dependencias
COPY package*.json ./

RUN npm ci

# Código fuente
COPY . .

# Construcción de React/Vite
RUN npm run build


# ==========================================
# SERVIDOR WEB
# ==========================================

FROM nginx:alpine

# Archivos generados por Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]