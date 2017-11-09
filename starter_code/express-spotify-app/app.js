var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '1c30624cba6742dcb792991caecae571',
    clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

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


const express = require("express");
const app = express();



// -- setup

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");



app.get("/",(req,res,next)=>{

// spotifyApi.searchArtist()
res.render('index');


})

app.post("/artists", (req, res) => {
    let artists = req.body.artists;
    spotifyApi.searchArtists(artists).then(function(data){


        res.render("artists",data);
    },
    function(err){
        throw err;
    }
    
   );

  });




// -- 404


//-- start server
app.listen(3000, () => {
    console.log("My first app listening on port 3000!");
   });
   