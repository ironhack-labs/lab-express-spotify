var SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

// Remember to paste here your credentials
const clientId = '5632dfe00cec441aafb8e3572f9f1fb5';
const clientSecret = 'b09e21a96ca84859b733b6895b6e1651';

let spotifyApi = new SpotifyWebApi({
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


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', __dirname + '/views/layout/main-layout');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

// let a = (req,res,next) =>{
//   console.log("EL MIDDLEWARE DE MARC");
//   next();
// };

app.use(express.static('public'));

app.get('/',(req,res)=>{
  res.render('index');
});

app.get('/artists', (req, res) => {
  let artistName = req.query.artist;//name del input

  spotifyApi.searchArtists(artistName)
  .then(function(data) { //promesa - objeto data
    console.log(data.body.artists.items);
    let artistsArray = data.body.artists.items;
    res.render('artists', {artist: artistsArray});//artist nombre de la key que le damos
    //artists es la url donde tenemos que renderizar o pintar
  }, function(err) {
    console.error(err);
  });
});

app.get('/artist/:id', (req, res) => {
  let artistId = req.params.id;
  // :id con esto le decimos que esta parte de la url es variable
  spotifyApi.getArtistAlbums(artistId)
    .then(function(data) {
      let artistAlbums = data.body.items;
      console.log(data.body.items);
      res.render('artist', {albums: artistAlbums});//artist nombre de la key que
    }, function(err) {
      console.error(err);
    });
});

app.get('/album/:id', (req, res) => {
  let albumId = req.params.id;

  spotifyApi.getAlbumTracks(albumId)
    .then(function(data) {
      console.log(data.body);
      res.render("tracks", {tracks: data.body.items});
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});


// app.get('/artists/:name', (req, res) => {
//   console.log(req.params);
//   res.render('index');
// }); Esto estaría mal, no se pueden poner dos veces /:


// const getImagenes = (personaje) => {
//   let imagesBart = [
//     "https://assets.fxnetworks.com/cms/prod/2016/12/simpsonsworld_social_og_bart_1200x1200.jpg",
//     "http://www.nombresparaperros.club/imagenes/1/original/5661473458711-Bart-Simpson.jpg",
//     "http://2.bp.blogspot.com/-XKkwwaNcQp0/UHlgkuq5E7I/AAAAAAAABTI/fAtYElMP9T8/s640/Panda+Tope.jpg"
//   ];
//   let imagesHomer = [
//     "http://360es.com/es/wp-content/uploads/2015/01/Homer-Simpson-un-ejemplo-de-emprendedor.jpeg",
//     "http://cdn.skim.gs/images/homer-simpson-doughnuts/what-homer-simpson-taught-us-about-doughnuts",
//     "https://pbs.twimg.com/profile_images/818630169728454656/_F0UzZKc.jpg"
//   ]
//
//   return (personaje == 'Bart') ? imagesBart : imagesHomer;
// }

// app.get('/simpsons',(req,res)=>{
//   console.log("la query es: ");
//   console.log(req.query);
//   res.render('simpsons', {
//     title: "EL GET",
//     images:getImagenes(req.query.personaje),
//     color:"white",
//     pepe: '<p class="hola">holaa</p>'
//   });
// });
//
//
// app.post('/simpsons',(req,res) => {
//   console.log("el body es: ");
//   console.log(req.body);
//   console.log(req.query)
//   res.render('simpsons', {
//     title: "EL POST",
//     images:getImagenes(req.body.personaje),
//     color: req.query.color,
//     pepe: "hola que tal"
//   });
// });

app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
