require('dotenv').config();

const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const hbs = require('hbs');

const app = express();

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

//Settings

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));




// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('home');
    //next()
});

app.get('/artist-search', (req, res, next) => {

    spotifyApi
        .searchArtists(req.query.artist /*'HERE GOES THE QUERY ARTIST'*/ )
        .then(data => {
            //console.log('The received data from the API: ', data.body.artists.items /*data.body*/ );
            //console.log(data.body.artists.items)

            //console.log('The received data from the API: ', JSON.stringify(data.body));



            res.render('artist-search-results', {
                data
            });

            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

    //router


});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {

            console.log('The albums received data from the API: ', JSON.stringify(data.body));

            //sacar los datos

            res.render('albums', {
                data
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:albumId', (req, res, next) => {

    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {

            console.log('The albums received data from the API: ', JSON.stringify(data.body));

            //sacar los datos

            res.render('tracks', {
                data
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));