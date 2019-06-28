'use strict';
import {Application, Request, Response} from "express";

import routerBuilder from "./Action/Routes/BuildRouter";
import {BuscarArtistaPromise, solicitarToken} from "./Action/PromiseFactory/BuscarArtistaPromise";


const express = require('express');
const app: Application = express();

solicitarToken();

routerBuilder(app);


const port: number = 3010;
app.listen(port, () => console.log(`backend on port ${port}!`));