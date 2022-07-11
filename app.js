require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
// Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get("/", (req, res) => {
    console.log("homepage is opened");
    res.render("index");
});

app.get("/artist-search", (req, res) => {
    console.log("someone started a search");
    const artist = req.query.artistSearch;
    console.log(artist);

    spotifyApi
    .searchArtists(artist)
    .then(data => {
        //console.log('The received data from the API: ', data.body.artists.items[0].images[0].url);
        const artistsArr = {
            everyArtist: data.body.artists.items
        }
        //console.log('The received data from the API: ', artistsArr[0]);
        res.render("artist-search-results", artistsArr);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

// app.get('/albums/:artistId', (req, res, next) => {
//     console.log('params:', req.params.artistId);
//     spotifyApi
//         .getArtistAlbums(req.params.artistId)
//             .then ( data => {
//             console.log(data.body.items)
//             const albumsArr = {
//                 album: data.body.items
//             };
//             res.render("album", albumsArr);
//         }) 
//   });




app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));
