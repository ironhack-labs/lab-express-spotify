
const express = require("express");
const bodyParser= require("body-parser");
var SpotifyWebApi = require('spotify-web-api-node');
const app = express();
const expressLayouts=require("express-ejs-layouts");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));
app.use(expressLayouts);
app.set("views", __dirname+"/views");
app.set ('layout','layouts/main-layout');
app.set("view engine","ejs");

var clientId = 'a45eb34aee2644189047c39ff117e86e',
    clientSecret = 'a199345cbf6b4f04b8eff9d375ed7342';
  
var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

//Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.get("/",function(req,res,next){
    // quando no quieres usar una vista sino que renderizs una view
    res.render("home");
   // res.send("105")

});



// app.get("/artist",function(req,res,next){
//     // quando no quieres usar una vista sino que renderizs una view
//     res.render("artist");


// });


app.post("/artist",(req,res)=>{
 
     console.log(req.body.artist)
     
     spotifyApi.searchArtists(req.body.artist).then((response) => {
          // console.log(response.body.artists.items[0])
           res.render("artist", {artistfounded:response.body.artists.items,artistsearched:req.body.artist});
        }).catch((err) => {
            // handle error
        });

   
    
 });
 

 app.get('/albums/:artistId', (req, res) => {
    // code
   // console.log(req.params.artistId)
    spotifyApi.getArtistAlbums(req.params.artistId).then((response) => {
        //console.log("8=======D")
       // console.log(response.body.items[0].id)
        res.render("albums", {artistAlbums:response.body.items});
     }).catch((err) => {
         // handle error
     });
  });


  app.get('/tracks/:albumId', (req, res) => {
    // code
   // console.log(req.params.artistId)
    spotifyApi.getAlbumTracks(req.params.albumId).then((response) => {
        console.log("8=======D")
      // console.log(response.body.items[0])
       console.log(response.body.items[1].name)
       console.log(response.body.items[1].preview_url)
       
       res.render("tracks", {albumTracks:response.body.items});
     }).catch((err) => {
         // handle error
     });
  });



// LISTEN ES MUY IMPORTANTE- ESCUCHA A MI WEB!!
app.listen(3000, function(err){
    if (err) console.log(err);
    console.log("Tu servidor está funcionando en el puerto 3000");

});