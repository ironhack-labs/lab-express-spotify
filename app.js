require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));


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

app.get("/", (req, res, next) => {
  res.render("index");
});

//Iteracion 3 step 2
app.get("/artist-search", (req, res, next) => {
  spotifyApi.searchArtists(`${req.query.artist}`)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render("artist-search-results", {
      items: data.body.artists.items.map((artist) => {
        if(artist.images.length === 0) {
          artist.image_url = 'https://cdn.browshot.com/static/images/not-found.png'
        } else {
          artist.image_url = artist.images[0].url
        }
        return artist
      })
    });
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

//Iteracion 4
app.get("/albums/:artistId", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render("albums", {
      items: data.body.items.map((album) => {
        if(album.images.length === 0) {
          album.image_url = 'https://cdn.browshot.com/static/images/not-found.png'
        } else {
          album.image_url = album.images[0].url
        }
        return album
      })
    });
  })
  .catch(err => console.log('The error while searching albums occurred: ', err));
});

//Iteracion 5
 app.get("/tracks/:albumId", (req, res) => {

  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render("tracks", {items: data.body.items})
  })
  .catch(err => console.log('The error while searching album tracks occurred: ', err));

});

app.listen(port, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
