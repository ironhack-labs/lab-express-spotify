require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const SpotifyWebApi = require('spotify-web-api-node');



mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);


module.exports = app;



// setting the spotify-api goes here:

const clientId = 'b3de99af27fa47f68ae78aebe6c51ee6',
    clientSecret = 'c3c42dfd908e40969db317d2b26d879f';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })



// the routes go here:

app.get('/', (req, res) => {
  res.render('index')
})


app.get("/artists",(req,res,next)=>{
  console.log(req.query.artists)
 
  spotifyApi.searchArtists(req.query.artists)
  .then(data => {

    console.log("The received data from the API: ", data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artists',{data})
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })

  

})
app.get("/albums/:artistId",(req,res,next)=>{
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data =>{
    console.log(data.body.items[0])
    res.render('albums', {data})
  })
  .catch(err => {
    console.log("The error while searching album occurred: ", err);
  })
})



app.listen(4000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));






app.get('/search', (req, res, next) => {
  res.send(req.query)
})