const pool = require("./pool");

async function getItemInfo(id) {
  const { rows } = await pool.query(
    `
    SELECT seed, climate, size, consistency, sunlight
    FROM inventory
    INNER JOIN seeds_name
    ON inventory.seed_id = seeds_name.id
    INNER JOIN ideal_climate
    ON inventory.climate_id = ideal_climate.id
    INNER JOIN final_size
    ON inventory.size_id = final_size.id
    INNER JOIN watering
    ON inventory.watering_id = watering.id
    INNER JOIN light_requirements
    ON inventory.light_id = light_requirements.id
    WHERE inventory.id = $1;
  `,
    [id]
  );
  return rows;
}

async function getAllItemsName() {
  const { rows } = await pool.query(`
    SELECT inventory.id, seed 
    FROM seeds_name
    INNER JOIN inventory
    ON inventory.seed_id = seeds_name.id;
  `);
  return rows;
}

async function deleteAllItems() {
  const { rowCount } = await pool.query(`
    DELETE FROM seeds_name;
  `);

  return rowCount;
}

async function deleteCategorie(cat, id) {
  const allowedTables = [
    "ideal_climate",
    "final_size",
    "watering",
    "light_requirements",
  ];

  if (!allowedTables.includes(cat)) {
    throw new Error(`${cat} is not allowed`);
  }

  const { rowCount } = await pool.query(
    `
    DELETE FROM ${cat}
    WHERE id = $1;
  `,
    [id]
  );

  return rowCount;
}

async function deleteItem(id) {
  const { rowCount } = await pool.query(
    `
    DELETE FROM seeds_name
    WHERE id = $1;
  `,
    [id]
  );

  return rowCount;
}

async function updateFlower(cat, id, newCat) {
  // Verifications
  const allowedCats = ["climate_id", "size_id", "watering_id", "light_id"];

  if (!allowedCats.includes(cat)) {
    throw new Error(`${cat} is not allowed`);
  } else if (!Number.isInteger(newCat)) {
    throw new Error(`You can only add numbers`);
  }

  const { rows } = await pool.query(
    `
    SELECT * FROM ${cat}
    WHERE id = $1
  `,
    [newCat]
  );

  if (rows.length === 0) {
    throw new Error(`${newCat} is not a valid ID`);
  }

  // update part
  const { rowCount } = await pool.query(
    `
    UPDATE inventory
    SET ${cat} = $1
    WHERE id = $2;
  `,
    [newCat, id]
  );

  return rowCount;
}

//TODO add a CREATE function to add categories(tables) and flowers


module.exports = {
  getItemInfo,
  getAllItemsName,
  deleteAllItems,
  deleteCategorie,
  deleteItem,
  updateFlower
};
