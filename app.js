require('dotenv').config();

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

app.get('/', (req, res) => {
    res.render('index', {title: 'Home'})
}),

app.get("/artist-search", (req, res) =>{
    const objetoDelQuery = req.query 
    const artista = objetoDelQuery.artist

    console.log(req.query);

    spotifyApi
    .searchArtists(artista)
    .then(data => {
        console.log('The received data from the API: ', data.body.artists.items)
        res.render('artist-search-results', data.body.artists)//Sin items?
      })
    .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    const objetoDelParam = req.params 
    const artistaId = objetoDelParam.artistId
    console.log(req.params)
    spotifyApi
    .getArtistAlbums(artistaId)
    .then(data => {

        res.render('albums', data.body)
      })
    .catch(err => console.log('The error while searching album occurred: ', err));

});
  
app.get('/tracks/:albumId' ,(req, res, next) => {
    const objetoDelParam = req.params 
    const albumId = objetoDelParam.albumId
    console.log(req.params)//duda
    spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {

        res.render('tracks', data.body)
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));



