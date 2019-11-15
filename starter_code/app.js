require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");

const morgan = require('morgan');
const logger = morgan('tiny'); // returns a logger function

const path = require('path');
const app = express();


// Middleware
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

app.use(logger);
app.use(express.static(path.join(__dirname, 'public')));


// Setting the spotify-api
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieving an access token
spotifyApi
.clientCredentialsGrant()
.then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
})
.catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
});


// Routes
app.get('/', (req, res, next) => {
    res.render('index');
})

app.get('/artists', (req, res, next) => {
    // console.log('req.query ->', req.query);
    // console.log('req.query.artist ->', req.query.artist);
    
    spotifyApi.searchArtists(req.query.artist) // res.send(req.query);
    .then(function(result) {
        console.log('Search artists by name', req.query.artist);
        // console.log(result.body.artists.items);
    
        res.render('artists', { artistsArray: result.body.artists.items });
    }, function(err) {
        console.error(err);
    });
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
