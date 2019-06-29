'use strict';
import {Application} from "express";


import routerBuilder from "./Routes/BuildRouter";
import SpotifiCX from "./Servicios/SpotifiCX";
import ServerConfig from "./Config";


const express = require('express');
const app: Application = express();


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
