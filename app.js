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

app.get('/', (req, res) => {

  res.render('index')
})

app.get('/artist-search', (req, res) =>{

  let artistName = req.query.q

  spotifyApi
    .searchArtists(artistName)
    .then( data => {

      res.render('artist-search-result', {data: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:artistId', (req, res) =>{

  let artistId = req.params.artistId

  spotifyApi
    .getArtistAlbums(artistId)
    .then( data => {
        res.render('albums',{albumData : data.body.items})
    })
    .catch(err => console.log('The error while searching the albums of an artist: ',err))
    
})

app.get('/tracks/:albumId', (req, res) => {

  let albumId = req.params.albumId

  spotifyApi
  .getAlbumTracks(albumId)
  .then( data => {
    console.log(data.body.items);
    res.render('tracks', {tracksData: data.body.items})
  })
  .catch(err =>
    console.log('The error while retrieving tracks: ', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
