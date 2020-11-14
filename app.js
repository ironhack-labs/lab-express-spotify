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
  spotifyApi
  .clientCredentialsGrant()
  .then(data => {spotifyApi.setAccessToken(data.body['access_token'])
  app.get('/artist-search', (req,res) => {
     const artistQuery = req.query.search
     console.log(artistQuery)
    spotifyApi
    .searchArtists(artistQuery)
    .then(data => {
      console.log('The received data from the API: ',data.body.artists.items[0].images[0].url);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results', {artist:data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  })
  app.get('/albums/:artistId', (req, res, next) => {
     const artistID = req.params.artistId
     spotifyApi.getArtistAlbums(artistID)
     .then(data=> res.render('albums', {album:data.body.items}))
     .catch(err => console.log(err))
  });
  app.get('/view-track/:id', (req,res,next) => {
    const trackID = req.params.id
    spotifyApi.getAlbumTracks(trackID,{ limit : 5, offset : 1 })
    .then(data =>res.render('view-tracks', {track:data.body.items}) )
    .catch(err => console.log(err))
  })
} )
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/', (req,res) => {
    res.render('index')
})

  // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
 
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
