require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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

// home route
app.get('/', (req, res, next) => {
    res.render('home')};


// artist search
app.get('/artist-search', (req, res, next) => {

    const nameOfArtist = req.query.artistName;

    spotifyApi
        .searchArtists(nameOfArtist)
        .then(data => {
            const artists = data.body.artists.items;
            console.log(artists);
            res.render('result-artist-search', {artists})
        })
        .catch(e => {
            console.log(`Erorr: ${e}`);
        });
});


//Albums
app.get('/albums/:artistId', (req, res, next) => {

    const retreivedArtistId = req.params.artistId;

    spotifyApi
        .getArtistAlbums(retreivedArtistId)
        .then(data => {
            const album = data.body.items;
            res.render('albums', {album})
        })
        .catch(e => {
            console.log(`Found an error in the albums: ${e}`)
        });
});

// tracks
app.get('/tracks/:albumId', (req, res, next) => {

    const retreivedAlbumId = req.params.albumId;

    spotifyApi
        .getAlbumTracks(retreivedAlbumId)
        .then(data => {
            const track = data.body.items;
            res.render('album-tracks', {track});
        })
        .catch(e => {
            console.log(`Found an error in the tracks of the album: ${e}`)
        });
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
app.get('/', (req, res, next) => {
    res.render('home')
})


