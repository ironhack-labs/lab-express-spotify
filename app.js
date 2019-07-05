const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'hbs');

// setting the spotify-api goes here:
const clientId = '70a934dabaa1426791188a753df0b63d',
clientSecret = 'e6f785b2cc1b4e6f85dab1e1157153d1';

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
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.name)
  .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let Art = data.body.artists.items;  
    res.render('artists', { Art })
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    })
});

app.get('/albums/:artist', (req, res) => {

  spotifyApi.getArtistAlbums(req.params.artist)
  .then(data => {
      console.log('Artist albums', data.body.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let Art = data.body.items;  
    res.render('albums', { Art })
    })
    .catch(err => {
      console.log('The error while searching albums occurred: ', err);
    })
})


app.get('/tracks/:albums', (req, res) => {

  spotifyApi.getAlbumTracks(req.params.albums)
  .then(data => {
    console.log('Album Tracks');
  // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  let Art = data.body.items;  
  res.render('tracks', { Art })
  })
  .catch(err => {
    console.log('The error while searching albums occurred: ', err);
  })
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
