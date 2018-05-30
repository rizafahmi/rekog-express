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
    const labels = await recognize(req.files.picture)
    res.json({
      status: 'OK',
      labels
    })
  } catch (err) {
    res.json({
      status: 'KO',
      error: err
    })
  }
})
app.listen(3000)
