const express = require('express');
const app = express();
const path = require('path');
//var morgan = require('morgan');

const bodyParser = require('body-parser');

// handlebars middlewares
const hbs = require('express-handlebars');
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'main', layoutDir: __dirname + '/views/layout/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//static
app.use(express.static('public'));

//body  parser middlewares
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({
  extended: true
})); 

//middleware morgan
//app.use(morgan('dev'));

var routesSearch = require('./routes/index');

app.use("/artist", routesSearch);




app.listen(4000);