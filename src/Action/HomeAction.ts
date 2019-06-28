"use strict";

import {Application, Request, Response} from "express";


const HomeAction = {
    execute: (req: Request, res: Response) => {

        res.render('home');
    }
};


export default HomeAction;
