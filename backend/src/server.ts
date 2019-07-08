'use strict';
import {Application} from "express";


import routerBuilder from "./Routes/BuildRouter";
import ServerConfig from "./Config";


const cors = require('cors');

const express = require('express');
const app: Application = express();

app.use(cors());


routerBuilder(app);

app.listen(ServerConfig.backPort, () => console.log(`backend on  ${ServerConfig.urlApi}!`));
