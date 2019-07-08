'use strict';
import {Application} from "express";


import routerBuilder from "./Routes/BuildRouter";
import ServerConfig from "./Config";


var cors = require('cors');

const express = require('express');
const app: Application = express();

app.use(cors());



routerBuilder(app);


app.listen(ServerConfig.port, () => console.log(`backend on  ${ServerConfig.urlBase}!`));
