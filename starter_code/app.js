const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:

const clientId = '51570085da244eb9b8b81627cdf6b1b2',
  clientSecret = 'e82d8150520c486bb35513f3187817ad';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:

app.get('/', (req, res) => {
  res.render('index')
});

app.get('/artists', (req, res) => {
  console.log("i am artists", req.query.myArtist)


  spotifyApi.searchArtists(req.query.myArtist)
    .then(data => {

      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      //res.send(data)
      res.render('artists', { data });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId) // localhost:3000/albums/1236i61523itei765
    .then(data => {
      res.render('albums', { data })
      //res.send(data)
    });
});

app.get('/tracks/:albumsId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumsId)
    .then(data => {
      res.render('tracks', { data })

      //res.send(data)
    });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
