const { Client } = require("pg");
require("dotenv").config();

const SQL = `
  DROP TABLE IF EXISTS 
  ideal_climate, 
  final_size, 
  watering, 
  light_requirements, 
  seeds_name, 
  inventory 
  CASCADE
;`;

async function main() {
  console.log("deleting...");

  const connectionString =
    process.argv[2] ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`;

  const client = new Client({ connectionString });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("Eliminada");
  } catch (err) {
    console.log(err.message);
  } finally {
    await client.end();
  }
}

main();
