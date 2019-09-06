const express = require('express');
const hbs = require('hbs');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT;


app.set('view engine', 'hbs');
app.set('views',`${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
hbs.registerPartials(`${__dirname}/views/partials`);


// the routes go here:
app.use('/', require('./routes'));

app.listen(PORT, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
