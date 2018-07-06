const express = require('express');
const path = require('path');
const morgan = require('morgan');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const port= 3000;
const app = express(); // Express App



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const spotyRoutes = require('./routes/spoty');
app.use('/', spotyRoutes);

app.listen(port, () => console.log("Escuchando en el puerto", port));