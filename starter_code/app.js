require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');  

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artists', (req, res) => {
  console.log(req.query);
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    let artistsList = data.body.artists.items;
    console.log('The received data from the API: ', data.body, artistsList[0]);
    res.render('artists', artistsList);
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
})

app.get('/albums/:id', (req, res) => {
  // retrieve artist name
  spotifyApi.getArtist(req.params.id)
  .then(data => {
    let artistName = data.body.name;
    // retrieve albums
    spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {
      let albumsArray = data.body.items;
      console.log(albumsArray);
      console.log(albumsArray[0].images)
      res.render('albums', {artistName, albumsArray});
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
})

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
