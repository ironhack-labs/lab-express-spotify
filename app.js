require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

app.get("/", (req,res) => {
    console.log()
    res.render("index")
})

app.get("/artist-search", (req,res)  => {
    const query = req.query
    const artistname = req.query.artistname
    console.log(req.query)

    spotifyApi
    .searchArtists(artistname)
    .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);

   // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

    res.render("artist-search", {artist: artistname})
   })
    .catch(err => console.log('The error while searching artists occurred', err))
})
    


  //.getArtistAlbums()
/*app.get('/albums/:artistId', (req, res, next) => {
    const query = req.query
    const artistId = req.query.artistId
    console.log(req.query)

    spotifyApi
    .getArtistAlbum(album)
    .then(data => {
    console.log('The received data from the API: ', data.body.album.artistId);

  res.render("/albums/:artistId", {album: artistId})
  });*/





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
