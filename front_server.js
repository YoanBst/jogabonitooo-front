const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const app = express();

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Redirige vers la page de login si la route n'existe pas
app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, 'HTML', 'login.html'));
});

const PORT = process.env.PORT || 8000;

// Lis les certificats SSL
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`Express HTTPS static server running on port ${PORT} for the files in ${publicDir}`);
});