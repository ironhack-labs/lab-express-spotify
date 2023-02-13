require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
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
app.set();

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.searchArtist)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
/* app.get('/albums/:artistId', (req, res, next) => {
  /*   const artistSound=req.params.artistId;
    spotifyApi.getArtistAlbums(artistSound)
    .then(data=>{ 
     console.log("albums",{dataSound:data.body.items})
    res.render('albums',{albums:data.body.items})
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    ) */

  app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    const artistId = req.params.artistId
    spotifyApi.getArtistAlbums(artistId)
    .then(data => {
        console.log(data.body.items[0].images[0])
        res.render('albums', {albums: data.body.items})})
    .catch(error => console.log(error))
  });


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
