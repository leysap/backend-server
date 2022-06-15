const Knex = require('knex').default;

const options = {
    filename: "../DB/ecommerce.sqlite"
}

const knex = Knex({
  client: 'sqlite3',
  connection: options,
  useNullAsDefault: true
});

const ejecutar = async () => {

    await knex.schema.dropTableIfExists("mensajes");
  
    await knex.schema.createTable("mensajes", (table) => {
      table.string("email", 15).notNullable();
      table.dateTime("date").notNullable();
      table.string("mensaje", 250).notNullable();
  
    });
  
    const timestamp = `${new Date().toLocaleDateString()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
  
    await knex("mensajes").insert([
      {email: "veronica_l@hotmail.com", date: timestamp, mensaje: "Hola!!"},
      {email: "matias9477@hotmail.com",date: timestamp, mensaje: "Hola gente!"},
    ]);
  
    console.log(await knex.from("mensajes").select("*"));
  
    await knex.destroy()
  }
  
  ejecutar();