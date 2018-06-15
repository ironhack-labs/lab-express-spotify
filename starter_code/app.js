// app.js
const express = require('express')
const app = express()

const hbs = require('hbs')
const path = require('path')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node');
const prettyJson = require('prettyjson')
const morgan = require('morgan')

app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// credentials are optional
// Remember to paste here your credentials
var clientId = '4e671921b4e840faa5c584d37b13886f',
    clientSecret = 'fe26440bb1824e8e9309161949348436';

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


    app.get('/', (req, res, next) => {
        res.render('index');
      });
      
    app.get('/artists', (req, res, next) => {

            let artist = req.query.artist;
            spotifyApi.searchArtists(artist)
            .then(data => {
            console.log('Search artists by ', data.body.name);
            res.render('artists', data.body.artists.items);
        })
        .catch(err => {
            console.log('You fucked up, Asshole', err);
        })
    });
               
    app.get('/artists/:id', (req, res, next) => {
        res.render("/artists/:id")
        spotifyApi.getArtistAlbums(data.body['needToken'])
         .then(data => { console.log('Artist albums', data.body);})
         .catch(err => { console.error(err);})
      });
    



app.listen(3000, () => console.log('Skadi Solutions is listening to you on port 3000! I would not visit porn websites'))