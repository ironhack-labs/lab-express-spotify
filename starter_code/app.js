const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = 'f91f67cf24c84d2cbfb6be1c8d877b9e',
    clientSecret = 'b81ca33e667b43e6a8de85c78e74d42e';

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
  spotifyApi.searchArtists(req.query.artist)
      .then((data) => {
        res.render('artists',{theArtists: data.body.artists});
      })
      .catch((err) => {
        console.log("The error while searching artists occurred: ", err);
      })

});

app.get('/albums/:artistId', (req, res, next) => {
  let theArtistAlbums = req.params.artistId;
  spotifyApi.getArtistAlbums(theArtistAlbums)
  .then((data) => {
      res.render('albums', {theArtistAlbums: data.body.items});
    })
    .catch((err) => {
      console.log(err);
    })

});


app.get('/album/:albumId', (req, res, next) => {
  let theAlbumTracks = req.params.albumId;
  spotifyApi.getAlbumTracks(theAlbumTracks)
  .then((data) => {
      res.render('album', {theAlbumTracks: data.body.items});
    })
    .catch((err) => {
      console.log(err);
    })

});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
