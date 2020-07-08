// module that loads environment variables from a .env file into process.env
//         ^
//         |
require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// ************ require spotify-web-api-node package here: ************
// this package will give you access to the methods to communicate to the DB that holds the data we need
const SpotifyWebApi = require('spotify-web-api-node');

// ************ setting the spotify-api goes here: ********************

// get your credentials from .env file using process.env
// CLIENT_ID and CLIENT_SECRET are the variable names we gave in .env file (don't forget to create .env file!!!)
//      |           |
//      --------------------------------------------|
//                                                  |
const spotifyApi = new SpotifyWebApi({
  //           |
  clientId: process.env.CLIENT_ID, // <-------------|
  clientSecret: process.env.CLIENT_SECRET // <------|
});

// ******************** Retrieve an access token: **********************
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// ***********************************************************************************************************
// ROUTES:
// ***********************************************************************************************************

// ROUTE 1: DISPLAY THE FORM TO USERS SO THEY CAN SEARCH FOR THE ARTISTS

// http://localhost:3000/
app.get('/', (req, res) => res.render('home'));
// ***********************************************************************************************************

// ROUTE 2: SUBMIT THE FORM
// form will be submitted here since we stated so in the form's "action" attribute
// <form action="/artist-search" method="get">
//                 |
//                 V
app.get('/artist-search', (req, res) => {
  //   console.log('what is this: ', req.query);
  spotifyApi
    //  |------> Method provided by the SpotifyWebApi npm packages and helps us to search artists whose name contains the search term
    //  V
    .searchArtists(req.query.theArtistName) // <----- theArtistName is name="theArtistName" in our search form
    .then(data => {
      //   console.log('The received data from the API: ', data.body.artists.items[0]);
      res.render('artist-search-results', { artists: data.body.artists.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

// ***********************************************************************************************************

// ROUTE 3: THE DETAILS OF A SPECIFIC ARTIST BASED ON THE UNIQUE ID (WHICH GETS CAPTURED FROM THE URL)
// http://localhost:3000/albums/123eER56-8Ig009lhY

//                theId => this is placeholder, can be any word,
//                  |      just make sure you use the same word in "req.params.______"
app.get('/albums/:theId', (req, res) => {
  // console.log("Id is: ", req.params.theId);
  spotifyApi
    .getArtistAlbums(req.params.theId)
    .then(data => {
      // console.log('The received data from the API: ', data.body.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('albums', { albums: data.body.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

// ***********************************************************************************************************
// http://localhost:3000/tracks/aaarr554-oeRtRpu7814r
app.get('/tracks/:someId', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.someId)
    .then(data => {
      // console.log('The received data from the API: ', data.body.items);
      res.render('tracks', { tracks: data.body.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

// ALTERNATIVE CAPTURING ID FROM URL USING REQ.QUERY:
// www.some-route/blah?someKey=123456 => this would still be req.query.someKey instead of req.params