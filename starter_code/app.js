require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

// require spotify-web-api-node package here:






app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID = 'd56ba3e46d8a4a50896f9fa468ac8c37',
    clientSecret: process.env.CLIENT_SECRET= '55b611e0cd6648b7a9c52b8b3f1d3b79'
  });
  
//   Retrieve an access token
//   spotifyApi
//     .clientCredentialsGrant()
//     .then(data => {
//       spotifyApi.setAccessToken(data.body["access_token"]);
//     })
//     .catch(error => {
//       console.log("Something went wrong when retrieving an access token", error);
//     });




app.get('/albums/:albumId',(req,res,next)=> {
    console.log(req.param)
    spotifyApi.getArtistAlbums;
    {req.params.albumId}
    res.render('album.hbs')
}
)


    spotifyApi
    .searchArtists('req.query.artist')
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render('show.hbs', {artistToHBS: artistFromServer})      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
   




// the routes go here:

app.get('/',(req, res, next)=> {
    res.render('index.hbs')
})


app.get('/artist', (req, res, next)=>{
    console.log(req.query)
    let artistFromServer =[
    {name:'beatles'}, {name:'sia'}, {name: 'Mozart'}
    ]
    res.render('show.hbs', {artistToHBS: artistFromServer})
})


app.listen(4000, () => console.log("My Spotify project running on port 4000 🎧 🥁 🎸 🔊"));
