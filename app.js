require('dotenv').config();

const { Router } = require('express');
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
//app.get.apply("/",(req, res, next)=>response.sendFile(__dirname + '/views/index.hbs'))
app.get('/', (req, res) => {
    res.render('index');
  });


//QUERY STRING ACCES TO ARTIST NAME DATA
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/artist-search', async (req, res)=>{
    const { artist } = req.query;
    try{
      const data = await spotifyApi.searchArtists(artist)
      console.log(data.body.artists.items)
      res.render('artist-search-results', {artists : data.body.artists.items})
    }
    catch(err){
      console.log(err)
    }
}) 

//ANOTHER WAY TO DO IT
/* app.get('/artist-search', (req, res)=>{
  const { artist } = req.query;
  spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    
    res.render('artist-search-results', {artists : data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
}) 
 */

//GET ALBUMS
app.get('/albums/:artistId', async (req, res) => {
    const { artistId } = req.params;
  try{
    const data = await spotifyApi.getArtistAlbums(artistId)
    //console.log('Albums', data.body.items);
    res.render('albums', {albums : data.body.items})
  }
  catch(err){
    console.error(err)
  }
}); 

app.get('/tracks/:albumId', async (req, res) => {
    const {albumId} = req.params;
  try{
    const data = await spotifyApi.getAlbumTracks(albumId)
    //console.log('Tracks', data.body.items);
    res.render('tracks', {tracks : data.body.items})
  }
  catch(err){
    console.error(err)
  }
}); 

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
