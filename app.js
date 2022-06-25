require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");
//必須註冊partial路徑！

// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res, next) => {
  res.render('index')
  console.log('index test')
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi.searchArtists(req.query.q)
    .then((data) => {
      // console.log("The received data from the API: ", data.body.artists.items[0].preview_url);
      //   console.log(req.query.q);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", {
        artists: data.body.artists.items
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function (data) {
      //   console.log(req.params.artistId);
      //   console.log("Artist albums", data.body);
      res.render("albums", { artistsAlbum: data.body.items });
    },
    function (err) {
      console.error(err);
    }
  );
});


app.get("/albums/tracks/:albumId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then(
    function (data) {
      //   console.log(req.params.artistId);
      //  console.log("tracks", data.body);
      // console.log("The received data from the API: ", data.body.items);
      res.render("tracks", { albumsTrack: data.body.items });
    },
    function (err) {
      console.error(err);
    }
  );
});


app.listen(4000, () => console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊'));
