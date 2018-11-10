// setup

var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste your credentials here
var clientId = "478aa24ef1b0420295d08992007a534b",
  clientSecret = "1fcb02f81a7744aaa4c597a473434f29";

var spotifyApi = new SpotifyWebApi({
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

const express = require("express");
const app = express();
const hbs = require("hbs");

app.listen(3000, () => {
  console.log("you go girl");
});

app.use(express.static(__dirname + "/public"));

app.set("view engine", "hbs");

// Routes

// home 
app.get("/", (request, response, next) => {
  response.render("index.hbs");
});


// artists
app.get("/artists", (request, response, next) => {
  let artist = request.query.search_query;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      response.locals.artistsArray = data.body.artists.items;
      response.render("artists.hbs");
      //response.send(data.body.artists.items);
    })
    .catch(err => {
      console.log("that's an error, sry bro", err);
    });
});


// albums
app.get("/albums/:artistId", (request, response, next) => {
  const artistId = request.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      response.locals.albumsArray = data.body.items;
      //       response.render("albums.hbs", {albums: data.body.items});
      response.render("albums.hbs", albumsArray);
    })
    .catch(err => {
      console.log("fail", err);
    });
});

app.get("/tracks/:albumId", (request, response, next) => {
  const albumId = request.params.albumId;

  spotifyApi.getAlbumTracks(albumId)
  .then(data => {
    response.locals.tracksArray = data.body.items
    response.render("tracks.hbs", tracksArray)
  })
  .catch(err => {
    console.log("fail", err)
  })
})
