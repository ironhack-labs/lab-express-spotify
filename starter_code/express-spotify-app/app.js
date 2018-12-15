const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')

var SpotifyWebApi = require('spotify-web-api-node');


// Remember to paste your credentials here
var clientId = 'a3676c8b791c49048c222a84f7fd770c',
    clientSecret = '54708907189e407e8c5f6eb2328f9374';

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//controllers
app.get('/', function (req, res) {
    console.log(req)
    res.render('index.hbs')
})


app.get('/artists', function (req, res) {
    console.log(req)
    spotifyApi.searchArtists(req.query['artist-name'])
        .then(data => {
            data.body.artists.items.forEach((a) => {
                a.image = a.images[0]
            })
            console.log(data.body)
            res.render('artists', { artists: data.body.artists.items })

        })
        .catch(error => {
            console.log(error)
        });
});



// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });


//starting our app
app.listen(3000, () => console.log('Example app listening on port 3000!'))