const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')
const app = express();
const bodyParser = require('body-parser')

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res, next) => {
    res.render('index');

});

app.post('/artist', (req, res, next) => {

    let search = req.body.busca;

    spotifyApi.searchArtists(search)
        .then(data => {
            // console.log(data.body.artists.items[0].id);
            let items = data.body.artists.items;
            res.render('artist', { items });
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })

});

app.get('/albums/:artistId', (req, res, next) => {
    let search = req.params.artistId;
    spotifyApi.getArtistAlbums(search)
        .then(function (data) {
            // console.log(data.body.items);
            let albums = data.body.items;
            res.render('albums',{albums});
        }, function (err) {
            console.error(err);
        });
})

// Remember to insert your credentials here
const clientId = '464408e226ea494aaa688215dad64cc4',
    clientSecret = 'edd73fb0a6db401f8d50a85d6a5bed3e';

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



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
