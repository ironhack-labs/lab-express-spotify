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
app.get("/", (req,res)=>{
  res.render("index");
});

app.get('/artists-search', (req,res,next)=>{
  spotifyApi
  .searchArtists(req.query.artistSearch)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    let artists = data.body.artists.items;
    console.log(artists);
    res.render('artists', {artists});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    let albums = data.body.items;
    res.render('albums', {albums});
  });
});

app.get("/albums/:albumID/tracks", (req, res) => {

  spotifyApi
  .getAlbumTracks(req.params.albumID)
  .then(data => {
    console.log(data.body);
    let tracks = data.body.items;
    res.render("tracks", {tracks});
  })
  .catch(error => {
    console.log(error);
  });



});

//

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));