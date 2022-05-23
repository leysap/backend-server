const express = require("express")
const app = express()
const Contenedor = require("./desafio")
const leerArchivo= new Contenedor("productos.txt")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html")
})

//USANDO MOTOR DE PLANTILLAS: PUG
app.set('views', './productos_views');
app.set('view engine', 'pug');

app.get('/productos', (req, res) => {
    const agregarProducto = async() => {
        try{
            const data = await leerArchivo.getAll()
            res.render('productos', { data:data});

        }catch(error){
            throw new Error(error)
        }
    }
    agregarProducto()
});

app.post("/productos", (req,res) => {
    const agregarProducto = async() => {
        try{
            const objetoNuevo = req.body
            console.log(objetoNuevo)
            await leerArchivo.save(objetoNuevo)
            const data = await leerArchivo.getAll()
            res.redirect('/productos')

        }catch(error){
            throw new Error(error)
        }
    }
    agregarProducto()
})

app.listen(8080, () => {
    console.log("Server listening in PORT 8080")
})