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
app.get('/artist-search', (req, res) => {
    // Busqueda de artistas

    // console.log('ART', artistaABuscar);
    let artistas;
    const { nombre } = req.query;
    spotifyApi
        .searchArtists(nombre)
        .then(data => {
            artistas = data.body.artists.items;
            // res.json(data.body.artists);
            // console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .then(() => {
            // console.log('ARTISTAS CON SINCRONIZAR -> ', artistas);
            res.render('artist-search', { artistas, nombre });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    // Busqueda de albums de este artistas
    // spotifyApi.getArtistAlbums('33tFkBLsl6f8TjKkV0uF0C')
    //     .then(function (data) {
    //         console.log('Artist albums', data.body.items[0]);
    //     }, function (err) {
    //         console.error(err);
    //     });
});


app.get('/home', (req, res) => {
    // artistaBuscar = req.query;
    res.render('home');
})

app.get('/albums/:id', (req, res) => {

    const { id } = req.params;
    // const id = req.params.id;
    let albums;
    // console.log(id);
    spotifyApi.getArtistAlbums(id).then((data) => {
        albums = data.body.items;
    }).then(() => {
        res.render('albums', { albums });
    });

});

app.get('/viewTrack/:id', (req, res) => {
    // req.params = albumId;
    const { id } = req.params;
    let musics;
    spotifyApi.getAlbumTracks(id, { limit: 5, offset: 1 })
        .then(function (data) {
            // console.log(data.body);

            musics = data.body.items;
            // res.json(musics);

        }).then(() => {
            res.render('view-tracks', { musics });
        });
});
// app.get('/id:', (req, res) => {
//     console.log('id', req.params.id);
// })

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
