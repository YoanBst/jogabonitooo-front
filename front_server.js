const express = require('express');
const path = require('path');
const http = require('http');
const app = express();

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Si aucune route ne correspond, on renvoie la page login.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, 'HTML', 'login.html'));
});

const PORT = process.env.PORT || 8000;

http.createServer(app).listen(PORT, () => {
  console.log(`Express HTTP static server running on port ${PORT} for the files in ${publicDir}`);
});
