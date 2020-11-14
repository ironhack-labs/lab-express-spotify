require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const dataFromAPI = data.body.artists.items;
            const artists = [];
            dataFromAPI.forEach((artist) => {
                artists.push({
                    img: artist.images[1],
                    name: artist.name,
                    id: artist.id,
                });
            });
            res.render('artist-search-results', { artists });
        })
        .catch(err => res.send(`The error while searching artists occurred: ${err}`));
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            const dataFromAPI = data.body.items;
            const albums = [];
            dataFromAPI.forEach((album) => {
                albums.push({
                    cover: album.images[1],
                    name: album.name,
                    id: album.id,
                });
            });
            res.render('albums', { albums });
        })
        .catch(err => res.send(`The error while searching albums occurred: ${err}`));
});

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            const dataFromAPI = data.body.items;
            const tracks = [];
            dataFromAPI.forEach((track) => {
                tracks.push({
                    name: track.name,
                    preview: track.preview_url,
                });
            });
            res.render('tracks', { tracks });
        })
        .catch(err => res.send(`The error while searching tracks occurred: ${err}`));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
