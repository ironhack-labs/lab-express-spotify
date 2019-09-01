const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const clientId = 'e16a971381df48ecb7829b6ab244fd2e',
    clientSecret = '0ba5ab30e7124e1894ff9edb9bebb67e';

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

app.get('/artists', (req, res, next) => {
    let artistName = req.query.name // localhost:3000/artists?name=blah
    spotifyApi.searchArtists(artistName)
        .then(data => {

            console.log("The received data from the API: ", data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artists', data);
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })
});

app.get('/albums/:artist_id', (req, res, next) => {
    let artistId = req.params.artist_id // localhost:3000/albums/oi12z38162tgd

    spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            console.log('Artist albums', data.body.items);
            res.render('albums', data); // baut unser HTML aus den Daten die wir brauchten
        }, function (err) {
            console.error(err);
        });

});

app.get('/albums/:artist_id', (req, res, next) => {
    let artistId = req.params.artist_id // localhost:3000/albums/oi12z38162tgd
    let albumId =
        spotifyApi.Constr.getAlbumTracks(albumId)
            .then(data => {
                console.log('Artist albums', data.body.items.tracks);
                res.render('albums', data); // baut unser HTML aus den Daten die wir brauchten
            }, function (err) {
                console.error(err);
            });

});



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
