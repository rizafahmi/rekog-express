const AWS = require('aws-sdk')
require('dotenv').config()

const recognize = async ( image ) => {
  AWS.config.loadFromPath('./.secret.json')
  await uploadImage("rekog-techinasia", image)
  return new Promise((resolve, reject) => {
    const rekog = new AWS.Rekognition()
    const params = {
      CollectionId: "rekog-techinasia",
      Image: {
        Bucket: "rekog-techinasia",
        Name: image.name
      }
    }
    rekog.detectLabels({
      Image: {
        S3Object: {
          Bucket: "rekog-techinasia",
          Name: image.name
        }
      },
      MaxLabels: 24,
      MinConfidence: 60
    }, (err, data) => {
      if (err) {
        console.error(err)
        reject(err)
        return
      } else {
        const labels = data.Labels.map(l => l.Name)
        console.log(`${image.name}: ${labels.join(", ")}`)
        resolve(labels)
      }
    })

  })
}

const uploadImage = (bucketName, image) => {
  const s3 = new AWS.S3()
  console.log(image.data.buffer)
  return new Promise((resolve, reject) => {
    s3.upload({
      Bucket: bucketName,
      Key: image.name,
      Body: new Buffer(image.data.buffer)
    }, (err, data) => {
      if (err) {
        console.error(err)
        reject(err)
        return
      } else {
        console.log(`Uploaded ${image.name} to bucket ${bucketName}`)
        resolve(data)
      }
    })

  })
}

module.exports = recognize
