const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:

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

app.get('/', (req, res, next)=>{
    res.render('home')
})

app.get('/artist-search', (req, res, next)=>{
    // console.log("Artist-Search")
    const search = req.query.search
    spotifyApi
    .searchArtists(search)
    .then(data =>{
      const artistSearch = data.body.artists.items  
      // console.log('the received data from the API: ', artistSearch) 
      res.render('artist-search-results', {artistSearch})
        
    })
    .catch((err)=>{
      console.log(err)
      res.send(err)
    })
})

app.get('/albums/:artistId', (req, res, next)=>{
    const id = req.params.artistId
    spotifyApi
    .getArtistAlbums(id)
    .then((data)=>{
      const albums = data.body.items
      res.render('albums', {albums})
    })
    .catch((err)=>{
      console.log(err)
      res.send(err)
    })
})

app.get('/tracks/:albumId', (req, res, next)=>{
    const albumId = req.params.albumId
    spotifyApi
    .getAlbumTracks(albumId)
    .then((data)=>{
      const tracks = data.body.items
      res.render('tracks', {tracks})
    })
    .catch((err)=>{
      console.log(err)
      res.send(err)
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
