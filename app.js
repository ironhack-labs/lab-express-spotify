require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require ("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here
const spotifyWebApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

//Connect to the API
spotifyWebApi
  .clientCredentialsGrant()
  .then(data => spotifyWebApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/home", (req, res)=>{
    res.render("home");
})
app.get("/artist-search", async(req,res)=>{
    //const {searchArtists} = req.query;
    const artist = req.query.artist;
    const allArtistsFromApi = await spotifyWebApi.searchArtists(artist);
 
    const allArtist = allArtistsFromApi.body.artists.items
   console.log(allArtist[0].images); 
    res.render('artist-search-results', { allArtist });
})
app.get("/albums/:artistId", async (req, res)=>{
    let results = await spotifyWebApi.getArtistAlbums(req.params.artistId);
    const allAlbums = results.body.items;
    res.render("albums", {allAlbums});
})
app.get("/tracks/:albumId", async (req, res)=>{
    let results = await spotifyWebApi.getAlbumTracks(req.params.albumId);
    const tracks = results.body.items;
    res.render("tracks", {tracks});
})

/* app.get("/artist-search-results", async (req, res)=>{
    const allArtistsFromApi = await spotifyWebApi.searchArtists(req.query.artists);
    res.render("artist-search-results", {artists:allArtistsFromApi});
}) */



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
