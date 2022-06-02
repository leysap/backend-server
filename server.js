const Contenedor = require("./desafio")
const express = require("express")
const {Server: HttpServer}= require("http")
const {Server: IOServer} = require("socket.io")
const fs= require("fs")
const leerArchivo = new Contenedor("productos.txt")

// const route = express.Router()
const app= express()
const {engine} = require("express-handlebars")

const httpServer= new HttpServer(app)
const ioServer= new IOServer(httpServer)

//MOTOR DE PLANTILLAS: HANDLEBARS
app.engine(
    "hbs",
    engine({
        extname:".hbs",
        defaultLayout:"index.hbs"
    })
)

app.set("views", "./public/views")
app.set("view engine", "hbs")
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))

// app.get("/", (req,res) => {
//     res.sendFile("formulario")
// })
// app.use("/api", route)

app.get("/", (req, res) => {
    const traerProductos = async () => {
        try{
            const data = await leerArchivo.getAll()
            res.render("formulario", {data:data}) 
            
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
            res.redirect("/") 
        }catch(error){
            throw new Error(error)
        }
    }
    agregarProducto()
})

//WEBSOCKETS
const chatParseado= JSON.parse(fs.readFileSync("chatMensajes.txt"))

ioServer.on("connection", async (socket) => {

    console.log("Usuario conectado")

    //PRODUCTOS
    socket.emit("products", await leerArchivo.getAll())
    socket.on("new_product", async(producto) => {
        console.log(producto)
        await leerArchivo.save(producto)
        const data = await leerArchivo.getAll()
        ioServer.sockets.emit("products", data)
    })

    //MENSAJES -CHAT
    socket.emit("messages",chatParseado)
    socket.on("new_message", async(mensaje) =>{   
        chatParseado.push(mensaje);
        ioServer.sockets.emit("messages", chatParseado)
        await fs.promises.writeFile("chatMensajes.txt", JSON.stringify(chatParseado))
        
    })
})

httpServer.listen(8080, () => {
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