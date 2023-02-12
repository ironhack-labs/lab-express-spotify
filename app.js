require('dotenv').config(); // I would like to understand what is this

const express = require('express'); // here we point to the "method" we are going to use to build our app - back end
const hbs = require('hbs'); // here we point the method to organize our layout - front end


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

//iteration 1 -- Here we start setting the route for the first page:

app.get('/', (req, res) => {
  res.render('index');
  
});

//Iteration 2 -- Here we have to tell our app that we are going to use this data base and use its own methods to grab the info we need
// our server interacting with the API to access the artists

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      res.render("artist-search-results", {artistsNames: data.body.artists.items} );
    })
      .catch(err => console.log('The error while searching artists occurred: ', err));
    })

//Iteration 3 -- Our server interacting with the API to grab the albums

app.get('/albums/:id', (req, res) => {
  let {id} = req.params;
  spotifyApi
  .getArtistAlbums(id)
  .then((data) => {
      console.log("The received data from the API: ", data.body.items);
      res.render('album', {result: data.body.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

// Our server interacting with the API to grab the tracks

app.get('/tracks/:id', (req, res) => {
  let {id} = req.params;
  spotifyApi
  .getAlbumTracks(id)
  .then((data) => {
      console.log("The received data from the API: ", data.body.items);
      res.render('tracks', {result: data.body.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
