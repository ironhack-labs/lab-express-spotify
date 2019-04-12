const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
//Iteration 1

// Remember to insert your credentials here
const clientId = '815860288c1a489b98ca318164679441',
    clientSecret = 'f411c026d5264f5c88de707cd47a7904';

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


// the routes go here:
// Route: GET /
app.get('/', (req, res, next) => {
    res.render('index');
  })

//http://localhost:5000/artists?search=bob
app.get('/artists', (req, res, next) => {
     console.log(req.query.search)
    spotifyApi.searchArtists(req.query.search) //search is whatever you have on your form as name
    
    .then(data => {
       

    res.render('list-artists', {
        artistResult: data.body.artists.items,
        searchResult: req.query.search
        // artistImage: data.body.artists.items[0].images[0].url
    });
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      })
    //  res.send('artists');

  })


  app.get('/albums/:artistsId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistsId)
    .then(data =>{

      res.render('albums',{
        albumResult: data.body.items,
        // searchResult: req.query.search
      })
    })
    .catch(err=>{
      console.log("I got an error",err)
    // })
  })
})

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId) //to get all track from one album
  .then(data =>{
    // console.log(req.params.albumId);
    res.render('list-tracks',{
      tracksResult: data.body.items
      // searchResult: req.query.search
    })
  })
  .catch(err=>{
    console.log("I got an error",err)
  // })
})
})


app.listen(5000, () => console.log("My Spotify project running on port 5000 🎧 🥁 🎸 🔊"));
