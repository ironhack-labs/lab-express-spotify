require('dotenv').config();

const express = require('express');
const app = express();
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(`${__dirname}/views/partials`);

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
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {
spotifyApi
.searchArtists(req.query.artist)
.then(data => {
    // console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results', { data: data.body.artists.items });
})
.catch(err => console.log('The error while searching artists occurred: ', err)); 
})

app.get('/albums/:albumId', (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.albumId)
    .then((data) => {
        res.render('albums', { data: data.body.items})
    })
    .catch((err) => {
        console.log('The error while getting the albums occurred', err)
    })
});

app.get('/albums/tracks/:albumId', (req, res) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
        res.render('tracks', { data: data.body.items })
    .catch((err) => {
        console.log(`The error occurred while getting the tracks`, err)
    })
    })
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
