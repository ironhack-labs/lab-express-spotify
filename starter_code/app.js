require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// the routes go here:
app.get('/', (req, res) => {
  res.render('index', {title: 'Homepage'});
});

app.get('/artists', (req, res) => {
  let { artist } = req.query;

  spotifyApi
  .searchArtists(artist)
  .then(data => {
    res.render('artists', data.body.artists);
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
});

app.get('/albums/:artistId', (req, res) => {
  const { artistId } = req.params;
  console.log(req.params);

  spotifyApi.getArtistAlbums(artistId).then(
    function(data) {
      res.render('albums', {title: 'Albums', data: data.body});
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get('/albums/tracks/:albumId', (req, res) => {
  const { albumId } = req.params;

  spotifyApi.getAlbumTracks(albumId, { limit : 10, offset : 1 })
  .then(function(data) {
    // res.send(data.body);
    res.render('tracks', {title: "Tracks", data: data.body});
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})


app.listen(process.env.PORT || 3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
