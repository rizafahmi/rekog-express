const express = require('express')
const fileUpload = require('express-fileupload')

const recognize = require('./helpers.js')

const app = express()

app.use(express.static('public'))
app.use(fileUpload())

app.post('/upload', async (req, res) => {
  if (!req.files)
    res.statu(400).send('No files were uploaded.')
  try {
    const {s3Object, labels} = await recognize(req.files.picture)
    // res.json({
    //   status: 'OK',
    //   labels,
    //   s3Object
    // })
    res.send("<img src='https://s3.amazonaws.com/rekog-techinasia/Screen+Shot+2018-05-22+at+10.23.38.png' />")
  } catch (err) {
    res.json({
      status: 'KO',
      error: err
    })
  }
})
app.listen(3000)
