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

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index', {});
})

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.search.toLowerCase())
        .then(resData => {
            let artists = resData.body.artists.items;
            artists = artists.map(artist => {
                // get artist uri code only
                artist.uri = artist.uri.split(":")[2];
                // replace artist without image,
                if (artist.images.length === 0) artist.images = {url : "/images/default_artist.png"};
                else artist.images = artist.images[0];
                return artist;
            });
            res.render('artist-search-results', {artists: artists})
        })
        .catch(error => console.log(error))
})

app.get('/albums/:artistId', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(resData => {
            let albums = resData.body.items;
            albums = albums.map(album => {
                // get album uri code only
                album.uri = album.uri.split(":")[2];
                // replace album without image,
                if (album.images.length === 0) album.images = {url : "/images/default_album.png"};
                else album.images = album.images[0];
                return album;
            });
            res.render('albums', {albums});
        })
        .catch(error => console.log(error));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));