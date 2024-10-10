Voici les étapes à suivre pour configurer une GitHub Action afin de déployer votre application React sur Docker Hub, ainsi que pour créer le Dockerfile nécessaire :

1. Placez le Dockerfile suivant à la racine de votre projet sur IntelliJ IDEA :

```dockerfile
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

# Construisez l'application React
RUN npm run build

# Utilisez une image Nginx pour servir l'application
FROM nginx:1.21.0-alpine

# Copiez les fichiers construits de l'étape précédente
COPY --from=build /app/build /usr/share/nginx/html

# Exposez le port 80 pour accéder à l'application
EXPOSE 80

# Démarrez Nginx lorsque le conteneur est lancé
CMD ["nginx", "-g", "daemon off;"]
```

2. Dans votre dépôt GitHub, allez dans "Settings" > "Secrets" et créez deux secrets :
    - `DOCKERHUB_USERNAME`: votre nom d'utilisateur Docker Hub (jeromev34 dans la capture d'écran)
    - `DOCKERHUB_TOKEN`: votre jeton d'accès Docker Hub

---

vous devez créer les secrets DOCKERHUB_USERNAME et DOCKERHUB_TOKEN dans la section "Repository secrets" de votre dépôt GitHub.
Voici les étapes à suivre :

Cliquez sur le bouton "New repository secret" dans la section "Repository secrets".
Sur la page suivante, vous verrez des champs pour entrer le nom et la valeur du secret.
Pour le premier secret, entrez DOCKERHUB_USERNAME dans le champ "Name" et votre nom d'utilisateur Docker Hub (jeromev34 dans votre cas) dans le champ "Value".
Cliquez sur "Add secret" pour enregistrer le secret DOCKERHUB_USERNAME.
Répétez les étapes 1 à 4 pour créer le deuxième secret :

Nom du secret : DOCKERHUB_TOKEN
Valeur du secret : votre jeton d'accès personnel Docker Hub

---

e jeton d'accès Docker Hub ne se trouve pas dans votre compte GitHub. Vous devez le générer directement sur le site de Docker Hub.
Voici les étapes pour créer un jeton d'accès (access token) sur Docker Hub :

Connectez-vous à votre compte sur le site de Docker Hub (https://hub.docker.com/).
Cliquez sur votre nom d'utilisateur dans le coin supérieur droit de la page, puis sélectionnez "Account Settings" dans le menu déroulant.
Dans le menu de gauche, cliquez sur "Security".
Dans la section "Access Tokens", cliquez sur le bouton "New Access Token".
Donnez un nom descriptif à votre jeton (par exemple, "GitHub Actions") et sélectionnez les autorisations appropriées (par exemple, "Read, Write, Delete").
Cliquez sur "Create" pour générer le jeton.
Le jeton généré s'affichera à l'écran. Assurez-vous de le copier immédiatement car vous ne pourrez plus le voir une fois que vous aurez quitté la page. Si vous le perdez, vous devrez en créer un nouveau.

Une fois que vous avez copié le jeton, retournez dans les paramètres de votre dépôt GitHub et créez le secret DOCKERHUB_TOKEN avec la valeur du jeton que vous venez de générer sur Docker Hub.

---

Assurez-vous de générer un jeton d'accès personnel dans les paramètres de votre compte Docker Hub si vous n'en avez pas déjà un.
Une fois que vous avez ajouté ces deux secrets dans les paramètres de votre dépôt GitHub, votre workflow GitHub Actions pourra les utiliser pour s'authentifier auprès de Docker Hub lors du déploiement de votre image Docker, sans exposer vos informations d'identification dans le fichier de configuration du workflow.
N'hésitez pas si vous avez d'autres questions !

3. Créez un fichier `.github/workflows/deploy.yml` à la racine de votre projet avec le contenu suivant :

```yaml
name: Deploy to Docker Hub

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}
        
    - name: Build and push Docker image
      uses: docker/build-push-action@v3
      with:
        context: .
        push: true
        tags: jeromev34/client-docker-react:latest
```

Cette GitHub Action se déclenchera à chaque push sur la branche `main`. Elle se connectera à Docker Hub en utilisant les secrets configurés, puis construira et poussera votre image Docker vers le dépôt `jeromey34/client-docker-react` avec le tag `latest`.

Assurez-vous de commiter et pousser le Dockerfile et le fichier de workflow `.github/workflows/deploy.yml` vers votre dépôt GitHub.

Une fois ces étapes effectuées, chaque fois que vous pousserez des modifications sur la branche `main`, votre application sera automatiquement déployée sur Docker Hub.

N'hésitez pas si vous avez d'autres questions !