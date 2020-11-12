require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')

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
});

app.get('/artist-search', (req, res, next)=>{
    console.log(req)
    
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            res.render('artistSearch', {artist: data.body.artists.items})
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res, next)=>{

    const artistId = req.params.id
    

spotifyApi
  .getArtistAlbums(artistId)
  .then(albums => {
    res.render('albums', {artistId: albums.body.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/tracks/:id', (req, res, next) => {

    const albumId = req.params.id

    spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
        console.log(data.body.items)
        res.render('tracks', {albumId: data.body.items})
    })
    .catch((err)=>{
        console.log(err)
    })
})
































app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
