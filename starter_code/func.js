
function myFunction(value, index, array) {
  txt = txt + value + "<br>";
}

module.exports={
    format:function(data)
	{
	 let allData=[];
	 let myrow=[];
	 
	 let cnt=0;
	  
     for (let i=0;i<data.length;i++){
		 let item={};
		 console.log(data[i].images.length);
		 console.log(data[i].name);
		 if (data[i].images.length>0){
		   item.url=data[i].images[0].url;	 
	       console.log(data[i].images[0].url);
		 }
		 else
			 item.url="/images/notfound.png";
		 item.name=data[i].name;
		 let parts=data[i].uri.split(":");
		 item.uri=parts[2];
		 console.log(data[i].name);
		 console.log(cnt);
		 myrow.push(item);
		 
		 cnt++;
		 if (cnt==3){
		   cnt=0;	 
		   allData.push({myrow});	 
		   myrow=[];
		 }
	 }	
      if (myrow.length>1)
		   allData.push(myrow);
	  let allItems={allData}; 
      return allItems;	   
	
	},
	
}