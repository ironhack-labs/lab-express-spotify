const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + 'views/partials')


// setting the spotify-api goes here:
const clientId = '35e962581e714c5fbe1f9d891d932ed9',
    clientSecret = '9265f169171f477c818e15f0c45cf7d6';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:
app.get('/', (req, res, next) => {
  res.render('home');
});

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.search)
      .then(data => {
          console.log("The received data from the API: ", data.body);
          res.render("artists", data.body)
        })
      .catch(err => {
          console.log("The error while searching artists occurred: ", err);
          next(err)
      })
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
      .then(data => {
          console.log('Artist albums', data.body);
          res.render("albums", data.body)

      })
      .catch(err => {
          console.error("The error while getting albums occurred: ",err);
          next(err)
      })
});

app.get('/tracks/:albumsId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumsId )
    .then(data => {
      console.log('Artist tracks', data.body);
      res.render("tracks", data.body)

    })
    .catch(err => {
      console.error("The error while getting tracks occurred: ",err);
      next(err)
    })    
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
