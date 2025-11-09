const pool = require("./pool");

async function getItemInfo(id) {
  const {rows} = await pool.query(`
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
  `, [id]);
  return rows;
}

async function getAllItemsName() {
  const {rows} = await pool.query(`
    SELECT inventory.id, seed 
    FROM seeds_name
    INNER JOIN inventory
    ON inventory.seed_id = seeds_name.id;
  `);
  return rows;
}

module.exports = {
  getItemInfo,
  getAllItemsName
};