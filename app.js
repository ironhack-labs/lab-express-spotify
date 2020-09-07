require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


    
// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res)=>{
    res.render('home', {})
})

app.get('/artist-search', (req, res)=>{
    //console.log (req.query.title)
    spotifyApi
    .searchArtists(req.query.title)
    .then(data => {
        res.render('artist-search-results', {artist:  data.body.artists.items});
    })
    .catch (err => {console.log(err)})
})

app.get('/albums/:id', (req, res, next)=>{
  const id = req.params.id;  
  console.log(req.params.id)
  spotifyApi
    .getArtistAlbums(id)
    .then(data => {  
      res.render('albums', {album: data.body.artists.uri});
      console.log(data.body.artists.uri)
    })
    .catch(err => {console.log(err)})
})

/*spotifyApi
  .searchArtists(/artist-search)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));*/

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
