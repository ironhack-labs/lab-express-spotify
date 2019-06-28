'use strict';
import {Application, Request, Response} from "express";

import routerBuilder from "./Action/Routes/BuildRouter";
import SpotifiCX from "./Action/PromiseFactory/SpotifiCX";


const express = require('express');
const app: Application = express();


SpotifiCX.solicitarToken()
    .then(
        ()=>{
            console.log('token spotify recibido !!!');
        }
    )
    .catch((error) =>{
            console.log('error al solicitar token spotify error');
        }

    )
;


routerBuilder(app);

const port: number = 3010;
app.listen(port, () => console.log(`backend on port ${port}!`));
