require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});



const app = express();

// 

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

// setting the spotify-api goes here:
// retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });



// the routes go here:

app.get('/artists', (req, res, next) => {

    spotifyApi
        .searchArtists(req.query.artists)
        .then(data => {
            console.log("The received data from the API: ", data.body.artists.items);
            res.render("artists", {
                artists: data.body.artists.items
            });
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });

    //console.log(req.params.artists, req.query.artists);

    //res.send(req.params, req.query);
});

app.get('/', (req, res) => {
    res
        .status(200)
        .render('index')
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));