require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

// Configure hbs
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')

hbs.registerHelper('dotdotdot', function(str) {
    if (str.length > 25)
        return str.substring(0,25) + '...';
    return str;
});

// setting spotify-api
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



// Home
app.get('/', (req, res, next) => {
    let promise1 = spotifyApi.getCategories({ limit : 6, offset: 0, country: 'ES' })
    let promise2 = spotifyApi.getFeaturedPlaylists({ limit : 12, offset: 0, country: 'ES' })

    Promise
        .all([promise1, promise2])
        .then(data => {
            res.render('home', { title: 'Spotify api', playlists:  data[1].body.playlists.items, categories: data[0].body.categories.items })
        })
        .catch(err => console.log('The error while searching playlists occurred: ', err));
})

app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            res.render('artists', { artists: data.body.artists.items, name: req.query.artist, title: 'Artistas - Resultados para su búsqueda'})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            res.render('albums', { albums: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:id', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(data => {
            res.render('tracks', { tracks: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


// Playlists
app.get('/playlist/:id', (req, res, next) => {
    spotifyApi
        .getPlaylist(req.params.id)
        .then(function(data) {
            res.render('playlist', { playlists:  data.body.tracks.items})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/category/:id', (req, res, next) => {
    spotifyApi.getPlaylistsForCategory(req.params.id, { limit: 36, country: 'ES'})
    .then(function(data) {
        res.render('category', { playlists:  data.body.playlists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`My Spotify project running on port ${port} 🎧 🥁 🎸 🔊`));
