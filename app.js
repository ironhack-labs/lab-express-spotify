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
    //console.log("index")
    res.render('home')
})

app.get('/artist-search', (req, res) => {

    console.log('Este es el objeto de Query Strings:', req.query)

    spotifyApi

        .searchArtists(req.query.artist)

        .then(data => {

            //console.log('The received data from the API: ', data.body);

            //res.send(data.body.artists.items)
            res.render('artist-search-results', { items: data.body.artists.items })
        })

        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artist_id', (req, res, next) => {

    //console.log("testing id")

    // .getArtistAlbums() code goes here

    const { artist_id } = req.params

    console.log({ artist_id })

    spotifyApi

        .getArtistAlbums(artist_id)

        .then(data => {

            //console.log('The received data from the API: ', data.body);

            //res.send(data.body.items)
            res.render('albums', { albums: data.body.items })
        })

        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/tracks/:album_id', (req, res, next) => {

    console.log("testing id")

    const { album_id } = req.params

    console.log({ album_id })

    spotifyApi

        .getAlbumTracks(album_id)

        .then(data => {

            //console.log('The received data from the API: ', data.body);

            //res.send(data.body.items)
            res.render('tracks', { tracks: data.body.items })
        })

        .catch(err => console.log('The error while searching artists occurred: ', err));

})


app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
