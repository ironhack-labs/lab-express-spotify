require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
console.log(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    console.log(data, data.body);
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.get("/artist-search", (req, res) => {
  const musician = req.query["artist-name"];

  spotifyApi.searchArtists(musician).then(
     data => {
      console.log(data.body.artists.items[0]);
      res.render('artist-search.hbs', {"artistArray" : data.body.artists.items});
    })
    .catch(error => {
        console.log('Error retrieving artists: ', error);
        res.send('error retrieving artists');
    }
  );
});



app.get("/album-search", (req, res) => {
let artistId;
  // How to get artist id???
  spotifyApi.getArtistAlbums(artistId).then(
    function(albums) {
      console.log('Artist albums', albums.body);
    })
    .catch(error => {
      console.log('Error retrieving albums: ', error);
      res.send('error retrieving albums');
  }
);



})







app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
