const Contenedor = require("./desafio")
const express = require("express")
const app= express()

const leerArchivo = new Contenedor("productos.txt")

app.get("/productos", (req, res, next) => {
    const traerProductos = async () => {
        try{
            const data = await leerArchivo.getAll()
            res.send(data)
        }catch(error){
            throw new Error(error)
        }
    };
    traerProductos()
})

app.get("/productoRandom", (req,res, next) => {

    const productoRandom = async () => {
        try{
            const data = await leerArchivo.getAll()
            const longitud = data.length;
            const numeroRandom = (Math.floor(Math.random()*longitud))+1

            for(let i=0; i< data.length; i++){
                if(numeroRandom==data[i].id){
                    res.send(data[i])
                }
            }
        }catch(error){
            throw new Error(error)
        }
    }
    productoRandom()
})

app.listen(8080, () => {
    console.log("Escuchando...")
})