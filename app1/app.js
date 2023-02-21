const express = require('express')
const app = express()
const port = 8081
const bodyParser = require('body-parser');
const formidable = require('formidable');

const AWS = require('aws-sdk');
const fs = require('fs');
const { subtle } = require('crypto');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.send('server 1!')
})

app.post('/api/addfile', (req, res) => {
  console.log(req.body);
  if (req.body.nature === 'subtitle') {
    req.body.filename += '.srt'
    fs.writeFileSync(req.body.filename, req.body.content);
    sendToS3(req.body.filename);
  }
  if (req.body.nature === 'metadata') {
    sendToDynamo(req.body.filename, req.body.content)
  }
  else {
    console.log("aucun traitement pour l'instant")
  }
  res.send('fichier ajouté');
})

app.post('/api/addvideo', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
   
    if (err) {
      console.error(err.message);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Une erreur est survenue lors du traitement de la demande');
      return;
    }

    // Vérifie que le champ de la vidéo est présent dans la demande
    if (!files.video) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Le champ de la vidéo est requis');
      return;
    }

    // Lit la vidéo depuis le fichier temporaire
    const videoPath = files.video._writeStream.path;
    const videoStream = fs.createReadStream(videoPath);
    // Enregistre la vidéo sur le serveur
    const savePath = './destination/' + files.video.originalFilename;
    const writeStream = fs.createWriteStream(savePath);
    sendToS3("./destination/"+files.video.originalFilename);
    videoStream.pipe(writeStream);
    videoStream.on('end', () => {
      sendToS3(req.body.filename);
      fs.unlinkSync(videoPath); // Supprime le fichier temporaire
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('La vidéo a été enregistrée avec succès sur le serveur');
    });
  });
})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function sendToS3(data) {
  const s3 = new AWS.S3({
    accessKeyId: '',
    secretAccessKey: '',
  });

  // Lecture du contenu du fichier à télécharger
  const fileContent = fs.readFileSync(data);

  // Paramètres de la requête pour télécharger le fichier
  const params = {
    Bucket: 'afsbucket20',
    Key: data,
    Body: fileContent,
    ACL: 'public-read',
    ContentType: 'text/plain',
  };

  // Envoi de la requête POST à Amazon S3
  s3.upload(params, (err, data) => {
    if (err) {
      console.log("Erreur lors de l'envoi du fichier : ", err);
    } else {
      console.log('Fichier téléchargé avec succès : ', data.Location);
    }
  });
}

function sendToDynamo(filename, content) {
  AWS.config.update({
    region: 'eu-west-3', // spécifier la région AWS où la table est créée
    accessKeyId: '',
    secretAccessKey: ''
  });

  // Créer une instance de DocumentClient pour interagir avec DynamoDB
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const TABLE_NAME = 'video_table'

  // Définir les informations de l'élément à ajouter à la table
  const params = {
    TableName: TABLE_NAME,
    Item: {
      'VideoID': filename,
      'VideoFile': 'https://afsbucket20.s3.amazonaws.com/' + filename + ".mp4",
      'SRTFile': 'https://afsbucket20.s3.amazonaws.com/' + filename + ".srt",
      'Language': content
    }
  };

  // Ajouter l'élément à la table

  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de l\'élément : ', err);
    } else {
      console.log('Élément ajouté avec succès : ', data);
    }
  });

}




