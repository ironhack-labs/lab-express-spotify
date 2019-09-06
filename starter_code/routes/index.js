const router = require('express').Router()
const SpotifyWebApi = require('spotify-web-api-node')
const bodyParser = require('body-parser');
require('dotenv').config();


// setting the spotify-api goes here:
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


//ruta index
router.get('/',(req,res) => {
    res.render('index');
});

//ruta search
router.get('/artists', (req,res) => {
    const artist = req.query.artist
    spotifyApi
    .searchArtists(artist)
    .then(data => {
        res.render('artists', data.body.artists)
    })
    .catch(err => {
        console.error(err);
    })
})

//ruta albumes
router.get('/albumes/:id', (req,res) => {
    const id = req.params.id 
    spotifyApi.getArtistAlbums(id)
    .then(data => {
        res.render('albums', data.body);
    }, function(err) {
        console.error(err);
    });
})

//ruta tracks
router.get('/tracks/:id',(req,res)=>{
    const id = req.params.id
    spotifyApi.getAlbumTracks(id)
    .then(data =>{
        res.render('tracks',data.body)
    })
    .catch(err=>{
        console.error(err)
    })
})
module.exports = router