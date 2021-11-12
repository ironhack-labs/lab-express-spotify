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
  
console.log(process.env.CLIENT_ID)

// Our routes go here:
//Rendering the home page
app.get('/', (req, res) => {
    res.render('index');
})

app.get('/artist-search', (req, res) => {
    //i am creating the searchArtist variable which will hold the query from the form!
    const searchArtist = req.query.q
    // console.log(searchArtist)
    spotifyApi
    .searchArtists(searchArtist)
    // .then(data => {
    // console.log('The received data from the API: ', data.body);
    // // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    // })
    // .then(data => {
    //     res.send(data.body.artists))
    // }
    .then(data => {
        const artist = data.body.artists.items
       // const image = data.body.artists.items.images
        //res.send(image)
        //console.log(image)
        res.render('artist-search-results', {artist})
        //res.send(artist)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.id)
    
    .then(data => {
        const album = data.body.items
        res.render('albums', {album})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:id', (req, res) => {
    spotifyApi
    .getAlbumTracks(req.params.id)
    
    .then(data => {
        const tracks = data.body.items
        //res.send(tracks)
        res.render('tracks', {tracks})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
