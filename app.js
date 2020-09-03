require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

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
app.get('/',(req,res) => {
    res.render('main');
}) 

app.get('/artist-search',(req,res) => {
    const searchName = req.query.artist
    console.log(searchName)

spotifyApi
  .searchArtists(searchName)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    console.log(data.body.artists.items)
    res.render('artist-search-results', data.body)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

//get artist albums 
app.get('/albums/:artistId',(req,res) => {
const searchAlbum = req.params.artistId
console.log(searchAlbum)
spotifyApi
      .getArtistAlbums(searchAlbum)
      .then(data => {
          console.log('Artist Albums',data.body)
          res.render('albums',data.body)
      })
      .catch(err => console.log('Error',err))
})

app.get('/tracks/:tracksId',(req,res) => {
    const albumTracks = req.params.tracksId
    console.log(albumTracks)

spotifyApi.getAlbumTracks(albumTracks)
  .then(data => {
    console.log('Tracks',data.body);
    res.render('tracks', data.body)
  })
  .catch(err => console.log('Error',err))
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));