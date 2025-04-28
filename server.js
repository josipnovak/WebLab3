const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const fs = require('fs');
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

app.get('/grafikon', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'grafikon.html')); 
});

app.get('/slike', (req, res) => {
    const dataPath = path.join(__dirname, 'slike.json');
    console.log('Reading data from:', dataPath);
    const images = JSON.parse(fs.readFileSync(dataPath));
    res.render('slike', { images });
  });

app.get('/videoteka', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'videoteka.html'));
})

app.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});
