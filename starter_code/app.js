const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, "public")));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: true
}));

const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
const clientId = '82f264f76eab48fdadbea484d8cf91e2',
    clientSecret = '0951a3b31a104ab2a9753e606145f811';

const spotifyApi = new SpotifyWebApi({
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


app.get('/', (req, res) => {
    res.render('index', {

    });
})

app.post('/artists', (req, res) => {



    spotifyApi.searchArtists(req.body.bruno)
        .then(data => {
            res.render('artists', {
                data:data.body.artists.items,
            });
/*             console.log(data)
 */        })
        .catch(err => {
            // ----> 'HERE WE CAPTURE THE ERROR'

        });
})

const port = 3000
app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})