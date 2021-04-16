require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// retrieve an access token:
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', (req,res) => {
    // res.send(req.query.q)
    spotifyApi
        .searchArtists(req.query.q)
        .then(data => {
            // console.log('The received data from the API: ', data.body);
            res.render('artist-search-results', { artistList: data.body.artists.items})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req,res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then((albumData) => {
            // console.log(data.body.items[0].artists[0].name);
            spotifyApi
            .getArtist(req.params.artistId)
                .then((artistData) => {
                    res.render('albums', { albums: albumData.body.items, artistName: artistData.body.name})
                })
            // res.render('albums', { albums: data.body.items})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/tracks/:albumId', (req,res) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then((trackData) => {
            spotifyApi
            .getAlbum(req.params.albumId)
                .then((albumData) => {
                    res.render('tracks', { tracks: trackData.body.items, albumName: albumData.body.name})

                })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
