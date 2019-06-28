'use strict';

/**
 * Created by David on 27/06/2019. *
 *
 */



import {Application, Request, Response} from "express";


const express = require('express');

const app = express();

app.use(express.static('public'));


app.get("/debug", function (req, res) {
    res.send('yea baby');
});

const port = 4001;
app.listen(port, () => console.log(`app  on port ${port}!`));