var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '2a756708d15b4465b6d3246c54c573d2',
    clientSecret = 'f4b72e483bff40d183b2e90221dce477';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

const express=require('express');
const app=express();
const hbs=require('hbs');
const path    = require('path');

app.use(express.static('public'))
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials')
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res,next)=>{
    res.render('index');
})

app.get('/search',(req,res, next)=>{
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            let artist = data.body.artists.items
            console.log("ARTIST SEARCH DONE")
            console.log(data.body)
            res.render('artist',{artist})
        })
        .catch(err => {
        console.log("No artist with this name")
        })
});

app.get('/albums/:artistId',(req,res,next)=>{
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            let album=data.body.items;
            console.log(data.body.items)
            console.log("ALBUM SEARCH DONE")
            res.render('albums',{album})
        })
        .catch(err => {
            console.log("No artist with this name")
        })
})

app.get('/tracks/:trackId',(req,res,next)=>{
    spotifyApi.getAlbumTracks(req.params.trackId)
        .then(data => {
            let track=data.body.items;
            console.log(data.body.items)
            console.log("TRACK SEARCH DONE")
            res.render('tracks',{track})
        })
        .catch(err => {
            console.log("No tracks")
        })
})



app.listen(3000);