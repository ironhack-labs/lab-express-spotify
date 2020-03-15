require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:


// Our routes go here:

//pagina principal de busqueda

app.get('/', (req, res) => res.render('index'));


//buscamos el artista
app.get('/artist-search', (req, res,next) =>{

  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results', {infoArtist: data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

//buscamos los albums del artista

app.get('/albums/:id', (req,res)=>{

  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(data=> res.render('albums', {data: data.body.items}))
  .catch (err=> console.log('Error in search albums :',err));
})

//mostramos los tracks del artista

app.get('/tracks/:id', (req,res)=>{

  spotifyApi
  .getAlbumTracks(req.params.id)
  .then(data=> res.render('tracks', {tracks: data.body.items}))
  .catch (err => console.log('Error in show tracks', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
