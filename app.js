require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );



app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      let searchResult = {};
      searchResult.items = [];

      data.body.artists.items.forEach((artist) => {
        const artistDetails = {};
        // I filter out all artists without images
        // ( I think it looks better for this exercise )
        if (artist.images[0]) {
          artistDetails.name = artist.name;
          artistDetails.img = artist.images[0];
          artistDetails.id = artist.id;
          searchResult.items.push(artistDetails);
        }
      });
      res.render("artist-search-results", searchResult);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId, { limit: 10 })
    .then((data) => {
      return data.body.items.map((a) => {
        return a.id;
      });
    })
    .then((albums) => {
      return spotifyApi.getAlbums(albums);
    })
    .then((data) => {
      let albumResults = {};
      albumResults.albums = [];

      data.body.albums.forEach((album) => {
        const albumDetails = {};
          albumDetails.name = album.name;
          albumDetails.img = album.images[0];
          albumDetails.id = album.id;
          
          albumResults.albums.push(albumDetails);
      
      });
      res.render('albums', albumResults);
    })
    .catch((err) =>
      console.log("The error while displaying albums occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId, { limit : 5, offset : 1 })
  .then((data) => {
    data.body.items.forEach((track) => {
        let trackUrl = track.preview_url;
        console.log(trackUrl)
        console.log(track.name);
        track.artists.forEach((artist) => {
          console.log((artist.name))
        })
    })
    res.render('tracks');
  })
  .catch((err) => {
    console.log("The error while displaying tracks occurred: ", err)
  })
});


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
