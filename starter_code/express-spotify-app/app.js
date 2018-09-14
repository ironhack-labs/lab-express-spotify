var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser')

const port = 3000;


var clientId = 'e2d22378a9b64a229d23951a6e86ce9c',
  clientSecret = 'ae2f3774784241a68d9e799d8f7833cd';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });


const publicDir = __dirname + "/public";
app.use(express.static(publicDir));


app.use(bodyParser.urlencoded({
  extended: true
}));


hbs.registerPartials(__dirname + "/views/partials");
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.get('/', (req, res) => {
  res.render("home")
});


app.get('/artists', (req, res) => {
  let mySearch = req.query.artistName;
  console.log(`Searching for: ${mySearch}`);

  spotifyApi.searchArtists(mySearch)
    .then(data => {
      let myData = data.body.artists.items;
      console.log(`Found ${myData}`);
      res.render("artists", { myData });
    })
    .catch(err => {
      "Error in GET request for that artist"
    })

})

app.listen(port, () => console.log(`Escuchando puerto ${port}`));