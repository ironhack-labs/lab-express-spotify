require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

//Middleware

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//Middleware for body-parser

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Our routes go here:

app.get('/', (req, res)=>{
    res.render('home.hbs')
})

app.get('/artist-search', (req, res)=>{
    const artistFromForm = req.query.artistSearch
    spotifyApi.searchArtists(artistFromForm)
    .then(artistFromDataBase => {
    //console.log(artistFromDataBase.body.artists.items)
    const artistResult = artistFromDataBase.body.artists.items
    res.render("artist-search-results.hbs", {artistResult})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))
   
})

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)

    .then((artistFromDataBase) => {
        const albums = artistFromDataBase.body.items
        res.render('albums', {albums})
        //console.log(albums)
    })
    .catch(err => console.log(err))  

});

app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId)

    .then(function(tracksFromAlbum) {
        const tracks = tracksFromAlbum.body.items
        res.render('tracks', {tracks})
        console.log(tracks)

    }, function(err) {
        console.log('Something went wrong!', err)
    })
});



app.listen(4000, () => console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊'));



// app.post('/artist-search', (req, res)=>{
//     console.log(req.body.artistSearch)
// })