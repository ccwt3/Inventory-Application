const { Client } = require("pg");
require("dotenv").config();

const SQL = `
  CREATE TABLE IF NOT EXISTS ideal_climate (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    climate text UNIQUE
  );

  CREATE TABLE IF NOT EXISTS final_size (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    size text UNIQUE
  );

  CREATE TABLE IF NOT EXISTS watering (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    consistency text UNIQUE
  );

  CREATE TABLE IF NOT EXISTS light_requirements (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sunlight text UNIQUE
  );

  CREATE TABLE IF NOT EXISTS seeds_name (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    seed text UNIQUE
  );

  -- INSERTs idempotentes
  INSERT INTO ideal_climate (climate) VALUES
    ('Cool'),
    ('Temperate'),
    ('Warm'),
    ('Tropical')
  ON CONFLICT (climate) DO NOTHING;

  INSERT INTO final_size (size) VALUES
    ('small (0 - 30 cm)'),
    ('medium (31 - 90 cm)'),
    ('large (91 - 300 cm)')
  ON CONFLICT (size) DO NOTHING;

  INSERT INTO watering (consistency) VALUES
    ('High'),
    ('Moderate'),
    ('Low'),
    ('Dry')
  ON CONFLICT (consistency) DO NOTHING;

  INSERT INTO light_requirements (sunlight) VALUES
    ('Full sun'),
    ('Partial shade'),
    ('Indirect Bright Light')
  ON CONFLICT (sunlight) DO NOTHING;

  INSERT INTO seeds_name (seed) VALUES
    ('Rose'),
    ('Tulip'),
    ('Lily'),
    ('Sunflower'),
    ('Orchid'),
    ('Daisy'),
    ('Carnation'),
    ('Hydrangea'),
    ('Peony'),
    ('Lavender')
  ON CONFLICT (seed) DO NOTHING;

  -- Inventory table
  CREATE TABLE IF NOT EXISTS inventory (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    seed_id integer REFERENCES seeds_name(id),
    climate_id integer REFERENCES ideal_climate(id),
    size_id integer REFERENCES final_size(id),
    watering_id integer REFERENCES watering(id),
    light_id integer REFERENCES light_requirements(id)
  );

  -- Seed inventory using subqueries (idempotent because catalogs are unique)
  INSERT INTO inventory (seed_id, climate_id, size_id, watering_id, light_id)
  VALUES
    (
      (SELECT id FROM seeds_name WHERE seed = 'Rose'),
      (SELECT id FROM ideal_climate WHERE climate = 'Temperate'),
      (SELECT id FROM final_size WHERE size LIKE 'medium%'),
      (SELECT id FROM watering WHERE consistency = 'Moderate'),
      (SELECT id FROM light_requirements WHERE sunlight = 'Full sun')
    ),
    (
      (SELECT id FROM seeds_name WHERE seed = 'Tulip'),
      (SELECT id FROM ideal_climate WHERE climate = 'Cool'),
      (SELECT id FROM final_size WHERE size LIKE 'small%'),
      (SELECT id FROM watering WHERE consistency = 'Moderate'),
      (SELECT id FROM light_requirements WHERE sunlight = 'Partial shade')
    ),
    (
      (SELECT id FROM seeds_name WHERE seed = 'Lily'),
      (SELECT id FROM ideal_climate WHERE climate = 'Temperate'),
      (SELECT id FROM final_size WHERE size LIKE 'medium%'),
      (SELECT id FROM watering WHERE consistency = 'Moderate'),
      (SELECT id FROM light_requirements WHERE sunlight = 'Partial shade')
    ),
    (
      (SELECT id FROM seeds_name WHERE seed = 'Sunflower'),
      (SELECT id FROM ideal_climate WHERE climate = 'Warm'),
      (SELECT id FROM final_size WHERE size LIKE 'large%'),
      (SELECT id FROM watering WHERE consistency = 'Low'),
      (SELECT id FROM light_requirements WHERE sunlight = 'Full sun')
    ),
    (
      (SELECT id FROM seeds_name WHERE seed = 'Orchid'),
      (SELECT id FROM ideal_climate WHERE climate = 'Tropical'),
      (SELECT id FROM final_size WHERE size LIKE 'small%'),
      (SELECT id FROM watering WHERE consistency = 'High'),
      (SELECT id FROM light_requirements WHERE sunlight = 'Indirect Bright Light')
    ),
    (
      (SELECT id FROM seeds_name WHERE seed = 'Daisy'),
      (SELECT id FROM ideal_climate WHERE climate = 'Temperate'),
      (SELECT id FROM final_size WHERE size LIKE 'small%'),
      (SELECT id FROM watering WHERE consistency = 'Moderate'),
      (SELECT id FROM light_requirements WHERE sunlight = 'Full sun')
    ),
    (
      (SELECT id FROM seeds_name WHERE seed = 'Carnation'),
      (SELECT id FROM ideal_climate WHERE climate = 'Temperate'),
      (SELECT id FROM final_size WHERE size LIKE 'medium%'),
      (SELECT id FROM watering WHERE consistency = 'Low'),
      (SELECT id FROM light_requirements WHERE sunlight = 'Full sun')
    ),
    (
      (SELECT id FROM seeds_name WHERE seed = 'Hydrangea'),
      (SELECT id FROM ideal_climate WHERE climate = 'Temperate'),
      (SELECT id FROM final_size WHERE size LIKE 'large%'),
      (SELECT id FROM watering WHERE consistency = 'High'),
      (SELECT id FROM light_requirements WHERE sunlight = 'Partial shade')
    ),
    (
      (SELECT id FROM seeds_name WHERE seed = 'Peony'),
      (SELECT id FROM ideal_climate WHERE climate = 'Cool'),
      (SELECT id FROM final_size WHERE size LIKE 'medium%'),
      (SELECT id FROM watering WHERE consistency = 'Moderate'),
      (SELECT id FROM light_requirements WHERE sunlight = 'Full sun')
    ),
    (
      (SELECT id FROM seeds_name WHERE seed = 'Lavender'),
      (SELECT id FROM ideal_climate WHERE climate = 'Warm'),
      (SELECT id FROM final_size WHERE size LIKE 'medium%'),
      (SELECT id FROM watering WHERE consistency = 'Low'),
      (SELECT id FROM light_requirements WHERE sunlight = 'Full sun')
    )
  ON CONFLICT DO NOTHING;
  `;

async function main() {
  console.log("starting...");

  const connectionString =
    process.argv[2] ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`;

  const client = new Client({ connectionString });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("DONE!");
  } catch (err) {
    console.error("Error al conectar: ", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
