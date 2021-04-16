require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });



// require spotify-web-api-node package here:

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


app.get('/', (req,res)=>{
    res.render('search')
})

app.get('/artist-search',(req,res)=>{
    console.log('artist getting searched')
    spotifyApi
  .searchArtists(req.query.q)
  .then(data => {
      console.log(req.query.q);
    console.log(data.body);
    const searchedMusic = data.body;
    console.log(searchedMusic.artists.items[0])
    res.render('music', {searchedMusic});
  })
  .catch(err => console.log('error while searching artists occurred: ', err));
    // res.render('music', {searchedMusic})
})

app.get('/albums/:artist', (req, res, next)=>{
    console.log(req.params.artist.substr(15));
    spotifyApi
    .getArtistAlbums(req.params.artist.substr(15))
    .then(data => {
        const albumData = data.body;
        console.log(albumData);
        res.render('albums', {albumData});
    })
    .catch(err=> console.log('error while returning albums: ', err))
})

app.get('/tracks/:album', (req,res)=>{
    console.log(req.params.album.substr(14));
    spotifyApi
    .getAlbumTracks(req.params.album.substr(14))
    .then(data => {
        const trackData = data.body;
        console.log(trackData);
        res.render('tracks', {trackData});
    })
    .catch(err=> console.log('error retrieving track info', err))
})


app.listen(3000, () => console.log('😠🎸 port 3000 '));

 
//change