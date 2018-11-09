// SETUP

const express = require('express');
const app = express();
const hbs = require('hbs');

var SpotifyWebApi = require('spotify-web-api-node');

app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
app.set('views', __dirname + '/views');

// ROUTES

app.get("/", (request, response, next) => {
  response.render("home-page.hbs")
});

// Remember to paste your credentials here
var clientId = '4d53b59a9c9047f68aa5db1d194b308d',
    clientSecret = '621d08908b404da68bf94e8bd771ebec';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get("/artists", (request, response, next) => {
  const term = request.query.search_query;
spotifyApi.searchArtists(term)
    .then(data => {
      const allArtistsLists = data.body.artists.items;
      response.locals.artistArray = allArtistsLists;

      response.render("artists.hbs");
      console.log("artist SUCCESSED 🙌🏻", data)
    })
    .catch(err => {
      console.log("Artist FAILED 👎🏻", err)
    })
})

app.get("/test", (request, response, next) => {
  spotifyApi.searchArtists("Coldplay")
      .then(data => {
        response.send(data);
      })
      .catch(err => {
      })
  })

app.get('/albums/:artistId', (request, response, next) => {
  const artistId = request.params.artistId;
  spotifyApi.getArtistAlbums(artistId)
  .then(data => {
    const allAlbumsLists = data.body.items;
    response.locals.artistAlbums = allAlbumsLists;
    response.render("album.hbs");
  })
  .catch(err => {
  })
});

app.get('/tracks/:albumId', (request, response, next) => {
  const albumId = request.params.albumId;
  spotifyApi.getAlbumTracks(albumId)
  .then(data => {
    const allAlbumsTracks = data.body.items;
    response.locals.artistTracks = allAlbumsTracks;
    response.render("tracks.hbs");
  })
  .catch(err => {
  })
});

// 

app.listen(3000, () => {
  console.log('SERVER is good to go. 🚀')
});