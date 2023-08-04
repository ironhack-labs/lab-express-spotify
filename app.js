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

app.get("/", (req, res)=> {
    res.render('index');
});

app.get('/artist-search', async (req,res) => {
    try{
        const {artist} = req.query;
        let allArtists = await spotifyApi.searchArtists(artist);
        console.log(allArtists.body.artists.items[0].images[0]);
        res.render('artist-search-results', {artists: allArtists.body.artists.items});
    }
    catch (error){
        console.log(error);
    }
});

app.get('/albums/:artistId', async (req, res, next) => {
    try{
        const {artistId} = req.params;
       // console.log(artistId);
        let albums = await  spotifyApi.getArtistAlbums(artistId, { limit: 10, offset: 20 });
       // console.log(albums.body.items);
        res.render('albums', {albums: albums.body.items});
    }
    catch (error){
        console.log(error);
    }
});


app.get('/tracks/:trackID', async (req, res, next) => {
    try{
        const {trackID} = req.params;
       // console.log(artistId);
        let tracks = await  spotifyApi.getAlbumTracks(trackID, { limit : 5, offset : 1 })
        console.log(tracks.body);
        res.render('tracks', {tracks: tracks.body.items});
    }
    catch (error){
        console.log(error);
    }
});
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
