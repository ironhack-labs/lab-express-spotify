require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();


// require spotify-web-api-node package here:


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
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

app.get('/', (req, res, next) => res.render('index'));

app.get('/artist-search', (req, res, next) => {
   spotifyApi.searchArtists(req.query.artist)
 //  .then (data => console.log(data))
  .then (data => {res.render("artist-search-results", {data});
//          console.log('The received data from the API: ', data.body.artists.items);
        })
  .catch(err => console.log('The error while searching artist albums occurred: ', err));})



app.get("/albums/:id", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.id)
 // .then (data => console.log(data.body.items))
  .then (data => data.body.items)
  .then (data => res.render("albums", {data}))
})



app.get("/tracks/:id", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.id)
  .then (data => {console.log(data.body.items);
                   return data.body.items})
   .then (data => res.render("tracks", {data}))
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
