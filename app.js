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
app.get('/', (req, res, next) => {
    console.log(req);
    res.render('index')
})

app.get('/artist-search', (req, res, next) => {

    spotifyApi.searchArtists(req.query.name)
    .then((result)=>{
        console.log(result.body.artists.items);
        // res.locals.result = result;
        // res.locals.url = result.body.artists.items[0].images[0].url;
        // res.render('artist-search-results', res.locals)
        res.render('artist-search-results', {result:result})
        // url:result.body.artists.items[0].images[0].url
    })
    .catch(err => console.log('this is an error:', err))   
})

app.get('/albums/:id', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then((result) => {
        console.log(result.body.items[0])
        res.render('albums', {result:result})
    })
    .catch(err => console.log('error accessing the album:', err))
})

app.get('/tracks/:id', (req, res, next) =>{
    spotifyApi.getAlbumTracks(req.params.id)
    .then((result) => {
        console.log(result.body)
        res.render('tracks', {result:result})
    })
    .catch((err)=> console.log('error accessing the preview of track:', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

