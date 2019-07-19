const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = 'deb6ef1e2a364b41ab3b81c41fca937b',
    clientSecret = '6f3b1b15ab2b408a979d518ad6f35fbf';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


// the routes go here:
app.get(['/home', "/"], (req, res, next) => {
    res.render('home');
  });

app.get("/artists", (req, res, next) => {
    var artist = req.query.artist;
    spotifyApi.searchArtists(artist)
    .then(data => {
      debugger
      res.render('artists', {data});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.get("/albums", (req, res, next) => {
  const artistId = req.query.id;
  spotifyApi.getArtistAlbums(artistId)
  .then((data)=> {
    debugger
    res.render('albums', {data}); 
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});

app.get("/tracks", (req, res, next) => {
  const albumId = req.query.id;
  spotifyApi.getAlbum(albumId)
  .then((data)=> {
    debugger
    res.render('tracks', {data}); 
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
