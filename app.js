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

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (req, res, next) => {
    res.render('home.hbs')
})

app.get('/artist-search', (req, res, next) => {
    const searchText = req.query.name
    spotifyApi
        .searchArtists(searchText)
        .then(data => {
            // console.log('The received data from the API: ', data.body.artists.items);
            res.render('artist-search-results.hbs', { artists: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res, next) => {
    const idArtist = req.params.artistId
    spotifyApi.getArtistAlbums(idArtist)
        .then(data => {
            console.log('The received data from the API: ', data.body.items);
            res.render('albums.hbs', { albums: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));


});

app.get('/tracks/:albId', (req, res, next) => {
    const Id = req.params.albId;

    spotifyApi.getAlbumTracks(Id)
        .then(data => {
            res.render('tracks', { tracks: data.body.items });
        })
        .catch(err => console.log('Error fetching album tracks: ', err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
