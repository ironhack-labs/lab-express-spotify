const express = require('express');
const app = express();
const hbs = require('hbs');
const PORT = process.env.PORT || 3000;
const SpotifyWebApi = require('spotify-web-api-node');

require('dotenv').config();

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// Remember to paste your credentials here

const spotifyApi = new SpotifyWebApi({
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/',(req, res, next)=>{
  res.render('index');
})

app.get("/artists", (req, res, next) => {
  const {artist} = req.query;

  spotifyApi.searchArtists(artist)
    .then(data => {    
      res.render("artists", {artists: data.body.artists.items});
    })
})

app.get("/artists/:artistId", (req, res, next) => {
  const artist = req.params.artistId;

  spotifyApi.getArtistAlbums(artist)
    .then(data => {    
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