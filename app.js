require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


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

let searchArtistName = ''
// Our routes go here:
app.get('/', (req, res) => {
    res.render(__dirname + '/views/homepage.hbs');
});

app.post('/artist-search', (req, res) => {
    searchArtistName = req.body.name
    spotifyApi
        .searchArtists(req.body.name)
        .then(data => {
            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render(__dirname + '/views/artist-search-results.hbs', {data: data.body.artists.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            let artistName = data.body.items[0].artists[0].name
            let albumData = {
                artistName: artistName,
                albums: data.body.items
            }
            res.render(__dirname + '/views/albums.hbs', {albumData});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log('Album tracks', data.body);
            res.render(__dirname + '/views/tracks.hbs', {data: data.body.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});



app.listen(3030, () => console.log('My Spotify project running on port 3030 🎧 🥁 🎸 🔊'));
