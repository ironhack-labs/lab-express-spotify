require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

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

app.get('/', (req, res)=>{
    res.render('index')
    
})

app.get('/artist-search', async (req, res)=> {
    try {
        const {artist} = req.query;
        let allSearchedArtist = await spotifyApi.searchArtists(artist)
        console.log(allSearchedArtist.body.artists.items)
        res.render('artist-search-results', {artists: allSearchedArtist.body.artists.items})
        
    } catch (error) {
        console.log(error)
    }

})

app.get('/albums/:artistId', async (req, res)=> {
    try {
        const {artistId} = req.params;
        let searchedAlbums = await spotifyApi.getArtistAlbums(artistId)

        
        res.render('albums', { searchedAlbums: searchedAlbums.body.items })
        
    } catch (error) {
        console.log(error)
    }

})

app.get('/tracks/:artistId',  async (req, res)=> {
    try {
        const {artistId} = req.params
        let searchedTracks = await spotifyApi.getAlbumTracks(artistId)
        
        res.render('tracks', { searchedTracks: searchedTracks.body.items })
        
    } catch (error) {
        console.log(error)
    }

})





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
