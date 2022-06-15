const Knex = require("knex").default

class Mensaje{

    constructor(options,tabla) {
        this.knex = Knex({
            client: 'sqlite3',
            connection: options,
            useNullAsDefault: true
        });
      this.tabla = tabla;
    }

    //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
   async save(objeto){
    try{
      await this.knex(this.tabla).insert([
        {email: objeto.email, date: objeto.date, mensaje: objeto.mensaje}]);   
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

}

module.exports= Mensaje

