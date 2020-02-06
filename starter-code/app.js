require('dotenv').config();

const express = require('express')
const hbs = require('hbs')
const SpotifyWebApi = require('spotify-web-api-node')
const path = require('path')

const app = express()


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  console.log(process.env.CLIENT_ID)
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
// Our routes go here:
app.get('/', (req, res) => res.render('index'))


app.get('/artist-search', (req, res) => {
    console.log('EL objeto de Query String: ', req.query.artist)   
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        res.render('artist-search-results',{artist: data.body.artists.items})
    })
})

app.get('/albums/:id', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {
        res.render('albums',{albums: data.body.items})
        data.body.items.forEach(elm => console.log(elm.images[0].url))
    })
})

app.get("/tracks/:albumId", (req, res) => {

    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {

        // console.log(data.body)
        res.render("tracks", {tracks: data.body.items})
    })

})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
