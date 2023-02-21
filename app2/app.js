const express = require('express')
const app = express()
const port = 8082
const bodyParser = require('body-parser');


const AWS = require('aws-sdk');
const fs = require('fs');
const { subtle } = require('crypto');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.send('server 2!')
})

app.post('/api/addfile', (req, res) => {
  console.log(req.body);
  
  if(req.body.nature==='subtitle' || req.body.nature==='video'){
    if(req.body.nature=='subtitle'){
      req.body.filename+='.srt'
    }
    else{
      req.body.filename+='.mp4'
    }
    fs.writeFileSync(req.body.filename, req.body.content) ;
    sendToS3(req.body.filename); 
  }
  if(req.body.nature==='metadata'){
    sendToDynamo(req.body.filename,req.body.content)
  }
  else {
    console.log("aucun traitement pour l'instant")
  }
  res.send('fichier ajouté');
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function sendToS3(data){
  const s3 = new AWS.S3({
    accessKeyId: 'AKIAVMEE35Q5DAU5QT65',
    secretAccessKey: '',
  });
  
  // Lecture du contenu du fichier à télécharger
  const fileContent = fs.readFileSync(data);
  
  // Paramètres de la requête pour télécharger le fichier
  const params = {
    Bucket: 'afsbucket20',
    Key: data ,
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

function sendToDynamo(filename,content){
  AWS.config.update({
    region: 'eu-west-3', // spécifier la région AWS où la table est créée
    accessKeyId: 'AKIAVMEE35Q5DAU5QT65',
    secretAccessKey: ''
  });
  
  // Créer une instance de DocumentClient pour interagir avec DynamoDB
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  
  const TABLE_NAME= 'video_table'
  
  // Définir les informations de l'élément à ajouter à la table
  const params = {
    TableName: TABLE_NAME,
    Item: {
      'VideoID': filename ,
      'VideoFile': 'https://afsbucket20.s3.amazonaws.com/'+filename+".mp4" ,
      'SRTFile': 'https://afsbucket20.s3.amazonaws.com/'+filename+".srt",
      'Language': content
    }
  };
  
  // Ajouter l'élément à la table
  
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de l\'élément : ', err);
    } else{
    console.log('Élément ajouté avec succès : ', data);
  }
  });
  
}




