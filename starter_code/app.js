require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
// require spotify-web-api-node package here:

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
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      // console.log("The received data from the API: ", data.body.artists.items[0].images[0].url);
      const artistsResults = data.body.artists;
      res.render("artists", { artistsResults });
    })
    .catch(err => {
      console.log("error while searching artists occurred: ", err);
    });
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    const albums = data.body.items;
    // console.log(data.body.items) 
    res.render('albums', { albums });
  })
  .catch(err => {
    console.log("error while searching albums occured: ", err);
  });
});

app.get('/albums/tracks/:tracksId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.tracksId)
  .then(data => {
    const tracks = data.body.items;
    // console.log(tracks)   
    res.render('tracks', { tracks });
  })
  .catch(err => {
    console.log("error while searching tracks occured: ", err);
  });
});




app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
