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
app.get("/", (req,res, next) => {
    // spotifyApi
    // .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
    // .then(data => {
    // console.log('The received data from the API: ', data.body);
    // // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    // })
    // .catch(err => console.log('The error while searching artists occurred: ', err));
    res.render("index")
})

app.get('/artist-search', (req, res, next) => {
    //console.log(req.query)
    const {artist} = req.query
    //console.log(artist)
    spotifyApi.searchArtists(artist)
      .then( data => {
        // console.log('The received data from the API: ', data.body)
        // console.log('result:', data.body.artists)
        //console.log('precise data:', data.body.artists.items[0])
        const result = {artists: data.body.artists.items}
        res.render("artist-search-results", result)
    })
.catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res, next) => {
    const {id} = req.params;
    spotifyApi.getArtistAlbums(id)
    .then(albumsFromApi => {
        res.render('albums', {allAlbums: albumsFromApi.body.items})
    })
.catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/tracks/:id', (req, res, next) => {
    const {id} = req.params;
    spotifyApi.getAlbumTracks(id)
    .then(tracksFromApi => {
        //console.log("tracks", tracksFromApi.body.items)
        res.render('tracks', {allTracks: tracksFromApi.body.items})
    })
.catch(err => console.log('The error while searching tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
