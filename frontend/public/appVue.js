'use strict';

/**
 * Created by David on 27/06/2019.
 */
const urlApi='http://localhost:3010/api/';


const app= new Vue({
   el:"#app",
   data:{
      isDebug:true,
      vista:'buscar',
      Url:{
         "buscar": urlApi + "buscar-artista/",
         "albums": urlApi + "artist-albums/",
         "tracks": urlApi + "buscar-artista/"
      },
      textobuscado:"michael jackson",
      resultadosBuscarArtista:{ texto:'', next:'', total:0, items:[]}
   },
   methods:{
      onBuscarArtista:function(){
         if(this.textobuscado.trim() === ""){
             alert('Falta texto');
             return ;
         }

         let fnSuccess = (data)=>{
            console.log(data);

            this.vista='resultados-buscar';
            this.resultadosBuscarArtista.texto = data.data.texto;
            this.resultadosBuscarArtista.next = data.data.next;
            this.resultadosBuscarArtista.items = data.data.items;
         };


         let fnError = (data)=>{
            alert('Error');
         };

         const url = this.Url.buscar + encodeURI(this.textobuscado);
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
   mounted(){

      console.log('mounted');
   }
});
