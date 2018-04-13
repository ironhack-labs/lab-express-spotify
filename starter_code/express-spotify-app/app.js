const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');

var SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials')

app.get('/', (req, res, next) => {
    res.render("index")
});

app.get('/artists', (req, res, next) => {
    let search = req.query.artists;
    spotifyApi.searchArtists(search)
        .then(data => {
            res.render('artists', { data });
            console.log(data);
            console.log(data.body.artists.items[0])
        })
        .catch(err => {
            console.log("error")
        })
})

app.get('/albums/:artistId', (req, res) => {

    let artistID = req.params.artistId;
    spotifyApi.getArtistAlbums(artistID)
    .then(data => {
      console.log('Artist albums', data.body);
      res.render("albums",{data});
  
    })
    .catch(err => {
        console.log("error")
    });
  
  })
  

//app.use(express.static(express.join(__dirname, './public')));



// Remember to paste here your credentials
var clientId = '1e58a16304a14b7a8ccd229cafeb14c9',
    clientSecret = '85e7dd3f93f74c43bc61a5ab5f77afbb';

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

app.listen(3000);