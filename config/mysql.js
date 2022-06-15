const Knex = require('knex').default;

const options = {
    host: "127.0.0.1",
    user:"root",
    password:"root1234",
    port: "3306",
    database:"midb"
  }

const knex = Knex({
  client: 'mysql2',
  connection: options
});

const ejecutar = async () => {
  await knex.schema.dropTableIfExists("productos");
  await knex.schema.createTable("productos", (table) => {
    table.increments("id").primary().notNullable();
    table.string("title", 80).notNullable();
    table.float("price").notNullable();
    table.string("thumbnail", 250).notNullable();
   
  });
  await knex("productos").insert([
    {title: "Lapiz", price: 40, thumbnail: ` https://cdn3.iconfinder.com/data/icons/education-209/64/pencil-pen-stationery-school-256.png`},
    {title: "Reloj", price: 5000, thumbnail: `https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-512.png`},
    {title: "Manzana", price: 30, thumbnail: `https://cdn3.iconfinder.com/data/icons/education-209/64/apple-fruit-science-school-512.png`}
  ]);

  console.log(await knex.from("productos").select("*"));

  await knex.destroy()
}

ejecutar();