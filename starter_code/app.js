const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = '62b0b907746f41b1a3218837252252d3',
    clientSecret = '2c569b059c1d4b32ab9af3eacd317772';

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
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  console.log()
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
    
      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists', {items: data.body.artists.items});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)

    .then(data => {
    
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('albums', data.body);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
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




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
