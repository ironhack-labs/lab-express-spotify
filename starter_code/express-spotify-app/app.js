const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerPartials(__dirname + '/views/partials');

const SpotifyWebApi = require('spotify-web-api-node');

const clientId = 'da9aa0e9ff6e4218b4da71958c55161f',
    clientSecret = '32d76dd61b624e938152360c256e7095';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});


spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });


app.get('/', (req, res, next) => {
    res.render('index');
});

app.post('/artists', (req, res, next) => {
    let artist = req.body.artist;
    spotifyApi.searchArtists(artist)
        .then(data => {
           
            const artists = data.body.artists.items;
            console.log(artists)
            res.render('artists', { artists })
        })
        .catch(err => {
            console.log(`Error en el Seachr a la api ${err}`);
        })
})


app.listen(3000);