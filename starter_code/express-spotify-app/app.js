const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require ('body-parser');
const morgan = require ('morgan');
const path = require ('path');
const prettyjson = require ('prettyjson');
var SpotifyWebApi = require('spotify-web-api-node');

app.use(bodyParser.urlencoded({ extended: true }));


/* EXPRESS CONFIG */
const publicDir = __dirname + "/public";
//console.log(`Public dir is: ${publicDir}`);
app.use(express.static(publicDir));

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

// Remember to paste here your credentials
var clientId = 'dc05a76c7b9a4710879bc6d8073e8cc2',
    clientSecret = 'ca2adc003ca743579b6ec7a5394f9fa8';

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
    res.render("index")
})
// app.get('/', (req, res) => {
//     let artist     = req.query.artist;
  
//     res.send(`
//       Your artist is ${artist}
//     `)
//   });

app.post("/artist",(req,res)=>{
    spotifyApi.searchArtists(req.body.artist)
    .then(data => {
        // console.log(data.body.artists.items);
         const artist = {
           list: data.body.artists.items
         }
         //console.log(data.body.artists.items)
         res.render("artist",artist)
         // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
       })
    .catch(err => {
        console.log(err);
      // ----> 'HERE WE CAPTURE THE ERROR'
    })

})

app.get("/album/:id",(req,res)=>{
    spotifyApi.getArtistAlbums(req.params.id) // Se coge el siguiente parametro 
    .then(albumData => {
        console.log("++++++++++++++++++aaaaaaa")
         res.render("album",{albumData})
       })
    .catch(err => {
        console.log(err);
      
    })
})
app.get('/songs/:idSongs', (req, res, next) => {
    //console.log(req.params)
    spotifyApi.getAlbumTracks(req.params.idSongs)
      .then(dataSongs => {
          console.log("++++++++++++++++++")
         res.render('song', {dataSongs});
      })
      .catch(err => {
        console.log(`ERROR: ${err}`);
      })
  });



const port = 3000;
app.listen(port,()=> console.log(`La conexion es to flama en el puerto ${port}`))