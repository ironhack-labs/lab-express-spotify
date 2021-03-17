require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const appRoutes = require('./routes/appRoutes')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials'); 



app.use('/', appRoutes);

app.listen(process.env.PORT, () => console.log(`My Spotify project running on port ${process.env.PORT} 🎧 🥁 🎸 🔊`));
