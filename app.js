const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const recognize = require('./helpers.js');

const app = express();

app.use(express.static('public'));
app.use(fileUpload());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/upload', (req, res) => {
  res.render('result');
});

app.post('/upload', async (req, res) => {
  if (!req.files) { res.status(400).send('No files were uploaded.'); }
  try {
    const { s3Object, labels } = await recognize(req.files.picture);
    const isHotDog = labels.filter(label => label === 'Hotdog' || label === 'Hot Dog').length > 0;
    res.render('result', { s3Object, labels, isHotDog });
  } catch (err) {
    res.json({
      status: 'KO',
      error: err,
    });
  }
});
app.listen(3000);
