# Utilisation de l'image de base pour Node.js
FROM node:latest

# Définition du répertoire de travail
WORKDIR /sendData

# Copie des fichiers du répertoire actuel vers le répertoire de travail
COPY . .

# Installation des dépendances
RUN npm install
RUN npm install postman-request
RUN npm install aws-sdk

# Exécution de l'application
CMD ["node", "sendData.js"]

