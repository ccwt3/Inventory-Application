const { Client } = require("pg");
require("dotenv").config();

const SQL = ``;

async function main() {
  console.log("starting...");

  const conectionString =
    process.argv[2] ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`;
  
  if(!conectionString) {
    console.error("Set a database URL as an argument");
    process.exit(1);
  }

  const client = new Client({ conectionString });
  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log("DONE!");
}

main();
