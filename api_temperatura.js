//-----Modulos-----//
const express = require("express");
const asyncHandler = require('express-async-handler');
var cors = require('cors');
const app = express();
app.use(cors());
var moment = require('moment');


var bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

//------------Conexion-Mongo-------------//
var moongoose = require('mongoose');
moongoose.connect('mongodb://localhost:27017/mqttJS', async (err)=>{
    if (err){
        throw err
    }
    console.log('Conectado')
});

//--------Schema---------------------------//
var AgreTemp = moongoose.Schema({
    Temp: String, 
    NoCo: String,
    Fecha: Date
});

var Tabla = moongoose.model('mqttjs', AgreTemp);

//----------POST-Agregar-Temperatura-------------//
app.post('/agregarTemperatura', asyncHandler( async(req, res, next) => { 
    var fecha = moment();
    console.log(fecha);
    var insert = new Tabla({Temp:req.body['Temp']+"", NoCo:req.body['NoCo'], Fecha: fecha.format()});
    insert.save(function(err){
        if(err){
            console.log('Error: No se guardo')
            return res.json({"R":500});
        }
        console.log('Guardado con exito')
        return res.json({"R":200})
    });
}));


//---------POST-Obtener-Temperatura------------------//
app.post('/obtenerTemperatura',asyncHandler(async(req,res,next)=>{
    if(! 'Z'.includes(req.body['FI'])){
        req.body.FI=req.body['FI']+'.000Z';
        req.body.FF=req.body['FF']+'.000Z';
    }
    var Tipo = req.body.Tipo
    var FI = req.body.FI
    var FF = req.body.FF
    console.log(FI);
    console.log(FF); 
   
    //-------------Obtener-Completo--------//
    if(Tipo == "Completa"){
        Tabla.find({NoCo: req.body['NoCo']+""}, function(err,result){
            if(err){
                return res.json({'R':500})
            }else{
                return res.json({'R':200,'D':result})
            }
        })
    }
    //------------Obtener-Rango------------------------//

    if(Tipo == "Rango"){
       Tabla.find({NoCo: req.body['NoCo']+"", Fecha:{
            $gte: new Date(FI),
            $lt: new Date(FF)
        }}, function(err,result){
            if(err){
                return res.json({'R':500})
            }
            else{
                return res.json({'R':200, 'D':result})
            }
        })
    }else{
        return res.json({'R':400})
    }
}));


//------Puerto-a-correr--------//
var server = app.listen(9091, function(){
    console.log('El servidor esta corriendo...')
});