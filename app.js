require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");

// require spotify-web-api-node package here:

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
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

// Our routes go here:
app.get("/", (req, res, next) => {
  res.render("home");
});

app.post("/artist-search", (req, res, next) => {
  const nameArtist = req.body.artist;
  spotifyApi
    .searchArtists(nameArtist)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0].images
      );
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", data.body);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/album/:id", (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      res.render("album", data.body);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/track/:id",(req,res,next)=>{
    spotifyApi
    .getAlbumTracks(req.params.id)
    .then(data=>{
        console.log(data.body)
        res.render("track",data.body)
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

// {
//     external_urls: [Object],
//     followers: [Object],
//     genres: [],
//     href: 'https://api.spotify.com/v1/artists/5Pi3viYqawZx95Gan2dyC3',
//     id: '5Pi3viYqawZx95Gan2dyC3',
//     images: [Array],
//     name: 'I Hate The Beatles',
//     popularity: 7,
//     type: 'artist',
//     uri: 'spotify:artist:5Pi3viYqawZx95Gan2dyC3'
//   }
