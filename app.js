require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



// Our routes go here:

app.get("/", (req, res) => res.render("index-page"))

app.get("/artist-search", (req, res) => {
    const artist = req.query.artist
    
        spotifyApi.searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            const artists = data.body.artists.items
            
            res.render("artist-search-results", { artists })
            console.log(artists[0])
            
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
    
})
app.get('/albums/:artistId', (req, res) => {
    const artistId = req.params.artistId
    spotifyApi.getArtistAlbums(artistId)
        .then(albums => {
            const albumList = albums.body.items
                // console.log()
            res.render("album", { albumList })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))

})


app.get('/album/tracks/:albumId', (req, res) => {
    const almbumId = req.params.albumId
     
    spotifyApi.getAlbumTracks(almbumId)
        .then(tracks => {
            const tracksList = tracks.body.items
            // console.log(tracksList)
            res.render("tracks-page", { tracksList })
            
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
