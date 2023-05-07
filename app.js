require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

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
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req,res) => { // Endpoint com metodo de GET
    res.render('main')
})

/*
app.get('/artist-search', (req,res) => {
    let {artist} = req.query
    spotifyApi.searchArtists(artist)
    .then(data => {console.log('The received data from the API:', data.body);
    res.render('artist-search-results', {response:data.body.artists.items})
})
  .catch(err => console.log('The error while searching artists occurred: ', err));
})
*/

app.get('/artist-search', async (req,res)=>{
    let {artist} = req.query
    try{
        const data = await spotifyApi.searchArtists(artist)
        res.render('artist-search-results', {response:data.body.artists.items})
    }
    catch (err){
        console.error(err)
        res.render('artist-search-results', {response:[]})
    }
})

app.get('/albums/:artistId', async (req, res) =>{
    let {artistId} = req.params
    try {
        const albums = await spotifyApi.getArtistAlbums(artistId)
        //res.send({response:albums.body.items}); //fixe para de bug
        res.render('albums', {response:albums.body.items});
    } 
    catch (err) {
        console.error(err);
        res.render('albums', {response:{}})
    }
})

app.get('/album-tracks/:albumId', async (req, res) =>{
    let {albumId} = req.params
    try {
        const albumTracks = await spotifyApi.getAlbumTracks(albumId)
        //res.render('album-tracks', {response:albumTracks.body.items})
        res.send({response:albumTracks.body.items})
    }
    catch (err) {
        console.error(err);
        res.render('album-tracks', {response:{}})
    }
})

app.listen(3000, () => console.log('Port 3000 🔊'));
