"use strict";

import {Application, Request, Response} from "express";


const BuscarArtistAction = {
    execute: (req: Request, res: Response) => {

        res.json({ope:"ok"});
    }
};


export default BuscarArtistAction;
