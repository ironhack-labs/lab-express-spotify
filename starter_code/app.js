require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

//Conected
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

// the routes go here: /////////////////////////////////////////////////////////////////////


app.get("/", (req, res) => {
  res.render("index") //index.hbs
})

         //this name is the same we found in "action" in form file index.hbs
app.get("/artists-search", (req, res) => {
  spotifyApi  
  .searchArtists(req.query.artistName) 
  //we use req.query.artistName because artistName is the "name" we use in form in index.hbs file 
  //and req.query because we only are going to use the information that the user are entering in our form in index.hbs file
  .then( data => { //this data is a placeholder and is a response the we give

    // console.log('The received data from the API: ', data)

    res.render('artist-search-results', {artists : data.body.artists.items}) // 'artist-search-results' is the name of our page and
                                                                            //**artists** goes in #each in artist-search-results.hbs
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
})

 //create albums

 app.get('/albums/:anyId', (req, res) => {
  spotifyApi  
  .getArtistAlbums(req.params.anyId)
  .then( data => { 
    res.render('albums', {albums : data.body.items}) //this **albums** goes in #each in albums.hbs
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });

 })

 //Tracks

 app.get('/tracks/:someId', (req, res) => {
  spotifyApi  
  .getAlbumTracks(req.params.someId)
  .then( data => { 
    res.render('tracks', {tracks : data.body.items}) //this **tracks** goes in #each in tracks.hbs
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });

 })



app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);

module.exports = app;