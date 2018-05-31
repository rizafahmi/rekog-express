const AWS = require('aws-sdk');
require('dotenv').config();

const recognize = async (image) => {
  AWS.config.loadFromPath('./.secret.json');
  const s3Object = await uploadImage('rekog-techinasia', image);
  return new Promise((resolve, reject) => {
    const rekog = new AWS.Rekognition();
    const params = {
      Image: {
        S3Object: {
          Bucket: 'rekog-techinasia',
          Name: image.name,
        },
      },
      MaxLabels: 24,
      MinConfidence: 60,
    };
    rekog.detectLabels(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const labels = data.Labels.map(l => l.Name);
        console.log(`${image.name}: ${labels.join(', ')}`);
        resolve({ s3Object, labels });
      }
    });
  });
};

const uploadImage = (bucketName, image) => {
  const s3 = new AWS.S3();
  return new Promise((resolve, reject) => {
    s3.upload({
      Bucket: bucketName,
      Key: image.name,
      Body: new Buffer(image.data.buffer),
      ACL: 'public-read',
      Metadata: {
        'Content-Type': image.mimetype,
      },
    }, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(`Uploaded ${image.name} to bucket ${bucketName}`);
        resolve(data);
      }
    });
  });
};

module.exports = recognize;
