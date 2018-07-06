const express = require('express');
const path = require('path');
const port = 3000;
const bodyParser = require('body-parser');
const hbs = require('hbs');

const app = express();
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static(path.join( __dirname, 'public' )));
app.set('view engine', 'hbs');
app.set('views', path.join( __dirname, 'views' ));

const spotifyRoutes = require('./routes/spotify');
app.use('/', spotifyRoutes);

app.listen(port, ()=>{
  console.log('corriendo en el 3000');
});