
<div class ="animals__container">
  <img src="{{photo}}" alt="">
  <h3>{{photo}}</h3>
{{#each photo}}

{{#each this.images}}
   <h3>{{this.url}}</h3>
      <a href="{{this.href}}">Link to more</a>    

<img src="{{this.url}}" alt="">

{{/each}}
 {{/each }}

    </div>


</div>











<div class ="animals__container">
  <img src="{{photo.url}}" alt="">
 
{{#each artists}}
  <h3>{{this.url}}</h3>
 {{#each this.images}}
 
      <div><a href="{{this.href}}">Link to more</a>    </div>

<img src="{{this.url}}" alt="">

 {{/each}}
{{/each }}

    </div>


</div>


