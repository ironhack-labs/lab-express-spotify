const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');

hbs.registerPartials(__dirname + '/views');

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
  clientId : '0ec11311f11e4b3989b838038a9a917a',
  clientSecret : '136bd00bea1f447bb74836abf9978dab'
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, (err) => {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res) => {    
    res.render('index');    
});

app.get('/artists', (req, res) => {
    const artist = req.query.artist;

    spotifyApi.searchArtists(artist)
    .then(data => {
            console.log(data.body.artists.items[0].images[0].url);
            res.render('artists', {
                artists: data.body.artists.items
            });
        });
});

app.get(`/artists/:artistid`, (req, res) => {
    const artistid = req.params.artistid;
    res.send(artistid)
})

app.listen(3000, () => console.log('ready'));