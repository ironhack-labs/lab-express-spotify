const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
// const s = new Spotify();

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

// setting the spotify-api goes here:
const clientId = '967dce8a78214b4484f5910b313ae774',
  clientSecret = 'c56bda4345094ac3a7ac2ee9ec7073cd';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi
  .clientCredentialsGrant()
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
    let artist = req.query.artist
    spotifyApi.searchArtists(artist)
    .then(data => {
        res.render('artists', data.body);
      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get('/albums/:artistId', (req, res, next) => {
  let id = req.params.artistId;
  spotifyApi.getArtistAlbums(id)
  .then(data => {
      res.render('albums', data.body);
    console.log("The received data from the API: ", data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});

app.get('/tracks/:albumId', (req, res, next) => {
  let id = req.params.albumId;
  spotifyApi.getAlbumTracks(id)
  .then(data => {
      res.render('tracks', data.body);
    // console.log("The received data from the API: ", data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
