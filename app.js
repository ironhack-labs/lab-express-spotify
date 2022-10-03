require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + "/views/partials");

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
app.get('/',(req,res,next) =>{
    res.render("home")
})

app.get('/artist-search',(req,res,next) =>{
    console.log("you are in the artist search page")
    const artistSearch = req.query.artist
    spotifyApi
    .searchArtists(artistSearch)
    .then(data => {
    //console.log('The received data from the API: ', data.body.artists.items);
    const searchData = data.body.artists.items;
    res.render("artist-search-results",{searchData})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res, next) => {
    //console.log(req.params.artistId)
    const artistId = req.params.artistId;
    spotifyApi
    .getArtistAlbums(artistId)
    .then((response) =>{
        //console.log(response.body.items)
        const artistsAlbum = response.body.items;
        res.render("albums",{artistsAlbum})
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/tracks/:trackId', (req, res, next) => {
    //console.log(req.params.trackId)
    const trackId = req.params.trackId;
    spotifyApi
    .getAlbumTracks(trackId)
    .then((response) =>{
        console.log(response.body.items)
        const albumTracks = response.body.items;
        res.render("tracks",{albumTracks})
    
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
   
});

app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));
