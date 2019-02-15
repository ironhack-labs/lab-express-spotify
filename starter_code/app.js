const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


// setting the spotify-api goes here:


const clientId = 'f10122d20be94d038d3251ac354945e5',
    clientSecret = '856d896aa87b4b0ca974e04bf909510a';

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


app.get("/" , function(req, res, next){
  res.render("index")
})

app.post('/artists', (req, res, next) => {

  spotifyApi.searchArtists(req.body.title) //req.body.title came from your html
    .then(data =>{

      res.render("artists", {myArtists: data.body.artists.items}) //send spotify data to our hbs file under artist
    })
 
});
app.get("/albums/:id" , function(req, res, next){
  
 
    spotifyApi.getArtistAlbums(req.params.id).then(data => {
    res.render("albums", {items:data.body.items})  
  }).catch(err => {
    console.log('err!',err)
  })
 
})


app.get('/tracks/:id', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id) //req.body.title came from your html
    .then(data =>{
      //  res.json(data.body.items) 
      res.render('tracks', {myTracks: data.body.items})
    }).catch(err=>{ console.log(err)})
})


// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
