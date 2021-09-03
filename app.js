require('dotenv').config()


const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname+('/views/partials'))

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
app.get('/',(req,res) => res.render('home'))


app.get('/artist-search', (req,res) => {
    let artistObj = req.query
    let artist = artistObj.artist


spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items[0]);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let artistInfo = data.body.artists.items
    res.render('artist-search-results',{artistInfo})})

  .catch(err => console.log('The error while searching artists occurred: ', err))})


app.get('/albums/:artistId', (req,res) => {
    let idObj = req.params
    let id = idObj.artistId
    // .getArtistAlbums() code goes here
  spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      console.log('THE ALBUMS!!!!!: ', data.body.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let albums = data.body.items
      res.render('albums',{albums})})
  
    .catch(err => console.log('The error while searching artists occurred: ', err))})


app.get('/view-tracks/:albumId',(req,res)=>{

    let idAlbum = req.params
    let id = idAlbum.albumId

    spotifyApi
      .getAlbumTracks(id)
      .then(data=>{
        console.log('SONGS!!!:', data.body.items)
        
        let hola = data.body.items
        res.render('view-tracks',{hola})
      })
   
      .catch(err => console.log('The error while searching artists occurred: ', err))


})

  



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
