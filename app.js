require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

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



app.get('/', (req, res)=>{
    res.render('home.hbs')
})

app.get('/artist-search-results/:search', async (req, res)=>{
    try {
        // const searchResults = await spotifyApi.searchArtists(req.params.search)
        const artists = await (await spotifyApi.searchArtists(req.params.search)).body.artists.items
        // console.log(artists)
        res.render('artist-search-results.hbs', {artists})

    }catch(err){
        res.render('error.hbs', {errorMsg: "An error while searching artists occurred: "})
    }
})

app.get('albums/:artistId', async (req, res)=>{
    try {
        const albums = await (await spotifyApi.searchAlbums(req.params.id)).body.artists.items.id
        res.render('albums.hbs', {albums})
    }catch(err){
        res.render('error.hbs', {errorMsg: "An error while searching albums occurred: "})
    }
})



//PPPPFFFFFFFFFFFFFFFFFF madre mia :(
// app.get('tracks/:artistId', async (req, res)=>{
//     try {
//         const albums = await (await spotifyApi.searchAlbums(req.params.id)).body.artists.items.
//         res.render('tracks.hbs', {albums})
//     }catch(err){
//         res.render('error.hbs', {errorMsg: "An error while searching tracks occurred: "})
//     }
// })
  


app.listen(3100, () => console.log('My Spotify project running on port 3100 🎧 🥁 🎸 🔊'));