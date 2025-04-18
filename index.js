require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser")

app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

const urls = {};

let idCounter = 1;

app.post('/api/shorturl', (req, res) => {

  const originalUrl = req.body.url;

  try{

    const urlObj = new URL(originalUrl);

  }catch{

    return res.json({error: 'invalid url'})
  }

  const id = idCounter++;
  urls[id] = originalUrl;

  res.json({
    original_url: originalUrl,
    short_url: id
  });
});

app.get('/api/shorturl/:id', (req, res) => {

  const id = req.params.id;
  const url = urls[id];

  if(url){
    res.redirect(url);
  }else{
    res.json({error: "No short URL found for the given input"})
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
})