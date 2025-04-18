require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Simples "banco de dados" em memória
const urls = {};
const urlToId = {}; // para garantir consistência
let idCounter = 1;

function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  if (!isValidHttpUrl(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // já existe?
  if (urlToId[originalUrl]) {
    return res.json({
      original_url: originalUrl,
      short_url: urlToId[originalUrl]
    });
  }

  const id = idCounter++;
  urls[id] = originalUrl;
  urlToId[originalUrl] = id;

  res.json({
    original_url: originalUrl,
    short_url: id
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  const url = urls[id];

  if (url) {
    return res.redirect(url);
  } else {
    return res.json({ error: "No short URL found for the given input" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
