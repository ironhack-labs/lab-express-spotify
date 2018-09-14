const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const path=require('path') //Asegurar que no falle la ruta



//Variables
const port = 3002;

//configuraciones básicas
const app = express();
//2.2. view engine
app.set('view engine','hbs')
app.set('views',path.join(__dirname,'views'))

//2.3 statics
app.use(express.static(path.join(__dirname,'public')))

const clientId = '4c7d8752deb94be0903a43443994bffa', 
    clientSecret = '3ddf66231abe45a18f813c673e680a67';

let spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token is ' + data.body['access_token']);
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong!', err);
  });


app.get('/',(req,res)=>{
    res.render('home')
})

const artists = require('./routes/artists') //traer la ruta
app.use('/',artists) //usar la ruta

//5.Listener
app.listen(port,()=>{
    console.log("Escuchándote atentamente en el puerto "+port)
})