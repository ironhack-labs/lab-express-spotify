require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const app = express();



//-------------Require spotify-web-api-node package:
const SpotifyWebApi = require("spotify-web-api-node");
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));



//--------------Setting the spotify-api:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});



//--------------Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });



//--------------The routes go here:
//-----GET Home Page
app.get("/", (req, res, next) => {
  res.render("index");
});


//-----Display results for artist search
app.get("/artist-search", (req, res, next) => {
  // console.log(req.query.artist);
  spotifyApi
    .searchArtists( /*'HERE GOES THE QUERY ARTIST'*/ req.query.theArtistName)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let {
        items
      } = data.body.artists;
      // console.log("The received data from the API: ", items);
      res.render("artists", {
        items
      });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

//-----Display results for album search
app.get("/albums/:artistId", (req, res, next) => {
  // console.log(req.params.artistId);
  const id = req.params.artistId;
  spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      // console.log(data.body.items);
      res.render("albums", {
        albums: data.body.items
      });
    })
    .catch(err => console.log(err));
});

//-----Display results for tracks search
app.get("/tracks/:albumId", (req, res, next) => {
  const idOfTheAlbum = req.params.albumId;
  console.log(idOfTheAlbum);
  spotifyApi
    .getAlbumTracks(idOfTheAlbum)
    .then(trackData => {
      // console.log(trackData.body.items);
      res.render("tracks",{tracks:trackData.body.items});
    })
    .catch(err => console.log(err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);