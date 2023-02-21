const fs = require('fs');
const request = require('postman-request');
const AWS = require('aws-sdk');
//const fetch = require('node-fetch');

import('node-fetch').then(fetch => {
  sendFilesUntilEmpty(dirPath);
}).catch(error => {
  console.error(error);
});

const bucketName = 'afsbucket20'
const dirPath = '/storage'; // Chemin du fichier à récupérer

// Configuration de l'API AWS
const s3 = new AWS.S3({
  accessKeyId: '',
  secretAccessKey: '',
});

function uploadS3(name, content, filePath) {
  // Paramètres de la requête pour télécharger le fichier
  const uploadParams = {
    Bucket: bucketName,
    Key: name,
    Body: content,
    ACL: 'public-read',
    ContentType: 'text/plain',
  };

  console.log(content)
  console.log(name)



  // Envoi de la requête POST à Amazon S3
  s3.upload(uploadParams, (err, data) => {
    if (err) {
      console.log("Erreur lors de l'envoi du fichier : ", err);
    } else {
      console.log('Fichier téléchargé avec succès : ', data.Location);
      setTimeout(() => {
        deleteFile(filePath);
        sendFilesUntilEmpty(dirPath); // appel récursif de la fonction
      }, 1000);
    }
  });
}


function isDirectoryEmpty(dirPath) {
  const files = fs.readdirSync(dirPath);
  return files.length === 0;
}

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
    console.log(`Le fichier ${filePath} a été supprimé`);
  });
}

function getFirstFileInDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = `${dirPath}/${file}`;
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      console.log(filePath);
      return filePath;
    }
  }
  return null; // Si aucun fichier n'a été trouvé
}

function readFileWithType(filePath) {
  const extension = filePath.split('.').pop().toLowerCase();
  let nature = '';

  switch (extension) {
    case 'mp4':
      nature = 'video';
      break;
    case 'txt':
      nature = 'metadata';
      break;
    case 'srt':
      nature = 'subtitle';
      break;
    default:
      nature = 'unknown';
  }

  return nature;
}

function getContentVideo(filePath) {
  return fs.readFileSync(filePath);
}

function getContent(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function getNameExtensions(filePath) {
  return filePath.split('/').pop().toLowerCase();
}

function getName(filePath) {
  fileExtension = filePath.split('/').pop().toLowerCase();
  console.log(fileExtension.split('.')[0])
  return fileExtension.split('.')[0];
}

function toJSON(nature, filePath) {
  return { "filename": getName(filePath), "nature": nature, "content": getContent(filePath) };
}

function isVideo(nature) {
  return nature === 'video'
}

function sendFilesUntilEmpty(dirPath) {
  if (!isDirectoryEmpty(dirPath)) {
    const filePath = getFirstFileInDir(dirPath);

    const nature = readFileWithType(filePath);
    if (isVideo(nature)) {

      uploadS3(getNameExtensions(filePath), getContentVideo(filePath), filePath)
      /*
      const options = {
        method: 'POST',
        url: 'http://35.180.156.99/api/addvideo',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        formData: {
          video: fs.createReadStream(filePath),
        },
      };
      request(options, (error, response, body) => {
        if (error) {
          console.log(error);
        }
        console.log(body);
      });

      setTimeout(() => {
        deleteFile(filePath);
        sendFilesUntilEmpty(dirPath); // appel récursif de la fonction
      }, 1000);
      */
    }
    else {
      data = toJSON(nature, filePath)
      fetch('http://35.180.156.99/api/addfile', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.ok) {
            console.log("La requête POST a été effectuée avec succès !");
            setTimeout(() => {
              deleteFile(filePath);
              sendFilesUntilEmpty(dirPath); // appel récursif de la fonction
            }, 1000);

          } else {
            console.error("La requête POST n'a pas été effectuée avec succès !");
            sendFilesUntilEmpty(dirPath); // appel récursif de la fonction
          }
        })
        .catch(err => console.error(err));
    }
  }
  else {
    console.log("Le dossier est vide !");
  }
}

// appel de la fonction avec le chemin du dossier
//sendFilesUntilEmpty(dirPath);


