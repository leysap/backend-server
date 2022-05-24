const Contenedor = require("./desafio")
const fs = require("fs")
const express = require("express")
// const route = express.Router()
const app= express()
const {engine} = require("express-handlebars")

const leerArchivo = new Contenedor("productos.txt")

//USANDO MOTOR DE PLANTILLAS: HANDLEBARS
app.engine(
    "hbs",
    engine({
        extname:".hbs",
        defaultLayout:"index.hbs"
    })
)

app.set("views", "./views")
app.set("view engine", "hbs")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html")
})
// app.use("/api", route)

app.get("/productos", (req, res, next) => {
    const traerProductos = async () => {
        try{
            const data = await leerArchivo.getAll()
            res.render('main', {data:data}) 
            
            // res.send(data)
        }catch(error){
            throw new Error(error)
        }
    };
    traerProductos()
})

app.post("/productos",(req,res) => {    
    const agregarProducto = async() => {
        try{
            const objetoNuevo = req.body
            console.log(objetoNuevo)
            await leerArchivo.save(objetoNuevo)
            const data = await leerArchivo.getAll()
            res.render('main', {data:data})
            // res.send({
            //     objetoNuevo,
            //     idNuevo
            // })
        }catch(error){
            throw new Error(error)
        }
    }
    agregarProducto()
})
app.listen(8080, () => {
    console.log("Server listening in port 8080")
})

// route.get("/productos/:productoId", (req,res) => {
//     const idProd = async() => {
//         try{
//             const idProducto = parseInt(req.params.productoId);
//             if(isNaN(idProducto)) return res.status(400).send({error: 'El parametro no es un numero'});
//             const data = await leerArchivo.getAll()
//             const productoEncontrado =  data.find(producto => producto.id == idProducto)
//             if(!productoEncontrado) res.status(404).send({error:'Producto no encontrado'})
//             else res.json(productoEncontrado)
//         }catch(error){
//             throw new Error(error)
//         }
//     }
//     idProd()
// })

// route.put("/productos/:id", (req,res) => {    
//     const actualizarProduct = async() => {
//         try{
//             const idProducto = parseInt(req.params.id -1);
//             if(isNaN(idProducto)) return res.status(400).send({error: 'El parametro no es un numero'});
//             const data = await leerArchivo.getAll()

//             const idProd = parseInt(req.params.id);
//             if(isNaN(idProd)) return res.status(400).send({error: 'El parametro no es un numero'})
//             const objetoEncontrado = await leerArchivo.getById(idProd)
//             if(!objetoEncontrado) return res.status(400).send({error: 'Producto no existente'})
            
//             data[idProducto].title = req.body.title
//             data[idProducto].price= req.body.price
//             data[idProducto].thumbnail = req.body.thumbnail

//             await fs.promises.writeFile("productos.txt", JSON.stringify(data))

//             res.json({
//                 objetoAnterior:objetoEncontrado,
//                 reemplazo: data[idProducto]
//             })

//             await leerArchivo.getAll()
//         }catch(error){
//             throw new Error(error)
//         }
//     }
//     actualizarProduct()
// })

// route.delete("/productos/:id", (req,res) => {    
//     const idProd = async() => {
//         try{
//             const idProducto = parseInt(req.params.id);
//             if(isNaN(idProducto)) return res.status(400).send({error: 'El parametro no es un numero'});

//             const data = await leerArchivo.getAll()
//             const productoEncontrado =  data.find(producto => producto.id == idProducto)
//             if(!productoEncontrado) res.status(404).send({error:'Producto no encontrado'})
//             else await leerArchivo.deleteById(idProducto)
//             res.json({
//                 numeroIdEliminado: idProducto
//             })
//         }catch(error){
//             throw new Error(error)
//         }
//     }
//     idProd()
// })

// route.get("/productoRandom", (req,res, next) => {

//     const productoRandom = async () => {
//         try{
//             const data = await leerArchivo.getAll()
//             const longitud = data.length;
//             const numeroRandom = (Math.floor(Math.random()*longitud))+1

//             for(let i=0; i< data.length; i++){
//                 if(numeroRandom==data[i].id){
//                     res.send(data[i])
//                 }
//             }
//         }catch(error){
//             throw new Error(error)
//         }
//     }
//     productoRandom()
// })