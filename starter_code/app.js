const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.urlencoded({ extended: true }));

// Remember to paste here your credentials
const clientId = '648aa623157a4caba3b8d1e90d3ad33d';
const clientSecret = 'd467fde767834e8686fd281cd0d30dbd';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artists', (req, res, next) => {
    const artista = req.query.artist;
    console.log(req.query.artist);
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        //----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        //console.log('Search artists by ', data.body.artists);
        console.log('Search artists by ', data.body.artists.items);
        res.render('artists', {artists: data.body.artists.items});
    })
    .catch(err => {
        //----> 'HERE WE CAPTURE THE ERROR'
        console.log(err);
    })
})

app.listen(3000);
