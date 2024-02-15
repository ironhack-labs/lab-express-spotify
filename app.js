require('dotenv').config();


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


/** Init configurations */
require('./configs/hbs.config')

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

/**setup express middlewares */
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


/** connect app routes */ 
const routes = require('./configs/router.config');
app.use('/', routes);

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
