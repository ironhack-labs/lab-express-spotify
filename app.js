require('dotenv').config();

const express = require('express'),
  hbs = require('hbs'),
  router = express.Router(),
  SpotifyWebApi = require('spotify-web-api-node'),
  chalkAnimation = require('chalk-animation'),
  app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views');


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res) => {

  res.render("index")
})

app.get("/artistSearch", (req, res, next) => {
  const reqQueryArtistSearch = req.query.artistSearch
  if (reqQueryArtistSearch=="") {
    res.redirect("/")
  } else {
    spotifyApi.searchArtists(reqQueryArtistSearch)
    .then(function(data) {
      // console.log('Search artists by "Love"', data.body);
      let info = data.body.artists.items
      res.render("artistSearch", {
        info
      });
    }, function(err) {
      console.error(err);
    });

  }

})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    (data) => {
      const albums = data.body.items;
      console.log(albums);
      res.render("artistAlbum", {
        albums
      })

    },
    (err) => {
      console.error(err);
    }
  );
});

app.get('/albums/tracks/:albumId', (req, res, next) => {
  console.log(req.params.albumId);
  spotifyApi.getAlbumTracks(req.params.albumId, {
      limit: 5,
      offset: 1
    })
    .then(function(data) {
        const tracks = data.body.items;
        res.render("artistTracks", { tracks });

    }, function(err) {
      console.log('Something went wrong!', err);
    });

});


module.exports = app



app.listen(3000, () => chalkAnimation.rainbow('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
