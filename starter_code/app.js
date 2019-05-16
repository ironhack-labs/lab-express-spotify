const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:



const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

hbs.registerPartials(__dirname + '/views/partials')





// the routes go here:
const home = require('./routes/home')
app.use('/', home)

const artists = require('./routes/artists')
app.use('/artists', artists)



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
