
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan(`Request Method: :method, Request URL: :url, Response Time: :response-time(ms)`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');






var SpotifyWebApi = require('spotify-web-api-node');
var clientId = 'a82a3712c00a47d787ca446704ce2c50', clientSecret = '61847177097e4df4a33b181f896a1f21';
var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });


// our first Route:
app.get('/', (req, res, next) => {
    res.render('index');
  });

// Server Started
app.listen(3000, () => {
    console.log('My first app listening on port 3000!');
});