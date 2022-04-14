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
})

app.get('/artist-search', (req, res) => {

    const { artist } = req.query

    spotifyApi
        .searchArtists(`${artist}`)
        .then(data => {
            // console.log('The received data from the API:', data.body.artists.items)

            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'


            const artistInfo = data.body.artists.items

            // artistInfo.forEach(artista => {
            //     console.log('The received images from the API:', artista.images)

            // });

            res.render('artist-search-results', { artistInfo })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:id', (req, res) => {

    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(
            data => {
                // console.log('The received ALBUMS from the API:', data.body.items)

                // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'


                const artistAlbums = data.body.items



                res.render('artist-albums', { artistAlbums })
            })
        .catch(err => console.log('The error while searching albums occurred: ', err));
})


app.get('/tracks/:id', (req, res) => {

    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(
            data => {
                console.log('The received Tracks from the API:', data.body.items)

                // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'


                const albumTracks = data.body.items



                res.render('album-tracks', { albumTracks })
            })
        .catch(err => console.log('The error while searching albums occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
