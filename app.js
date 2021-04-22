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
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));




    // Our routes go here:


//     Create a route that renders a simple home page. You'll need a basic index route, that renders a home page. On this page, you should have a small search form that has an input field receiving an artist's name and a button that submits the request.

// This form should direct its query to /artist-search (action="/artist-search", method="GET"). The result should be something along these lines but leave styling for the end.

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {
  

  spotifyApi
  .searchArtists(req.query.form)
  .then(data => {
    console.log(data.body.artists.items);
    console.log(data.body.artists.items[0].images)

    res.render('artist-search-results', {
      result: data.body.artists.items
    });
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

});


app.get('/albums/:artistId', (req, res, next) => {

  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log(req.params.artistId)
    console.log(data.body)
    console.log(data.body.items[0].images)


    res.render('albums-results', {
      albums: data.body.items
    });

    // res.render('artist-search-results', {
    //   result: data.body.artists.items
    // });
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

  // .getArtistAlbums() code goes here
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
