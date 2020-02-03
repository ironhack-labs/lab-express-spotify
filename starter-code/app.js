require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
//                                                        require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//                                                      setting the spotify-api goes here: > (=..=)
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here
// Homepage
app.get('/', (request, response) => {
  console.log('/');
  response.render('home.hbs');
});

//>>>>>>>>>>>>>> Get artists list <<<<<<<<<<<<<<<<
app.get('/artist-search', (request, response) => {
  spotifyApi
    .searchArtists(request.query.artistsearch)
    .then(data => {
      //                      console.log('The received data from the API: ', data.body);
      //                      response.send(data.body.artists.items);
      response.render('artists.hbs', { artists: data.body.artists.items });
    })
    .catch(err => console.log(err));
});

//<<<<<<<<<<<<< Get albums of an artist >>>>>>>>>>>>>>
app.get('/albums/:artistId/', (request, response) => {
  spotifyApi
    .getArtistAlbums(request.params.artistId)
    .then(data => {
      //                      console.log('The received data from the API: ', data.body);
      response.render('albums.hbs', { albums: data.body });
    })
    .catch(err => console.log(err));
});

//>>>>>>>>>>>>> Get tracks in an album <<<<<<<<<<<<<<<<<
app.get('/tracks/:albumId', (request, response) => {
  //                      console.log('Tracks from the Api ', request.params.albumId);
  spotifyApi
    .getAlbumTracks(request.params.albumId)
    .then(data => {
      //                    console.log('Recieved album tracks from Api', data.body);
      response.render('tracks.hbs', { tracks: data.body });
    })
    .catch(err => console.log(err));
});

//<<<<<<<<<<<<<<<<<<<< Listen >>>>>>>>>>>>>>>>>>>>>
app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
