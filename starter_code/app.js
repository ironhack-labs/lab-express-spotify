const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = '416fce8cef224b70844ce3220a9b791b',
    clientSecret = '7d07a29f939e407d97bac358cce1bc5f';

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
app.get('/', function (req, res) {
    res.render('home-page');
})

//receive the search term from the query string
app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.search)
    .then(data => {
      // console.log("The received data from the API: ", data.body);
      // console.log(data.body.artists);
      res.render('artists',{artist:data.body.artists.items});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  
})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
      // console.log('Artist albums', data.body);
      res.render('albums',{albums:data.body.items});
    })
  .catch(err => {
      console.error(err);
    });
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data => {
      console.log('Tracks', data.body);
      res.render('tracks',{tracks:data.body.items});
    })
  .catch(err => {
      console.error(err);
    });
});






app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
