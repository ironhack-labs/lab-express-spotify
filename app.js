require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')

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
  res.render('home-page')  
})

app.get('/artist-search', (req, res, next) =>{
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      //console.log('The received data from the API: ', data.body.artists.items); 
      res.render('artists', { artists: data.body.artists.items })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then( data =>{
        const albums = [...data.body.items]
        //console.log(albums)
        res.render('albums', {albums: albums})
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/tracks/:id', (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then(data => {
      const tracks = [...data.body.items]
      console.log(tracks)
      res.render('trackInformation', {tracks: tracks})
    })
    .catch(err => console.log('The error while searching track occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
