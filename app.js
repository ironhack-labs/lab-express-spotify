require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });




const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get('/', (req,res)=>{
    res.render('search')
})

app.get('/artist-search',(req,res)=>{
    console.log('artist getting searched')
    spotifyApi
  .searchArtists(req.query.q)
  .then(data => {
    console.log(data.body);
    const searchedMusic = data.body;
    res.render('music', {searchedMusic});
  })
  .catch(err => console.log('error while searching artists occurred: ', err));
})

app.get('/albums/:artist', (req, res, next)=>{
    spotifyApi
    .getArtistAlbums(req.params.artist.substr(15))
    .then(data => {
        const albumData = data.body;
        res.render('albums', {albumData});
    })
    .catch(err=> console.log('error while returning albums: ', err))
})

app.get('/tracks/:album', (req,res)=>{
    spotifyApi
    .getAlbumTracks(req.params.album.substr(14))
    .then(data => {
        const trackData = data.body;
        res.render('tracks', {trackData});
    })
    .catch(err=> console.log('error retrieving track info', err))
})


app.listen(3000, () => console.log('😠🎸 port 3000 '));

 