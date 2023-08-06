require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here: (DONE)
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here: (DONE)
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

// Home
app.get('/', (req,res) => {
        res.render('index');
});

// Iteration 3 | Search for an Artist
app.get('/artist-search', async (req,res) => {
    try{
        const {artist} = req.query;

        let allArtists = await spotifyApi.searchArtists(artist);
        console.log(allArtists.body.artists.items[0].images[0]);
        res.render('artist-search-results', {artists: allArtists.body.artists.items});
    }
    catch (error){
        console.log(error);
    }
});

// Iteration 4 | View Albums
app.get('/albums/:artistId', async (req,res) => {
    try {
        const {artistId} = req.params;
        
        let albumSearch = await spotifyApi.getArtistAlbums(artistId);
        console.log(albumSearch.body.artists.items[0].images[0]);
        res.render('albums', {albums: albumSearch.body.artists.items[0]});
    }
    catch (error){
        console.log(error);
    }
  });

  // Iteration 5 | View Tracks
  app.get('/tracks/:albumsID', async (req,res, next) => {
    try {
        const {tracksId} = req.params;
        const tracksView = await spotifyApi.getAlbumTracks(tracksId);
        console.log(tracksView.body);
        res.render('tracks', {tracks:tracksView.body.item})
    }
    catch(error){
        console.log('Something went wrong!', error)
    }
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
