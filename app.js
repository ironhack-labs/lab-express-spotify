require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi=require('spotify-web-api-node')

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
app.get('/', async (req,res)=>{
    res.render("index")
})

 app.get('/artist-search', (req, res) => {
   spotifyApi
     .searchArtists(req.query.artist)
     .then(data => {
       console.log('The received data from the API: ', data.body);
       const dataArtist = [];
       data.body.artists.items.forEach(ele => dataArtist.push({ ...ele, back: req.query.artist }));
       res.render('artist-search-results', { data: dataArtist, back: req.query.artist });
     })
     .catch(err => console.log('The error while searching artists occurred: ', err));

 });

 app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
     .getArtistAlbums(req.params.artistId)
     .then(data => {
       console.log('The received data for albums from the API: ', data.body.items);
       const dataAlbum = [];
       data.body.items.forEach(ele => dataAlbum.push({ ...ele, artistId: req.params.artistId }));
       res.render('albums', { data: dataAlbum});
     })
     .catch(err => console.log('The error while searching artists occurred: ', err));
  });

app.get('/albums/:artistId/tracks/:albumId',(req,res,next)=>{
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data=>{
        console.log('The received data for albums from the API: ', data.body.items)
        res.render('tracks',{data:data.body.items, artistId:req.params.artistId})
    })
    .catch(err=>console.log('The error while searching albums occurred:', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
