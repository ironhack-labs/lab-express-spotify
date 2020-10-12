require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

spotifyApi
  .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
  .then((data) => {
    console.log("The received data from the API: ", data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch((err) =>
    console.log("The error while searching artists occurred: ", err)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("landing.hbs");
});

app.get("/artist-search", (req, res) => {
  spotifyApi.searchArtists(req.query.artist).then(
    function (data) {
      console.log(data.body.artists.items[0].images[0].url);

      let result = data.body.artists.items;

      res.render("artist-search-results.hbs", {
        result,
      });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(function (data) {
        console.log(data.body.items);
        

        res.render('albums',{data: data.body.items})
    });
  },
  function (err) {
    console.error(err);
  }
);

app.get("/tracks/:albumId", (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(function (data) {
        console.log(data.body.items);
    
        res.render('tracks',{data: data.body.items})
    });
  },
  function (err) {
    console.error(err);
  }
);


app.listen(3001, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
