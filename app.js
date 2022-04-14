require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get('/', (req, res) => {

    res.render('index');
    // res.send("hola")
})

app.get('/artis-search-results', (req, res) => {


    const { arti } = req.query

    spotifyApi
        .searchArtists(arti)
        .then(data => {
            const artis_info = data.body.artists.items
            res.render("artis-search-results", { artis_info });
            // ----> 'AQUÍ QUEREMOS HACER DESPUÉS DE RECIBIR LOS DATOS DE LA API' 
        })
        .catch(err => console.log('Se produjo un error al buscar artistas:', err));


})

app.get('/albums/:id', (req, res) => {

    const { id } = req.params

    spotifyApi
        .getArtistAlbums(id)
        .then(album => {
            const album_info = album.body.items
            console.log(album_info)
            res.render('albums', { album_info })
        })
        .catch(error => console.log(error));
});

app.get('/tracks/:id', (req, res) => {

    const { id } = req.params

    spotifyApi
        .getAlbumTracks(id)
        .then(album => {
            const album_info = album.body.items
            console.log(album_info)
            res.render('tracks', { album_info })
        })
        .catch(error => console.log(error));
});

app.listen(3000, () => console.log('My Spotify project running on port 5005 '));
