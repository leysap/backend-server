const Contenedor = require("./desafio")
const fs = require("fs")
const express = require("express")
const route = express.Router()
const app= express()

const leerArchivo = new Contenedor("productos.txt")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/public/index.html")
})

route.get("/productos", (req, res, next) => {
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

route.get("/productos/:productoId", (req,res) => {
    const idProd = async() => {
        try{
            const idProducto = req.params.productoId;
            const data = await leerArchivo.getAll()
            const productoEncontrado =  data.find(producto => producto.id == idProducto)
            if(!productoEncontrado) res.status(404).send({error:'Producto no encontrado'})
            else res.json(productoEncontrado)
        }catch(error){
            throw new Error(error)
        }
    }
    idProd()
})

route.post("/productos",(req,res) => {    
    const agregarProducto = async() => {
        try{
            const objetoNuevo = req.body
            const ruta= req.body.thumbnail
            console.log(ruta)
            console.log(objetoNuevo)
            const idNuevo = await leerArchivo.save(objetoNuevo)
            res.send({
                objetoNuevo,
                idNuevo
            })
        }catch(error){
            throw new Error(error)
        }
    }
    agregarProducto()
})

route.put("/productos/:id", (req,res) => {    
    const actualizarProduct = async() => {
        try{
            const idProducto = req.params.id -1;
            const data = await leerArchivo.getAll()

            const idProd = req.params.id;
            const objetoEncontrado = await leerArchivo.getById(idProd)
            
            data[idProducto].title = req.body.title
            data[idProducto].price= req.body.price
            data[idProducto].thumbnail = req.body.thumbnail

            await fs.promises.writeFile("productos.txt", JSON.stringify(data))

            res.json({
                objetoAnterior:objetoEncontrado,
                reemplazo: data[idProducto]
            })

            await leerArchivo.getAll()
        }catch(error){
            throw new Error(error)
        }
    }
    actualizarProduct()
})

route.delete("/productos/:id", (req,res) => {    
    const idProd = async() => {
        try{
            const idProducto = parseInt(req.params.id);
            await leerArchivo.deleteById(idProducto)

            res.json({
                numeroIdEliminado: idProducto
            })
        }catch(error){
            throw new Error(error)
        }
    }
    idProd()
})

route.get("/productoRandom", (req,res, next) => {

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

app.use("/api", route)

app.listen(8080, () => {
    console.log("Escuchando... puerto 8080")
})