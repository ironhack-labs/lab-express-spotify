const express = require("express");
const hbs = require("hbs");
require("dotenv").config();

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Remember to insert your credentials here
const clientId = process.env.CLIENT_ID,
  clientSecret = process.env.CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.get("/", (req, res, next) => {
  res.render("index");
});

app.post("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.body.name)
    .then(data => {
      // console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let paco =data.body.artists.items;
      res.render("artists", { paco });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
  .then(data => {
    let albums =data.body.items;
    res.render("albums", { albums });
  }) 
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  }); 

});

app.get("/tracks/:tracksId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.tracksId)
  .then(data => {
    let pacoTracks =data.body.items;
    res.render("tracks", { pacoTracks });
  }) 
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  }); 

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


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

// the routes go here:

// Client ID 2d2517785bdf4556986941ccb48e61c7

// Client Secret 0f694b33351f492596fbb1445de427c0
