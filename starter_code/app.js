const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = 'b44caf7637654c96a88ebb5ba469b5de',
    clientSecret = '360f907b6726409598f6cf797e41b4d2';

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


//HOME
app.get('/', (req, res) => {
    res.render('index');
});

//ARTIST
app.get('/artist', (req, res) => {
    spotifyApi.searchArtists(req.query.search)
        .then(data => {

            //console.log("The received data from the API: ", data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            let artist = data.body.artists.items;
            console.log(artist[0]);
            res.render('artists', { artist })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })
})

//ALBUMS
app.get('/albums/:artistId', (req, res, next) => {
    //console.log(req.params.artistId);
    spotifyApi.getArtistAlbums(req.params.artistId).then(data => {
        //console.log('Albums information', data);
        let album = data.body.items;
        res.render('albums', { album })
    })
        .catch(err => {
            console.log("The error while searching albums occurred: ", err);
        })

});

//TRACKS
app.get('/albums/:albumId/tracks', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId).then(data => {
        let track = data.body.items;
        console.log(track[0]);
        res.render('tracks', { track })
    })
        .catch(err => {
            console.log("The error while searching album's tracks occurred: ", err);
        })


});





app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
