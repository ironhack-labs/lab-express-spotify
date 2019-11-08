require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
hbs.registerPartials(__dirname + '/views/partials');


// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

// Get artist => We use req.query to get the input 

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
  
      res.render('artist', {artist: data.body.artists.items})

    })
    .catch(err => {
      console.log(err);
    });
});

//Get artist's albums => we use req.params to get the artist id

app.get('/albums/:artistId', (req, res) => {

  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      // res.send(data.body.items)
      res.render('albums', {albums: data.body.items} )

    })
    .catch(err => {
      console.log(err)
    })


    
})

// Get albums tracks => we use req.params to get the album id

app.get('/tracks/:albumId', (req, res) => {

  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      // res.send(data.body.items)
      res.render('tracks', {tracks: data.body.items} )

    })
    .catch(err => {
      console.log(err)
    })


})

// Home



app.get("/", (req, res, next) => {
  res.render("index");
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
