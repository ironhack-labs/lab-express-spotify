const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
var bodyParser = require('body-parser')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))

hbs.registerPartials(__dirname + "/views/Partials")
// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '1a3361ad68a24a5eb3e7296e2e1f82ca',
clientSecret = '96e92a368d6646d6b5a2ba294b823e55';

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
app.get("/", (req,res) => {
  res.render("index")
})

app.post("/artists", (req, res) =>{
  // res.render(req.query)
  //console.log(req.query.artist)
  spotifyApi.searchArtists(req.body.artist)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      // res.json(data)
      res.render("artists", {artist: data.body.artists.items})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get('/albums/:artistId', (req, res, next) => {
  // console.log(req.params.artistId)
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    res.render("albums", {album: data.body.items})
    //  res.json(data);   
  })  
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});
app.get("/tracks/:albumId", (req,res, next) => {
  // console.log(req.params.albumId)
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    res.render("track", {tracks: data.body.items})
    // res.json(data)
    // console.log(data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

  
app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
