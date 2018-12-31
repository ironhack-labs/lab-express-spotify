const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3000;



// Remember to paste your credentials here
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials')

app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then (data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, (err) => {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res, next) => {
    res.render('index');
})

app.get('/artist', (req, res, next) => {
    const artist = req.query.artist;

    spotifyApi.searchArtists(artist)
        .then(data => {
            res.render('artists', { artists: data.body.artists.items })
        })
        .catch(err => res.send(err))

});

app.get('/artists/:artistId', (req, res, next) => {
    const artist = req.params.artistId

    spotifyApi.getArtistAlbums(artist)
        .then(data => {
            res.render("albums", { albums: data.body.items })
        })
        .catch(err => res.send(err))

});

app.get('/albums/:id', (req, res, next) => {
    const album = req.params.id

    spotifyApi.getAlbumTracks(album)
        .then(data => {
            res.render("tracks", { tracks: data.body.items })
        })
        .catch(err => res.send(err))

});

app.listen(PORT, () => {
    console.info(`App listen at ${PORT} port`)
})
