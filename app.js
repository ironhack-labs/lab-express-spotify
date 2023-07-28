require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/public/views');
app.use(express.static(__dirname + '/public'));


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (req,res)=>{
    res.render('index')

})
app.get('/albums/:id', (req, res, next) => {
    const artistId = req.params.id;
  
    
    spotifyApi
      .getArtistAlbums(artistId)
      .then((data) => {
        const albums = data.body.items;
        
        const artistName = albums.length ? albums[0].artists[0].name : 'Unknown Artist';
        res.render('albums', { albums, artistName });
      })
      
      .catch((err) => {
        console.log('error', err);
        next(err);
      });
  });
  app.get('/tracks/:id', (req, res, next) => {
    const albumId = req.params.id;
  
    
    spotifyApi
      .getAlbumTracks(albumId)
      .then((data) => {
        const tracks = data.body.items;
        res.render('tracks', { tracks });
      })
      .catch((err) => {
        console.log('Error ', err);
        next(err);
      });
  })
app.get('/artist-search', (req,res)=>{
    const searchQuery = req.query.artist;
    spotifyApi
    .search(searchQuery, ['artist'])
    .then((data)=>{
        const artists = data.body.artists.items;
        res.render('search',{artists})
    })
    .catch(err=>{
        console.log(err)
    })
    

})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
