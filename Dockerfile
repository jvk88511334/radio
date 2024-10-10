# Utilisez une image Node.js comme image de base
FROM node:18.15.0-alpine as build

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json
COPY package*.json ./

# Installez les dépendances du projet
RUN npm ci

# Copiez le code source de l'application
COPY . .

# Construisez l'application Vite + React
RUN npm run build

# Utilisez une image Nginx pour servir l'application
FROM nginx:1.21.0-alpine

# Copiez les fichiers construits de l'étape précédente
# Note : le chemin est modifié de 'build' à 'dist' car Vite utilise 'dist' par défaut
COPY --from=build /app/dist /usr/share/nginx/html

# Copiez un fichier de configuration Nginx personnalisé
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposez le port 8080 pour accéder à l'application
EXPOSE 8080

# Démarrez Nginx lorsque le conteneur est lancé
CMD ["nginx", "-g", "daemon off;"]