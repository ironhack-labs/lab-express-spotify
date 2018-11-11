var SpotifyWebApi = require('spotify-web-api-node');

var clientId = '233be0ff6eec4286a17021b15024c094',
    clientSecret = '4ebe953e39174dbd911d95544bf443ba';

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
const hbs = require("hbs");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");


app.set("view engine", "hbs");
//app.set('views', path.join(__dirname, 'views'));
app.set("views", __dirname + "/views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/favicon.ico", express.static('public/img/favicon.ico'));
hbs.registerPartials(__dirname + '/views/partials');

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
app.use("/favicon.ico", express.static('public/img/beer.ico'));
hbs.registerPartials(__dirname + '/views/partials');


app.get("/", (req, res, next) => {
  let data = {
    name: "home",
    home: true
  };
  res.render("home",{
    data
  });
});



// app.get('/', (req,res ) => {
//   console.log(req.query);

//   let data = { showName: false };
//   if(req.query.nombre){
//       data = {
//           showName: true,
//           name: req.query.nombre,
//           fav_color: req.query.fav_color
//       }
//   }
//   res.render('home', data)
// });

// app.post('/', (req,res) => {
//   console.log(req);
//   console.log(req.body);
//   res.send(`POST OOOK ${req.body.n1} color favorito: ${req.body.n2}`);
// })



// app.get('/simpsons/:personaje',(req, res) => {
//   let {personaje} = req.params;

//   if(personaje == "homer" ){
//       personaje =  "Homer mola mucho";
//   }

//   res.render('simpson',{
//       nombre: personaje
//   });
// })

let port = 3000;
app.listen(port, () => console.log(`Ready on http://localhost:${port}`))
