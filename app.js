require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const { restart } = require('nodemon');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
    });

spotifyApi.clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get('/', (req, res, next) => {
    res.render('index');
  });

app.get('/artist-search', (req,res, next) => { 
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        //console.log('The received data from the API: ', data.body);
        let items = data.body.artists.items; 
        res.render ('artist-search-results', {items});
        })
      .catch(err => console.log(err))
});

app.get('/albums/:artistId', (req, res, next) => { 
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then (data => {
        console.log('artist albums:', data.body);
        res.render ('albums', {albums:data.body.items})
        })
      .catch(err => console.log(err));
})

app.get("/albums/:albumId/tracks", (req, res, next) => {
    //console.log('artist tracks:', data.body);
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(data => {
            const tracks = data.body.items;
            res.render('tracks', {tracks});
        })
        .catch(err => console.log(err));
})
app.listen(4000, () => console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊'));
