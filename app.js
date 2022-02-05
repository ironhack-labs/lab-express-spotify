require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//to register the partials directory
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res, next) => res.render("home"));

app.get("/artist-search", (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            //console.log('The received data from the API: ', data.body, data.body.artists.items[0].images);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artist-search-results", { items: data.body.artists.items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
        
});

app.get("/:artist/albums/:id", (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("albums", { artist: req.params.artist ,items: data.body.items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get("/tracks/:id", (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("tracks", { items: data.body.items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
