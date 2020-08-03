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

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const artistsData = data.body.artists.items;
            console.log('The received data from the API: ', data.body);
            res.render('artist-search-results.hbs', {artistsData})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId',  (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
        const artistAlbums = data.body.items;
      console.log(`Artist information: ${data.body.items}`);
      res.render('albums.hbs', {artistAlbums})
    })
    .catch(err => console.log(`error while searching for artist albums ${err}`));
  });

  app.get('/tracks/:albumId', (req, res) => {
    console.log(req.params);
    spotifyApi 
        .getAlbumTracks(req.params.albumId)
        .then((data) => {
            const albumTracks = data.body.items;
            console.log(data.body)
            res.render('tracks', {albumTracks})
        })
        .catch(err => console.log('Something went wrong! ', err))
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
