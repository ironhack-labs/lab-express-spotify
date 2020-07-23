require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();
const SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: '16bae2c837f847fa9856c6a48e255a3e',
  clientSecret: '2584e6a24f504fc9853fb8b6ae4f81ff'
    
  });

  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

  app.get('/', (req, res, next)=>
     {
    res.render('homepage')
    })
    

  app.get('/artist-search', (req, res, next) => {
    let {artist} = req.query;
    spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render('artist-search-results', {data:data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
    
});

app.get("/albums/:artistId", (req,res, next) => {

  let {artistId} = req.params;

  spotifyApi
      .getArtistAlbums(artistId)
      .then(data => {
      res.render("albums", {albums:data.body.items})
      })
      .catch(err => console.log('The error occurred: ', err));
});

app.get("/albums/tracks/:albumId", (req,res, next) => {

  let {albumId} = req.params;

  spotifyApi
      .getAlbumTracks(albumId)
      .then(data => {
      res.render("tracks", {tracks:data.body.items})
      })
      .catch(err => console.log('Something went wrong! ', err)
      );
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
