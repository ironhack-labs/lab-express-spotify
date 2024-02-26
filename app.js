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

app.get('/',(req,res,next)=> {
    res.render('index.hbs')
});

app.get('/artist-search',(req,res,next)=> {
    const textSearch = req.query.name;
    spotifyApi
        .searchArtists(textSearch)
        .then(data =>{
            res.render('artist-search.hbs',{artists:data.body.artists.items})
        })
        .catch(err =>console.log('error while searching.',err))
});

app.get('/albums/:artistId',(req,res,next)=>{
    const idArtist = req.params.artistId;
    spotifyApi.getArtistAlbums(idArtist)
        .then(data => {
            console.log('data received from the API',data.body.items);
            res.render('albums.hbs',{albums:data.body.items})
        .catch(err => console.log('error while searching',err))
    })
});

app.get('/tracks/albId',(req,res,next)=> {
    const id = req.params.albId;
    spotifyApi.getAlbumTracks(id)
        .then(data => {
            res.render('tracks.hbs',{tracks:data.body.items})
        })
        .catch(err => console.log('error while searching',err))
});

app.listen(3000, () => console.log('App running on port 3000 '));
