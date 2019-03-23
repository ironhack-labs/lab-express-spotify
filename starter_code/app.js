const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const clientId = '87161aaf56c54626ac9593a1ddee64e4',
    clientSecret = 'b7f88181346b4aa08635fb98ffa44c48';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })

// the routes go here:

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/artists', (req, res) => {
    spotifyApi.searchArtists(req.query.search)
        .then(data => {
            res.render('artists', {
                artist: data.body.artists.items
            })
            console.log("The received data from the API: ", data.body.artists.items);
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })

});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log(data)
            res.render('albums', {
                albums: data
            })
            console.log('Artist albums', {
                albums: data.body
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/tracks/:albumId', (req, res, next) => {

    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log(data)
            res.render('tracks', {
                tracks: data
            })
        })
        .catch(err => {
            console.log(err);
        });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));