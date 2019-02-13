const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:


//Inserting credentials
const clientId = /*'ENTER YOUR CLIENT ID HERE'*/,
  clientSecret = /*'ENTER YOUR CLIENT SECRET'*/;

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

//Retrieving access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch( error => {
    console.log('Something went wrong when retrieving an access token', error);
  });


// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
})

app.get('/artist', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('artist', data.body.artists);
    })
    .catch(err => {
      console.log('an error occurred while searching for the artist', err);
    });
});

app.get('/albums', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.query.artistId, { limit: 10})
  .then( data => {
    res.render('albums', data.body);
  })
  .catch(err => {
    console.log("There was an error while retrieving albums", err);
  });
});

app.get('/tracks', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.query.albumId)
  .then( data => {
    console.log(data.body);
    res.render('tracks', data.body);
  })
  .catch( err => {
    console.log("There was an error while retrieving tracks", err);
  });
});





app.listen(3000, () => console.log("My Spotify project running on port 3000"));
