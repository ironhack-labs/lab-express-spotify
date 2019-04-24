const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

console.log(process.env.id)

// setting the spotify-api goes here:
const clientId = process.env.id,
    clientSecret = process.env.secret;

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
app.get('/', (req, res, next) => {
    res.render('index');
});


//artist query
app.get('/artists', (req, res, next) => {
    spotifyApi.searchArtists(req.query.search)
        .then(data => {
            // console.log("The received data from the API: ", data.body.artists.items);
            res.render('artists', { items: data.body.artists.items })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })
})


//albums query
app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            res.render('albums', { items: data.body.items });
        })
        .catch(err => {
            console.log('error', err);
        });
});

//tracks query
app.get('/tracks/:tracksId', (req, res, next) => {
    console.log("getting track info <<<<<<<<<<<<<<<<<<<<<<<< SS");

    spotifyApi.getAlbumTracks(req.params.tracksId)
        .then(data => {
            console.log('-----------------------------------------------', data.body)
            res.render('tracks', { items: data.body.items });
        })
        .catch(err => {
            console.log('error', err);
        });
});




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
