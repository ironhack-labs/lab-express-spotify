const express = require('express');
const app = express();
const hbs = require('hbs');
const PORT = 3000;
var SpotifyWebApi = require('spotify-web-api-node');

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

// Remember to paste your credentials here

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

app.get('/',(req, res,next)=>{
  res.render('index');
})


app.get("/artist", (req, res, next) => {
  const {artist} = req.query;

  spotifyApi.searchArtists(artist)
    .then(data => {
        // res.send(data);      
      res.render("artists", {artists: data.body.artists.items});
    })
})

app.get("/artist/:artistId", (req, res, next) => {
  const artist = req.params.artistId;

  spotifyApi.getArtistAlbums(artist)
    .then(data => {
        //res.send(data.body.items);      
      res.render("albums", {albums: data.body.items});
    })
})

app.get("/albums/:albumId", (req, res, next) => {
  const album = req.params.albumId;

  spotifyApi.getAlbumTracks(album)
    .then(data => {
        //res.send(data);      
      res.render("tracks", {tracks: data.body.items});
    })
})



app.listen(PORT, () =>  {
console.info(`APP listen at ${PORT} port`);
})


