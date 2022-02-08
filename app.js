require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

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
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const search = req.query.searchedArtist;
  spotifyApi
    .searchArtists(search)
    .then((data) => {
      // console.log('The received data from the API: ', data.body.artists.items);
      let answer = data.body.artists.items;
      res.render("artist-search-result", { answer });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      let albums = data.body.items;
    //console.log(albums);
      res.render("albums", {albums})
    })
    .catch((err) => console.log("Something went wrong", err)
    );
    
});


app.get('/tracks/:albumId', (req, res) =>{
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      let tracks = data.body.items
      
      res.render("tracks", {tracks})
    })
    .catch((err) => console.log('There was an error getting the tracks', err)
    );
    
});

// console.log(artistInput)

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

