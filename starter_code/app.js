const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '93a0de09e26a49f6b54b02e8ee0993c4',
    clientSecret = 'd67343076c9c43a2863acb15f962d027';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    });

// the routes go here:

//Home route with search artist
app.get('/', (req, res) => {
    res.render('index.hbs');
});

//Route for when artist is selected
app.get('/artist', (req, res) => {
    //Get the name from searchbox
    const theArtist = req.query.searchBoxName;
    spotifyApi
        .searchArtists(theArtist)
        .then(data => {
            //Get object info based on theArtist
            let card = data.body.artists.items;
            //Render all artists with the schema card fron artists.hbs
            res.render('artists.hbs', { card });
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => {
            console.log('The error while searching artists occurred: ', err);
        });
});

app.get('/albums/:artist', (req, res) => {
    //Get artist ID based on selected artist
    let artistId = req.params.artist;
    spotifyApi.getArtistAlbums(artistId).then(
        function(data) {
            //get albums based on ID
            let albums = data.body.items;
            console.log(albums);
            //Render each album from albums.hbs and albums schema
            res.render('albums.hbs', { albums });
        },
        function(err) {
            console.error(err);
        }
    );
});

app.get('/tracks/:album', (req, res) => {
    //Get album ID based on selected album
    let albumId = req.params.album;
    spotifyApi.getAlbumTracks(albumId).then(
        function(data) {
            //get albums based on ID
            let track = data.body.items;
            //Render each track from tracks.hbs and track schema
            res.render('tracks.hbs', { track });
        },
        function(err) {
            console.error(err);
        }
    );
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
