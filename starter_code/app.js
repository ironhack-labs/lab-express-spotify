const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = 'cd5bd7a1605c42beab027af84e609739',
    clientSecret = '183b9c5a50a645d08e686bba4edf2189';

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

// the routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artists', (req, res, next) => {
    console.log("im artist", req.query.artist)
    let artist = req.query.artist


    spotifyApi.searchArtists(artist)
        .then(data => {
            console.log("The received data from the API: ", data.body.artists.items[0].images);
            let searchResult = data.body.artists.items
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artists', {
                myItems: searchResult
            });
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })
});

app.get('/albums', (req, res, next) => {
    console.log("album", req.query.artistId)
    let id = req.query.artistId

    spotifyApi.getArtistAlbums(id)
        .then(data => {
            // res.json(data.body);
            // return;
            console.log("The received data from the API: ", data.body.items);
            let searchResult = data.body.items
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('albums', {
                myItems: searchResult
            });
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
            res.status(500);
            res.send('Error');
        })

});



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));