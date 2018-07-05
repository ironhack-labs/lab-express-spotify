var SpotifyWebApi = require('spotify-web-api-node');
const express =  require("express")
const app = express()
const hbs = require('hbs');
const path    = require('path')
const port = 3000
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials');
// Remember to paste here your credentials
var clientId = 'ffe6818a5e734fb7ad3a04df9ec0d019',
    clientSecret = 'd8d9b87731c84b6eb0ab9849ee2da0b0';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get("/",(req,res)=>{
    res.render("home")
})
app.get("/artists",(req,res)=>{
    console.log(req.query.name)
    spotifyApi.searchArtists(req.query.name)

    .then(data => {
        console.log(data.body.artists.items[0].images[1].url)
      res.render("artists",{artists:data.body.artists.items,name:req.query.name})
    })
    .catch(err => {
      console.log("Error getting the artists")
    })
})

app.listen(port,()=>{
    console.log("Ready on http://localhost:3000")
})