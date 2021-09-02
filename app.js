require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// SPOTIFY CONFIG
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
app.get('/', (req, res) => {
    res.render('artist-search')
})

app.get('/artist-search-results', (req, res) =>{
spotifyApi
  .searchArtists(req.query.artistName)
  .then(data => {
    // console.log('The received data from the API: ', data.body);
    // console.log(data.body.artists.items)
    // console.log(data.body.artists.items[0].images);

    res.render('artist-search-results', {data: data.body.artists.items})
    
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:name/:id', (req, res) => {
    const { id } = req.params
    // res.render('albums')
    // console.log(id)
    spotifyApi.getArtistAlbums(id)
        .then(function(data){
            // console.log(data.body.items)
            res.render('albums', {data: data.body.items})
        })
        .catch((err) => console.log('EEEEEEERRRRRROR', err))
})

app.get('/tracks/:name/:id', (req, res) => {
    const { id } = req.params

    spotifyApi.getAlbumTracks(id)
        .then(function(data){
            console.log(data.body);
            //preview_url
            //name
            res.render('tracks', {data: data.body.items})

        })
        .catch((err) => console.log(err))

})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
