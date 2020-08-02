require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const { data } = require('jquery');

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
app.get('/', (req, res)=>{
    res.render("index")
})

app.get('/artist-search', (req, res, next) => {
    // console.log({query: req.query})
    spotifyApi
    // since name is artists in our form, this needs to be req.query.artist 
    .searchArtists(req.query.artists)
    .then(data => {
    // console.log('The received data from the API: ', data.body.artists.items);
    // console.log({ imagesTest : data.body.artists.items[0].images})
      res.render("artist-search-results", {artist : data.body.artists.items})
    })
    .catch(err => console.log('An error while searching artists occurred: ', err));
})

app.get('/albums/:artistsId', (req,res,next)=> {
    // console.log('params', req.params.artistsId)
    spotifyApi
    .getArtistAlbums(req.params.artistsId)
    .then(data => {
        // console.log('The received data from the API: ', data.body.items);
        res.render('album', {album: data.body.items})
      })
      .catch(err => console.log('An error while navigating to album has occurred: ', err));
})

app.get('/getAlbumTracks/:albumId', (req,res,next)=> {
  // console.log('test', req.params.artistsId)
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(data => {
      // console.log('The received data from the API: ', data.body.items);
      res.render('tracks', {track: data.body.items})
    })
    .catch(err => console.log('An error while navigating to album has occurred: ', err));
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
