require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
// hbs.registerPartials(__dirname + '/views/partials');



// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });

// the routes go here:
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artists', (req, res) => {
    // res.send(req.query.artist)
    let searchedArtist = req.query.artist

    spotifyApi
        .searchArtists(searchedArtist)
        .then(data => {
            // console.log("The received data from the API: ", data.body.artists.items);
            let artistsArr = data.body.artists.items;
            let artistsData = { artistsArr }
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artists', artistsData)
            // console.log(artistsArr)
            // console.log(data.body.artists.items[0].images)
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });

})

app.get('/albums/:artistId', (req, res) => {
    let artId = req.params.artistId;
    // console.log(artId)
    spotifyApi.getArtistAlbums(artId)
        .then(function (data) {
            let albumsArr = data.body.items;
            let albumsData = { albumsArr };
            res.render('albums', albumsData);
        }, function (err) {
            console.error(err);
        });
})

//   "0IYjMBLA9PgtXyRPlLmTDE"

app.get('/albumTracks/:albumId', (req, res) => {
    let albId = req.params.albumId;
    // console.log(albId)
    spotifyApi.getAlbumTracks(albId    /* , { limit: 5, offset: 1 } */)
        .then(function (data) {
            let tracksArr = data.body.items;
            let tracksData = { tracksArr };
            // console.log(tracksArr);
            // console.log("BREAKKKKKKKK")
            res.render('tracks', tracksData)
        }, function (err) {
            console.log('Something went wrong!', err);
        });

    // spotifyApi.getArtistAlbums(albumId)
    //     .then(function (data) {
    //         let albumsArr = data.body.items
    //         let albumsData = { albumsArr }
    //         res.render('albums', albumsData);
    //         // res.render('')
    //     }, function (err) {
    //         console.error(err);
    //     });
})

app.listen(3005, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
