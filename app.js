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
app.get('/', (req, res, next)=>{

  res.render('index')
})

app.get('/artist-search', (req, res, next)=>{
  spotifyApi
  .searchArtists(req.query.searchArtists)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const artists = data.body.artists.items
    res.render('artist-search-results', {artists})
    console.log(data.body.artists.items) //to catch the info into the artist array
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  
})

app.get('/albums/:id', (req, res, next)=>{
  //const albumID = req.params.id
  spotifyApi.getArtistAlbums(req.params.id)
  .then(data =>{
    const albums = data.body.items
    res.render("albums", {albums})
  })

})


app.get('/tracks/:albumId', (req, res, next)=>{
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data =>{
    const tracks = data.body.items
    res.render("tracks", {tracks})
  })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
