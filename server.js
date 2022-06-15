const Contenedor = require("./claseProductos")
const Mensaje = require("./claseMensaje")
const express = require("express")
const {Server: HttpServer}= require("http")
const {Server: IOServer} = require("socket.io")

//MYSQL
const options = {
    host: "127.0.0.1",
    user:"root",
    password:"root1234",
    port: "3306",
    database:"midb"
}

// SQLITE
const optionSq = {
    filename: "./DB/ecommerce.sqlite"
}

//Instanciamos las clases
const productos = new Contenedor(options,"productos")
const mensaje = new Mensaje(optionSq, "mensajes")

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


app.get("/", (req, res) => {
    const traerProductos = async () => {
        try{
            const data = await productos.getAll()
            res.render("formulario", {data:data}) 

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
            await productos.save(objetoNuevo)
            res.redirect("/") 
        }catch(error){
            throw new Error(error)
        }
    }
    agregarProducto()
})

//WEBSOCKETS

ioServer.on("connection", async (socket) => {

    console.log("Usuario conectado")

    //PRODUCTOS
    socket.emit("products", await productos.getAll())
    socket.on("new_product", async(producto) => {
        console.log(producto)
        await productos.save(producto)
        const data = await productos.getAll()
        ioServer.sockets.emit("products", data)
    })

    //MENSAJES -CHAT
    socket.emit("messages",await mensaje.getAll())
    socket.on("new_message", async(mensajenuevo) =>{   
        await mensaje.save(mensajenuevo)
        ioServer.sockets.emit("messages", await mensaje.getAll())
        
    })
})

httpServer.listen(8080, () => {
    console.log("Server listening in port 8080")
})
