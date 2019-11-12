require('dotenv').config()


const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");


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
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
      console.log("Something went wrong when retrieving an access token", error);
    });





// the routes go here:

app.get('/', (req, res, next) => {
  res.render("index");
});


app.get("/artists", (req, res, next) => {
  
  let artist = req.query.artist;
  
  spotifyApi
  .searchArtists(artist).then(data => {
    //console.log(data.body.artists)
    res.render("artists", data.body.artists)
  })
  .catch(err => {
    console.log(err)
  })
});


app.get("/albums/:artistId", (req, res, next) => {
  
  let album = req.params.artistId;
  
  spotifyApi
  .getArtistAlbums(album).then(data => {
    //console.log(data.body)
    res.render("albums", data.body)
  })
  .catch(err => {
    console.log(err)
  })
});


app.get("/tracks/:TrackId", (req, res, next) => {
  
  let track = req.params.TrackId;
  
  spotifyApi
  .getAlbumTracks(track).then(data => {
    //return res.send(data.body)
    res.render("tracks", data.body)
  })
  .catch(err => {
    console.log(err)
  })
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
