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

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

var bodyParser = require('body-parser');

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/home', (request, res) => {
  res.render('home');
});
app.get('/', (request, res, next) => {
  res.render('home');
});

// app.get('/random', (request, res, next) => {
//   // Retrieve a random chuck joke
//   client.getRandomJoke()
//     .then((response) => {
//       res.render('random', response);
//     }).catch((err) => {
//       // handle error
//     });
// });

// app.get('/categories', (request, res, next) => {
//   if (request.query.cat === undefined) {
//     client.getJokeCategories()
//       .then((response) => {
//         let data = [];
//         for (let item of response) {
//           let link = "http://localhost:3000/categories?cat=" + item;
//           data.push(link);
//         }
//         let objData = {};
//         objData.links = data;
//         res.render('index', objData);
//       })
//       .catch((err) => {
//         // handle error
//       });
//   } else {
//     client.getRandomJoke(request.query.cat)
//       .then((response) => {
//         // use the response here
//         let objData = {};
//         objData.joke = response.value;
//         res.render('joke-by-category', objData);
//       }).catch((err) => {
//         // handle error
//       });
//   }
// });

// app.get('/search', (request, res, next) => {
//   res.render('search-form');
// });

// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.post('/search', function (req, res) {
//   client.search(req.body.categ)
//     .then(function (response) {
//       let arraData=[];
//       response.items.forEach(element => {
//         arraData.push(element.value)
//       });
//       let arraObj={jokes:arraData};
//       res.render('search-result',arraObj);
//     }).catch(function (err) {
//       // handle error
//     });
// });



// Server Started
app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});