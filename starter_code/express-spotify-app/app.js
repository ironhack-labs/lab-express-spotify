const express = require('express');
const app = express();
const hbs = require('hbs');
const path=require("path")
const SpotifyWebApi = require('spotify-web-api-node');

app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views");
app.use(express.static(path.join(__dirname, "public")));
hbs.registerPartials(__dirname + "/views/partials");


let clientId = '20624145d55748768a9df92c5d47a72a',
    clientSecret = '54dfd06182a445bebc8574cbbf9a2d24';

let spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});


spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get("/",(req,res)=>{
    res.render("index")
});

app.get('/artists', (req, res, next) => {
    let userQuery = req.query.artist;
    spotifyApi.searchArtists(userQuery)
      .then(data => {
        let list = data.body.artists.items;;
        res.render('artists', {list});
      })
      .catch(err => {
        console.log('There was a problem');
      })
  });

  app.get('/albums/:id', (req, res) => {

    spotifyApi.getArtistAlbums(req.params.id)
    .then(data =>{
      let list=data.body.items;
      res.render("albums",{list})
    })
    .catch(err => {
      console.log('There was a problem');
    })
});




app.listen(3000, () => console.log('Listening 3000!'));