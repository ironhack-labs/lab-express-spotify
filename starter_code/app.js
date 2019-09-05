const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = '2b7ac3eb75b6493280e88eccecc9e850';
const clientSecret = '86b4f31d7c6247eab355f1e716e1b579';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      // console.log("The received data from the API: ", data.body.artists.items[0]);
      // if !(req.query.artist)
      res.render('artists', data);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

// app.get('/about/:id', (req, res, next) => {
//   // Access person from req.params
//   const id = req.params.id;
//   const person = PERSON_MAP[id];
//   res.send('About page for ' + person.name + ' with age ' + person.age);
// });

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(albums => {
      console.log('Artist albums', albums.body);
      res.render('albums', albums.body);
    })
    .catch(error => {
      console.error('Error loading Album');
    });
});


app.get('/tracks/:albumsId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumsId, {
      limit: 5,
      offset: 1
    })
    .then(track => {
      console.log(track.body);
      res.render('tracks', track.body);

    })
    .catch(error => {
      console.log('Something went wrong!', err);
    });
});



app.listen(3006, () => console.log("My Spotify project running on port 3006"));