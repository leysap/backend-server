const Knex = require("knex").default

class Contenedor{

    constructor(options,tabla) {
      this.knex = Knex({
        client: 'mysql2',
        connection: options
      });
      this.tabla = tabla;
      
    }

    //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
   async save(objeto){
    try{
      await this.knex(this.tabla).insert([
        {title: objeto.title, price: objeto.price, thumbnail: objeto.thumbnail}]);
      objeto.id = await this.knex(this.tabla).max("id");
      
      return objeto.id;
      
    }catch(error){
        throw error
    }  
   }

   // getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
    async getById(id){
       try{
        // const contenido = await fs.promises.readFile(this.fileName)
        // const objeto = JSON.parse(contenido)

        // let objetoId = objeto.find((x) => x.id == id) || null;
        
        // return objetoId;
        return {error: 'Funcionalidad getById deprecada'}
       }catch(error){
            throw error
       }
   }

   // getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
   async getAll(){
    try{
      const array = await this.knex.from(this.tabla).select("*");
      return array;
    }catch(error){
        throw(error)
    }
   }

   // deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
   async deleteById(id){
       try{
        await this.knex.from(this.tabla).where({ "id": id }).del();
        // const contenido = await fs.promises.readFile(this.fileName)
        // const contenidoParseado = JSON.parse(contenido)
        // let arrayFiltrado = contenidoParseado.filter((x) => x.id !== id)
    
        // await fs.promises.writeFile(this.fileName, JSON.stringify(arrayFiltrado))
        return console.log("Producto eliminado con exito")
       }catch(error){
        throw error
       }
   }
   
}

module.exports= Contenedor

