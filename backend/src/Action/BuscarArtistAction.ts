"use strict";

import {Application, Request, Response} from "express";


const BuscarArtistAction = {
    execute: (req: Request, res: Response) => {

        let texto :string = req.params.texto;
        res.json({ope:"ok"});
    }
};


export default BuscarArtistAction;
