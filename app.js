require('dotenv').config();

const { query } = require('express');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
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
app.get('/', (req, res, next) => {
    res.render("index");
})

app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const info = data.body.artists.items;
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artist-search-results', { arrOfArt: info })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:name/:artistId', (req, res, next) => {
    //console.log(req.params.name);
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            const albums = data.body.items;
            const header = req.params.name;
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('albums', { arrOfArt: albums, albumsPageTitle: `Albums for: ${header}`})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            const tracks = data.body.items;
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('tracks', { arrOfArt: tracks })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
