# FROM node:24-alpine AS build

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# FROM nginx:1.27-alpine

# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /app/dist /usr/share/nginx/html

# EXPOSE 8080

# Etape 1 : compilation du projet
FROM node:24-alpine as builder
# paramétrage du dossier courant pour le build
WORKDIR /app
COPY . .
# suppression du contenu de nodes_modules
RUN rm -rf node_modules
# npm ci similaire à npm install (mais environnement automatisé) -> installation de tous les packages nécessaires au build
RUN npm ci
RUN npm run build

# Etape 2 : utilisation d'une image de serveur http pour servir le site précompilé
FROM nginx:1.27-alpine
EXPOSE 8080
COPY --chown=nginx:nginx nginx-ui.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx --from=builder /app/dist /var/www/html/
