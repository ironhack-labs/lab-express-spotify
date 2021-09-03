require('dotenv').config();

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
const accessToken = spotifyApi.clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/', (req, res) => {
    accessToken;
    res.render('index' , { doctitle : 'home'})
})

app.get('/artist-search', (req, res)=>{
    accessToken;
    const artistName = req.query.name;
    spotifyApi
  .searchArtists(artistName)
  .then(data => {
    const searchRes = data.body.artists.items;
    res.render('artist-search', { results :searchRes, doctitle:'Artists Search'})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res)=>{
    accessToken;
    const artistId = req.params.artistId
    spotifyApi.getArtistAlbums(artistId)
    .then(data => {
          const albumsArr = data.body.items
          console.log(albumsArr[0].artists[0].id);
          res.render('albums', {albums : albumsArr, doctitle : 'Albums'} )
        })
    .catch(err => console.log('The error while searching albums occurred: ', err));
})

app.get('/albums/:artistId/:albumId', (req, res) => {
    accessToken;
    const albumId = req.params.albumId;
    console.log(albumId);
    spotifyApi.getAlbum(albumId)
        .then(data => {
          const tracks = data.body.tracks;
          console.log(tracks);
        //   res.render('tracks', {albums : albumsArr, doctitle : 'Albums'} )
        })
        .catch(err => console.log('The error while searching track occurred: ', err));
    });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
