require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:


const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const SpotifyWebApi = require("spotify-web-api-node");

// the routes go here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });


app.get('/', (req, res, next) => {
    res.render('index');
});
//   app.get('/', (req, res, next) => {
//     res.render('layout');
//   });
app.get('/artists', (req, res, next) => {

    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {

            // console.log(req.query)
            // console.log(data)
            // console.log("The received data from the API: ", data.body);
            let results = data.body
            console.log(results.artists.items)
            res.render('artists', {results});
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
});
app.get('/albums/:albumId', (req, res, next)=>{
    spotifyApi.getArtistAlbums(req.params.albumId).then((data) => {
        console.log('artist albums', data.body.items[0]);
        res.render('albums', {results: data.body.items})
    }).catch(err=>{
        console.log("the error", err)
    })
    console.log(req.params)
    // res.render('albums')
})

app.get('/tracks/:tracksId', (req, res, next)=>{
    spotifyApi.getAlbumTracks(req.params.tracksId).then((data) => {
        console.log('album tracks', data.body.items[0]);
        res.render('tracks', {results: data.body.items})
    }).catch(err=>{
        console.log("the error", err)
    })
    console.log(req.params)
    // res.render('albums')
})
// // the routes go here:
// const spotifyApi = new SpotifyWebApi({
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET
//   });

// Retrieve an access token
//   spotifyApi
//     .clientCredentialsGrant()
//     .then(data => {
//       spotifyApi.setAccessToken(data.body["access_token"]);
//     })
//     .catch(error => {
//       console.log("Something went wrong when retrieving an access token", error);
//     });


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));