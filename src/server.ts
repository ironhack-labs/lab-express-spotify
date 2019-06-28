'use strict';

import {Application, Request, Response} from "express";
import routerBuilder from "./Action/Routes/BuildRouter";


const express = require('express');
const app: Application = express();


app.use(express.static('public'));

const path = require('path');


app.use(express.static( path.join(__dirname, '../public')));



const pathViews = path.join(__dirname, '../views');

app.set('views',pathViews);
app.set('view engine', 'hbs');


const hbs = require('hbs');
hbs.registerHelper('vue-js', function(options:any) {
    return options.fn();
});

routerBuilder(app);


const port: number = 3010;
app.listen(port, () => console.log(`app on port ${port}!`));