const express = require('express')
const router = express.Router()

//Muestra formulario
router.get('/',(req,res)=>{
  const {search} = req.query
  const busqueda = {
    name:search
  }
  if(search){
    // res.send(search)
    res.render('artists',busqueda) 
  } else {
    res.render('home')
  }
})

module.exports = router