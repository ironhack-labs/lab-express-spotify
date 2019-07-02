'use strict';
import {Application} from "express";


import routerBuilder from "./Routes/BuildRouter";
import SpotifiCX from "./Servicios/SpotifiCX";
import ServerConfig from "./Config";


var cors = require('cors');

const express = require('express');
const app: Application = express();

app.use(cors());

SpotifiCX.solicitarToken( null)
    .then(
        (  ) =>{
            console.log('token spotify recibido !!!');
        }
    )
    .catch((error:any) =>{
            console.log('error al solicitar token spotify error');
        }

    )
;


routerBuilder(app);


app.listen(ServerConfig.port, () => console.log(`backend on  ${ServerConfig.urlBase}!`));
