require('dotenv').config()
const express = require('express');
const hbs = require('hbs');
const path = require('path'); 
const spotifyWebApi= require ('spotify-web-api-node')
//middleware
//const bodyParser = require('body-parser');

// require spotify-web-api-node package here:
const clientId = process.env.CLIENT
const clientSecret = process.env.CLIENTSECRET
//instancia del API con las credenciales
const spotifyApi = new spotifyWebApi({
  clientId,
  clientSecret 
});

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));//app.use(bodyParser.urlencoded({ extended: true }));


// setting the spotify-api goes here:

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
   
  })

// the routes go here:

app.get('/', (req, res) =>{
  res.render('index')
})

app.get('/artist', (req, res) =>{
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {

      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let arrayArtists=data.body.artists.items
      //res.send(arrayArtists)
     res.render('artist',{arrayArtists})
     
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})
app.get('/albums/:id',(req,res)=>{
  spotifyApi.searchArtists(req.query.artist)
  .then(data => {

    console.log("The received data from the API: ", data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let arrayArtists=data.body.artists.items.a
    //res.send(arrayArtists)
   res.render('albums',{arrayArtists})
   
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
 // res.render('albums',req.params)
})



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
