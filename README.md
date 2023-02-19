# Cloud

# commande POD subtitle
 docker run -v $(pwd)/videos:/videos containersname 
 docker run -e video_file="./Cloud/otters.mp4" -v $(pwd)/videos:/videos autosub

 # Fonctionnement
 Il suffit mettre une vidéo dans le répertoire videosBrutes.
 Une fois fais il fait lancer la commande : ./script.sh
 Lorsque le traitement de la vidéos est terminé, nous la retrouvons dans le dossier storage avec ses sous-titres générés.  