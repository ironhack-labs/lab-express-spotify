const router= require("express").Router()
const SpotifyWebApi = require('spotify-web-api-node');
// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error))

//renderizar la home page
router.get("/", (req, res, next)=>{
//console.log("hola")
res.render("index")
})

//renderizar pagina artists
router.get("/artist-search", (req, res, next)=>{
  const {artist} = req.query

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items );
      const spotifyArtists=data.body.artists.items
    
        res.send( elm.id, elm.images[0].url)
     
      //res.send(spotifyArtists)
      //res.render("artist-search-result",{spotifyArtists})
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


module.exports= router;

