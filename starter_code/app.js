const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = 'f016384adb1b40a8891abe67b0972172',
    clientSecret = '5211eabbae9d4a219af7513134a93015';

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
app.get('/', (req, res, next) => res.render('index'));
app.get('/artists', (req, res, next) => {
    //artistToFind
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
          res.render('artists', {artists: data.body.artists.items});
          console.log("The received data from the API: ", data.body.artists.items);
          // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => {
          console.log("The error while searching artists occurred: ", err);
        })
  });

  app.get('/albums/:id', (req, res, next) => {
    //artistToFind
    spotifyApi.getArtistAlbums(req.params.id)
        .then(data => {
          console.log("The albums are:", data.body.items);
          res.render('albums', {albums: data.body.items});
          // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => {
          console.log("The error while searching albums occurred: ", err);
        })
  });


  app.get('/tracks/:id', (req, res, next) => {
    //artistToFind
    spotifyApi.getAlbumTracks(req.params.id)
        .then(data => {
          console.log("The tracks are:", data.body.items);
          res.render('tracks', {tracks: data.body.items});
          // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => {
          console.log("The error while searching tracks occurred: ", err);
        })
  });
  


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
