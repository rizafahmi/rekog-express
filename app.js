const express = require('express')
const fileUpload = require('express-fileupload')

const app = express()

app.use(express.static('public'))
app.use(fileUpload())

app.post('/upload', (req, res) => {
  if (!req.files)
    res.statu(400).send('No files were uploaded.')
  const { picture } = req.files
  res.json({name: picture.name})
})
app.listen(3000)
