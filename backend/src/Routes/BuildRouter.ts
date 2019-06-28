import {Application, Request, Response} from "express";
import BuscarArtistAction from "../Action/BuscarArtistAction";
import ArtistAlbumsAction from "../Action/ArtistAlbumsAction";


function routerBuilder(app: Application) {

   app.get("/debug", function (req: Request, res: Response) {
      res.send('yea baby');
   });


   app.get("/", function (req: Request, res: Response) {
      res.send('i´m backend :)')
   });


   app.get("/api/buscar-artista/:texto", function (req: Request, res: Response) {

      let texto: string = req.params.texto || null;
      BuscarArtistAction.execute(res, texto);
   });


   app.get("/api/artist-albums/:texto/:pagina?", function (req: Request, res: Response) {

      let idArtista: string = req.params.texto || null;
      let pagina: string = req.params.pagina || "1";

      ArtistAlbumsAction.execute(res, idArtista, pagina);
   });

}


export default routerBuilder;
