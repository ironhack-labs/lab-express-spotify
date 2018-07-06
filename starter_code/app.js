const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const bodyparser = require("body-parser");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));

hbs.registerPartials(path.join(__dirname, "views/partials"));

const clientId = "9b2f2eda8a824a01a67f3bd272d1191d",
  clientSecret = "f2092c65231444e799c1547220186feb";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

// Home page
app.get("/", (req, res, next) => {
  res.render("home", {
    title: "Spotify",
    homePage: true
  });
});

// Artists page
app.post("/artists", (req, res, next) => {
  var { artist } = req.body;

  spotifyApi.searchArtists(artist)
    .then(data => {
      var artists = data.body.artists.items;

      setData(artists, "/albums/", "View albums");

      res.render("artists", {
        title: "Artists - Spotify",
        artists: artists
      });
    })
    .catch(err => {
      console.log(err);
    });
});

// Albums page
app.get('/albums/:artistId', (req, res) => {
  var { artistId } = req.params;

  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      var albums = data.body.items;

      setData(albums, "/tracks/", "View tracks");

      res.render("albums", {
        title: "Albums - Spotify",
        albums: albums
      });
    })
    .catch(err => {
      console.log(err);
    });
});

// Tracks page
app.get('/tracks/:albumId', (req, res) => {
  var { albumId } = req.params;

  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      var tracks = data.body.items;

      res.render("tracks", {
        title: "Tracks - Spotify",
        tracks: tracks
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(3000);

const setData = (items, url, text) => {
  items.forEach(element => {
    if (element.images.length > 1) {
      element.imageUrl = element.images[1].url;
    } else if (element.images.length) {
      element.imageUrl = element.images[0].url;
    } else {
      element.imageUrl = '/images/' + (url.indexOf('albums') > -1 ? 'default-artist.png' : 'default-album.png');
    }

    element.myLink = {
      href: url + element.id,
      text: text
    }
  });
} 