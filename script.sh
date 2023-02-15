#!/bin/bash

VIDEO_DIR="./videos" # répertoire où se trouvent les vidéos
DOCKER_COMPOSE_DIR="./" # répertoire où se trouve le fichier docker-compose.yml
DOCKER_COMPOSE_NAME="docker-compose" # nom du docker-compose

if [ -z "$(ls -A $VIDEO_DIR)" ]; then
  echo "Il n'y a pas de vidéos dans le répertoire $VIDEO_DIR."
  echo "Arrêt du docker-compose $DOCKER_COMPOSE_NAME ..."
  cd $DOCKER_COMPOSE_DIR
  sudo docker-compose down
else
  echo "Il y a des vidéos dans le répertoire $VIDEO_DIR."
  echo "Démarrage du docker-compose $DOCKER_COMPOSE_NAME ..."
  cd $DOCKER_COMPOSE_DIR
  sudo docker-compose up
fi
