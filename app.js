require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require("body-parser")


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use( bodyParser.urlencoded( {extended:true} ) )


// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
app.get("/",(req,res)=>{
    res.render("home")
})
app.get("/artist-search",(req,res)=>{
    console.log(req.query)
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      const artist ={ artist: data.body.artists} 
      res.render("artist-search-results",artist)  
      console.log(data.body.artists)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))

})
app.get("/albums/:id",(req,res)=>{
  console.log(req.params.id)
  spotifyApi
  .getArtistAlbums(req.params.id,{ limit: 10, offset: 20 },)
  .then(data=> {
    console.log(data.body.items)
    const albums = {
      albums:data.body.items
    }
  res.render("albums",albums)

  })
  .catch(error=>console.log(error))
})

app.get("/albums/tracks/:id",(req,res)=>{
  spotifyApi
  .getAlbumTracks(req.params.id,{ limit : 5, offset : 1 })
  .then(data=>{
    console.log(data.body.items)

    res.render("tracks",{songs:data.body.items})
  })
  .catch(error=>console.log(error))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
