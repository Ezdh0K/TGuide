const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config();

(async () => {
  const jsonPath =
    process.argv[2] ||
    path.join(__dirname, "..", "scripts", "mock_places.json");

  const places = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const sql = `
    INSERT INTO places (
      place_id, place_name, place_address, place_image, business_email, business_phone,
      short_description, place_description, place_rating, place_price, place_category
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
    )
    ON CONFLICT (place_id) DO UPDATE SET
      place_name = EXCLUDED.place_name,
      place_address = EXCLUDED.place_address,
      place_image = EXCLUDED.place_image,
      business_email = EXCLUDED.business_email,
      business_phone = EXCLUDED.business_phone,
      short_description = EXCLUDED.short_description,
      place_description = EXCLUDED.place_description,
      place_rating = EXCLUDED.place_rating,
      place_price = EXCLUDED.place_price,
      place_category = EXCLUDED.place_category;
  `;

  try {
    await client.connect();
    await client.query("SELECT 1");
    console.log("DB OK");

    for (const p of places) {
      await client.query(sql, [
        p.place_id, p.place_name, p.place_address, p.place_image,
        p.business_email, p.business_phone, p.short_description,
        p.place_description, p.place_rating, p.place_price, p.place_category
      ]);
    }

    console.log(`Импорт завершён: ${places.length} записей`);
  } catch (e) {
    console.error("Ошибка:", e.message);
  } finally {
    await client.end().catch(() => {});
  }
})();