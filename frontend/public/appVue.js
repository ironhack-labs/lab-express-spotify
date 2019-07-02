'use strict';

/**
 * Created by David on 27/06/2019.
 */
const urlApi = 'http://localhost:3010/api/';


const app = new Vue({
   el: "#app",
   data: {
      isDebug: true,
      vista: 'buscar',
      Url: {
         "buscar": urlApi + "buscar-artista/",
         "albums": urlApi + "artist-albums/",
         "tracks": urlApi + "buscar-artista/"
      },
      textobuscado: "michael jackson",
      listaArtistas: [],
      resultadosBuscarArtista: {texto: '', next: '', total: 0, items: []},
      nextBuscar: ''
   },
   methods: {

      onBuscarAlbums: function ($event, artista, urlNext = '') {

         const idArtista = artista.id;

         let url = this.Url.albums + idArtista;


         if (urlNext) {
            url = urlNext;
         } else {
            artista.listaAlbums = [];
         }


         let fnSuccess = (respuesta) => {

            const data = respuesta.data.data;
            console.log(data);

            let lista = data.items;

            lista.forEach(item => {
               artista.listaAlbums.push(item);
            });

         };


         let fnError = (data) => {
            alert('Error');
         };


         this.RequestGet(url, fnSuccess, fnError);

      },
      onShowFormBuscar: function () {
         this.vista = 'buscar';
      },
      onBuscarArtista: function (event, urlNext = '') {


         let url = this.Url.buscar + encodeURI(this.textobuscado.trim());


         if (urlNext) {
            url = urlNext;
         } else {

            if (this.textobuscado.trim() === "") {
               alert('Falta texto');
               return;
            }

            this.listaArtistas = [];
         }


         let fnSuccess = (respuesta) => {

            const data = respuesta.data.data;
            console.log(data);

            this.vista = 'resultados-buscar';
            this.resultadosBuscarArtista.texto = data.texto;
            this.resultadosBuscarArtista.next = data.next;
            this.resultadosBuscarArtista.items = data.items;

            this.nextBuscar = data.next;

            let lista = this.resultadosBuscarArtista.items;

            lista.forEach(item => {
               if (item.images && item.images.length > 0) {
                  item.urlImage = item.images[0].url ? item.images[0].url : null;
               }

               this.listaArtistas.push(item);
            });

         };


         let fnError = (data) => {
            alert('Error');
         };


         this.RequestGet(url, fnSuccess, fnError);

      },
      RequestPost: function (url, data, fnSuccess, fnError) {


         const formData = new FormData();

         for (const property in data) {
            if (data.hasOwnProperty(property)) {
               formData.append(property, data[property]);
            }
         }


         if (this.isDebug) {
            console.log(url);
         }

         this.$http.post(url, data)
             .then(
                 (respuesta => {
                    if (this.isDebug) {
                       console.log(respuesta);
                    }
                    fnSuccess(respuesta);
                 }),
                 (respuesta => {
                    if (this.isDebug) {
                       console.log(respuesta);
                    }
                    fnError(respuesta);
                 })
             );

      },
      RequestGet: function (url, fnSuccess, fnError) {

         if (this.isDebug) {
            console.log(url);
         }

         this.$http.get(url)
             .then(
                 (respuesta => {
                    if (this.isDebug) {
                       console.log(respuesta);
                    }
                    fnSuccess(respuesta);
                 }),
                 (respuesta => {
                    if (this.isDebug) {
                       console.log(respuesta);
                    }
                    fnError(respuesta);
                 })
             );
      },
   },
   mounted() {

      console.log('mounted');
   }
});
