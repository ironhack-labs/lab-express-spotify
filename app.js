require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
    res.render('index', {doctitle:'home'});
  });


  //search for artists and find albums
app.get('/artist-search', (req, res) => {
    spotifyApi
    .searchArtists(req.query.artist.toLowerCase())
    .then(data => {
    //console.log('The received data from the API: ', {artists: data.body.artists.items});
    //console.log({images: data.body.artists.items[0].images[1].url})
    res.render('artist-search-results', {artists: data.body.artists.items, doctitle:'artist'})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});


//click on view albums button to find tracks
app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        //console.log('Artist albums', {albums: data.body.items});
        //console.log({images: data.body.items[0].images[0].url})  
        res.render('albums', {albums: data.body.items, doctitle:'album'})
        })
        .catch(err => console.log(err));
  });

  //click on view tracks button to listen to tracks
  app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
        //console.log('tracks', {tracks: data.body.items});
        console.log({preview: data.body.items[0].preview_url})  
        res.render('tracks', {tracks: data.body.items, doctitle:'tracks'})
        })
        .catch(err => console.log(err));
  });
  
  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
