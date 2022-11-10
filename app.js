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
    res.render('index')
});


app.get('/artist-search', (req, res) => {

    const { artistName } = req.query
    // console.log(artistName)

    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            // console.log('The received data from the API: ', data.body.artists.items)
            const artist = data.body.artists.items
            // artist.forEach(elem => {
            //     console.log(elem.images)
            // })
            res.render('artist-search-results', { artist })//the syntax {artist : artist} is eaquals to {artist}
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})


app.get('/albums/:artist_id', (req, res) => {

    // res.send('test albums')

    const { artist_id } = req.params

    spotifyApi
        .getArtistAlbums(artist_id, { limit: 10, offset: 20 })
        .then(
            function (data) {
                // console.log('Album information', data.body)
                const album = data.body.items
                res.render('albums', { album })
            },
            function (err) {
                console.error(err);
            }
        );

})

app.get('/tracks/:tracks_id', (req, res) => {

    // res.send('test tracks')

    const { tracks_id } = req.params

    spotifyApi.getAlbumTracks(tracks_id, { limit: 5, offset: 1 })
        .then(function (data) {
            console.log(data.body)
            const tracks = data.body.items
            res.render('tracks', { tracks })

        }, function (err) {
            console.log('Something went wrong!', err);
        });

})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
