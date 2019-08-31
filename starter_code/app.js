const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//Registrate Partial
hbs.registerPartials(__dirname + '/views/partials');
// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '90d8b56932304220b60ee8eb7dbb890a',
    //'1c30624cba6742dcb792991caecae571',

    clientSecret = '86a6096da0b7441e89956b85c2c7be6f';
//'746977b1e77240faa9d0d2411c3e0efe';

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
app.get('/', (req, res) => {
    res.render('index')
});


app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId) // localhost:3000/albums/1236i61523itei765
        .then(data => {
            res.render('albums', { data })
            // res.send(data)
        });
})


app.get('/artists', (req, res) => {
    //important    console.log('i am artist')
    console.log('i am artist', req.query)
    spotifyApi.searchArtists(req.query.artistName)
        .then(data => {
            // console.log("The received data from the API: ", data.body.artists.items);
            // res.send(data)
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

            res.render('artists', { artists: data.body.artists.items })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })
})
//query


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
