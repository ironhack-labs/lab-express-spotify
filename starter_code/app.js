const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));




// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => { spotifyApi.setAccessToken(data.body['access_token']); })
    .catch(error => { console.log('Something went wrong when retrieving an access token', error); })


// the routes go here:
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res, next) => { res.render('index'); });

app.get('/artists', (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(data => { res.render('artists', { myData: data.body.artists.items }) })
        .catch(err => { console.log("The error while searching artists occurred: ", err) })
});

app.get('/albums/:id', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.id)
        .then(data => { res.render('albums', { myData: data.body.items }) })
        .catch(err => { console.log("The error while searching albums occurred: ", err) })
})

app.get('/tracks/:id', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id, { limit: 5, offset: 1 })
        .then(data => { res.render('tracks', { myData: data.body.items }) })
        .catch(err => { console.log('Something went wrong!', err) })
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));