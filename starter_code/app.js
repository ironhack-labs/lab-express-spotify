const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials")

// setting the spotify-api goes here:


// Remember to insert your credentials here
const clientId = '7fc346c4e0094590a8054aa23cefbb01',
  clientSecret = '5cb31c6f8d054fa29028a3dc77330fc9';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});


// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })



// the routes go here:

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/artists", (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      const dataArtists = data.body.artists.items
      res.render("artists", { dataArtists })
      console.log("The received data from the API: ", data.body.artists.items[1]);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log(req.query.artist)
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get("/artist/:artist_id", (req, res) => {
  console.log(req.params.artist_id)
  spotifyApi.getArtistAlbums(req.params.artist_id)
    .then(data => {
      const albums = data.body.items
      console.log("Artist Albums", { albums })
      res.render("albums", { albums })
    })
    .catch(err => {
      console.log(req.query.artist)
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get("/tracks/:track_id", (req, res) => {
  console.log(req.params.track_id)
  spotifyApi.getAlbumTracks(req.params.track_id)
    .then(data => {
      const track = data.body.items
      console.log("Album Tracks", { track })
      res.render("tracks", { track })
    })
    .catch(err => {
      console.log(req.query.artist)
      console.log("The error while searching artists occurred: ", err);
    })
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
