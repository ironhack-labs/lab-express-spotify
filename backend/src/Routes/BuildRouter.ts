import {Application, Request, Response} from "express";
import BuscarArtistAction from "../Action/BuscarArtistAction";
import ArtistAlbumsAction from "../Action/ArtistAlbumsAction";
import TracksAction from "../Action/TracksAction";
import UrlApi from "./UrlApi";


function routerBuilder(app: Application) {

   app.get("/debug", function (req: Request, res: Response) {
      res.send('yea baby');
   });


   app.get("/", function (req: Request, res: Response) {
      res.send('i´m backend :)')
   });


   //'buscar-artista'
   app.get(`/api/${UrlApi.BuscarArtista}/:texto/:pagina?`, function (req: Request, res: Response) {

      let texto: string = req.params.texto || "";
      let pagina: string = req.params.pagina || "1";

      BuscarArtistAction.execute(res, texto, pagina);
   });


   //artist-albums
   app.get(`/api/${UrlApi.Albums}/:idArtista/:pagina?`, function (req: Request, res: Response) {

      let idArtista: string = req.params.idArtista || "";
      let pagina: string = req.params.pagina || "1";

      ArtistAlbumsAction.execute(res, idArtista, pagina);
   });


   //tracks
   app.get(`/api/${UrlApi.Tracks}/:idAlbum/:pagina`, function (req: Request, res: Response) {

      let idAlbum: string = req.params.idAlbum || "";
      let pagina: string = req.params.pagina || "1";
      TracksAction.execute(res, idAlbum, pagina);

   });


}


export default routerBuilder;
