require('dotenv').config();



const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));// setting the spotify-api goes here:


app.get('/', (req, res) => {

    res.render('index')
})

app.get('/artist-search', (req, res) => {

console.log ('heloooooooo')
    const artistName = req.query.artistName
    // const {artistName} = req.query

    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            console.log(data.body)

            res.render('artist-search-result', { artist: data.body.artists.items });
            
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))

})


app.get('/albums/:artistId', (req, res, next) => {
    
const artistID = req.query.artistID

    spotifyApi
    
    .getArtistAlbums(artistID)
    .then(
        (data) => {
            
            res.render('albums', {albums : data.body.artistID});
        },
        (err) => {         console.error(err);
        }
    );
    
    // .getArtistAlbums() code goes here
});


// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
