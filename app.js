require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const { restart } = require('nodemon');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );


// Our routes go here:
app.get("/",(req,res,next)=>{
    res.render("home")
})

app.get("/artist-search",(req,res,next)=>{

    const nameOfArtist = req.query.nameOfArtist
    
    

    spotifyApi.searchArtists(nameOfArtist)
        .then((response)=>{
            const artistSearched = response.body.artists.items
            
            
            res.render("artist-search-result",{artistSearched})
        })
        .catch((error)=>{
            console.log(`mmmmmmm something happened...=>`,error)
        })
})
app.get("/albums/:artistId",(req,res,next)=>{
      const idArtist = req.params.artistId
      

      spotifyApi.getArtistAlbums(idArtist)
        .then((response)=>{
          const albumsArray = response.body.items
          res.render("albums",{albumsArray})
          
        })
        .catch(error=>{
          console.log(`mmmmmmm something went wrong...=>`,error)
        })

})
app.get("/songs/:albumId",(req,res,next)=>{
      const albumId = req.params.albumId
      spotifyApi.getAlbumTracks(albumId)
        .then((response)=>{
          const songsArray=response.body.items
         
          res.render("songs",{songsArray})
        })
        .catch((error)=>{
          console.log(`mmmmmmm something went wrong...=>`,error)
        })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
