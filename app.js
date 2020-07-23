require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');

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

app.get('/', (req, res, next) => {
    res.render('index')
})

app.get('/artist-search', (req, res, next) => {
    
    let {search} = req.query;    
    
spotifyApi
  .searchArtists(search)    
  .then(data => {
    // console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let artist = data.body.artists.items;
    // console.log(artist)
    
    res.render('artist-search-results', artist)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  let idArtist = req.params.artistId
  
  spotifyApi
    .getArtistAlbums(idArtist)
    .then(data => {
      console.log('The albums from this artist are', data.body);
      let albums = data.body.items
      res.render('albums', albums)
    })
    .catch(err => console.log('The error while getting the artist albums', err))
});


app.get('/viewTracks/:albumId', (req, res, next) => {

  let idAlbum = req.params.albumId
  // console.log(idAlbum)

  spotifyApi
    .getAlbumTracks(idAlbum)
    .then(data => {
      let albumResults = data.body.items
      console.log('The previews audio from this album are', albumResults);
      
      res.render('viewTracks', albumResults)
    })
    .catch(err => console.log('The error while getting the preview audio from the album', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
