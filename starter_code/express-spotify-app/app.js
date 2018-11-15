const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')
const bodyParser = require('body-parser')
var SpotifyWebApi = require('spotify-web-api-node');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

//MiddleWares
app.use(bodyParser.urlencoded({
    extended: true
}));

// ROUTES
//home route
app.get('/', function (req, res) {
    res.render('index');
})

app.get('/album/:artistId', function (req, res) {
    const albumID = req.params.artistId;
    spotifyApi.getArtistAlbums(albumID)
        .then(function (data) {
            res.render('albums', {albums: data.body.items})
        }, function (err) {
            console.error(err);
        });
})


app.get('/track/:trackId', function (req, res) {
    const trackID = req.params.trackId;
    spotifyApi.getAlbumTracks(trackID, { limit: 5, offset: 1 })
        .then(function (data) {
            res.render('tracks', {tracks: data.body.items})
        }, function (err) {
            console.log('Something went wrong!', err);
        });
})

// artist route
app.post('/artists', (req, res) => {
    // console.log(req.body.artist); //FORM INPUT VALUE BEATLES
    spotifyApi.searchArtists(req.body.artist) //BEATLES
        .then(data => {
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            // console.log({artists : data.body.artists.items})
            res.render('artists', {artists: data.body.artists.items})
        })
        .catch(err => {
            // ----> 'HERE WE CAPTURE THE ERROR'
        })

})





// Spotify
// Our Client IDs
var clientId = 'cb74fffa58494113bc75326447991123',
    clientSecret = 'c7291640d54e422ea473da0082268acf';

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });

app.listen(3000, () => console.log('Example app listening on port 3000!'))