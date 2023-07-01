require('dotenv');

const express = require('express');
const hs = require('hs');

const app = express();

app.set('view engine', 'hs');
app.set('view', _dirname + '/view');
app.use(express.static(__dirname + '/public'));

// Our routes go here

app.listen(3000, () => console.log('My Spotify project running on port 3000'));
