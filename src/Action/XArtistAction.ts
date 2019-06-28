"use strict";

import {Application, Request, Response} from "express";


const XArtistAction = {
    execute: (req: Request, res: Response) => {

        res.json({ope:"ok"});
    }
};


export default XArtistAction;
