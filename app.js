require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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

//Route for homepage
app.get("/", (req, res, next) => {
    res.render("home");
})


app.get('/artist-search', (req, res, next) => {
  const artist = req.query.artist;

  spotifyApi.searchArtists(artist)
      .then(data => {
          console.log(data.body.artists.items[0])
          // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
          res.render('artist-search-results', data.body)
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    const artistName = req.query.artist;

    spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            console.log('Artist albums', data.body);
            res.render('albums', { items: data.body.items, artistName })
        })
        .catch(err => {
            console.error(err);
        });
});


  app.get('tracks/:albumId', (req, res, next) => {
      const albumId = req.params.albumId;
      const album = req.query.album;

      spotifyApi.getAlbumTracks(albumId)
        .then(data => {
            console.log('Album Tracks:', data.body.items);
            res.render('tracks', { items: data.body.items, album })
        })
        .catch(err => {
            console.error(err);
        });

  })



app.listen(3002, () => console.log('My Spotify project running on port 3002 🎧 🥁 🎸 🔊'));
