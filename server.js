const Contenedor = require("./desafio")
const fs = require("fs")
const express = require("express")
const app= express()

app.get("/productos", (req, res) => {
    try{
        fs.readFile("productos.txt", (error,datos) => {
            const data = JSON.parse(datos)
            res.send(data)
        })
    }catch(error){
        res.send(error)
    }
})

app.get("/productoRandom", (req,res) => {
    try{
        fs.readFile("productos.txt", (error,datos) => {
            const datosParseado = JSON.parse(datos)

            const longitud = datosParseado.length;
            const numeroRandom = (Math.floor(Math.random()*longitud))+1

            for(let i=0; i< datosParseado.length; i++){
                if(numeroRandom==datosParseado[i].id){
                    res.send(datosParseado[i])
                }
            }
        })
    }catch(error){
        res.send(error)
    }
})

app.listen(8080, () => {
    console.log("Escuchando hola hola...")
})