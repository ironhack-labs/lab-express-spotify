require('dotenv').config();
const express = require('express');

const hbs = require('hbs');
const path = require('path')
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
//important to remember this line of code allow us to use the req.body
app.use(bodyParser.urlencoded({ extended: true }))

// Register the location for the handlebars partials 
hbs.registerPartials(path.join(__dirname, 'views/partials'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get('/', (req, res) => {
  res.render('index');
  
});

// app.get('/artist-search', (req, res) => {
//     spotifyApi.searchArtists(req.query.artist)
//     .then((data) => {
//         let allResults = data.body.artists.items
//         res.render('artist-search', {allResults});  
//     })
//     .catch(err => console.error(err));
    
// });
app.get('/artist-search', async(req, res)=>{
    const searchedArtist = req.query.artist 
    let result = await spotifyApi.searchArtists(searchedArtist)
    result = result.body.artists.items

    res.render('artist-search', {result})
})




// app.get('/albums/:artistId', (req, res)=>{
//     const filePath = path.join(__dirname, 'views', 'albums')
//     const artistId = req.params.artistId
//     spotifyApi.getArtistAlbums(artistId).then((data) =>{
//         res.render(filePath, {albums: data.body.items} )
//     }).catch(err => console.error(err));
// })

app.get('/albums/:artistId', async(req,res)=>{
    const id = req.params.artistId
    let albums = await spotifyApi.getArtistAlbums(id)
    albums = albums.body.items
    res.render('albums', {albums}) /* hay q darle formato de objeto para que se pueda lo pueda pasar al hbs*/
})


app.get('/tracks/:albumId', (req, res)=>{
    const filePath = path.join(__dirname, 'views', 'tracks')
    const albumId = req.params.albumId   
    spotifyApi.getAlbumTracks(albumId)
    .then((data)=>{
      res.render(filePath, {tracks : data.body.items})
    })
    .catch(err => console.error(err));
})

app.listen(3000, () => console.log('Ironhackfy project running on port 3000 🎧 🥁 🎸 🔊'));




