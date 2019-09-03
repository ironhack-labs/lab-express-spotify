const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// hbs.registerPartials(__dirname + '/views/partials');
// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = 'dc33dc94e1f04fa39010672f2f62f3f6',
    clientSecret = 'fc5dc5a7955f481bade042ea5e28df0b';

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

app.get('/', function (req, res) {
    res.render('index')
})
app.get('/artists', function (req, res) {
    console.log('artist:', req.query.artistName)


    spotifyApi.searchArtists(req.query.artistName) // localhost:3000/artists?artistName=blah
        .then(data => {
            res.render('artists', { data })
            console.log("The received data from the API: ", data.body.artists.artistName);
            console.log("The received data from the API: ", data.body.artists.images);
            // res.send(data)
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })



        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })

})
app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId) // localhost:3000/albums/1236i61523itei765
        .then(data => {
            res.render('albums', { data })
            // res.send(data)
        });
})

app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 })
        .then(data => {
            res.render('tracks', { data })
            // res.send(data)
        })

});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
