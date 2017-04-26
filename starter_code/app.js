const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

app.get('/', (request, response, next) => {
    response.render('index');
});

app.get('/artist', (request, response, next) => {
    spotify.searchArtists(request.query.artist, {}, (err, data) => {
        if (err) throw err;

        let artists = data.body.artists.items;

        response.render('artists', { artists });
    });
});

app.get('/albums/:artistId', (request, response, next) => {

    let artistId = request.params.artistId;

    spotify.getArtistAlbums(artistId, {}, (err, data) => {
        if (err) throw err;

        let albums = data.body.items;

        response.render('albums', { albums });
    });
});

app.get('/tracks/:albumId', (request, response, next) => {

    let albumId = request.params.albumId;

    spotify.getAlbumTracks(albumId, {}, (err, data) => {
        if (err) throw err;

        let tracks = data.body.items;

        response.render('tracks', { tracks });
    });
});

app.listen(3000, () => {
    console.log("Server started and listening on port 3000");
});
