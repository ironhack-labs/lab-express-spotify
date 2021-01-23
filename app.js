require('dotenv').config();


const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('index.hbs');
});

app.get('/artist-search', (req, res, next) => {
    const artist = req.query.artist

spotifyApi
  .searchArtists(artist)
  .then(data => {
    // console.log('The received data from the API: ', data.body.artists.items);
    const artistData = data.body.artists.items;  
    res.render('artist-search-results', {artistData});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

});
  app.get('/albums/:artistid', (req, res, next) => {
    const artistId = req.params.artistid;
    // res.send(artistId);
    spotifyApi.getArtistAlbums(artistId)
    .then(data => {
        const albumData = data.body.items;
        res.render('albums', {albumData});
    })
    .catch(error => {
        console.log(error)
    });

  });

  app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
    spotifyApi.getAlbumTracks(albumId)
    .then(data => {
        console.log(data.body.items);
        const tracksData = data.body.items;
        res.render('tracks', {tracksData});
    })
    .catch(error => {
        console.log(error)
    });
  });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
