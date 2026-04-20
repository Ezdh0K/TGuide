const pool = require('../config/db');

exports.getAll = async () => {
    const result = await pool.query('SELECT * FROM places');
    return result.rows;
};

exports.getById = async (placeData) => {
    const { id } = placeData;
    const result = await pool.query('SELECT place_id, place_name, place_address, short_description, business_phone FROM places WHERE place_id = $1', [id]);
    return result.rows[0]
};

exports.create = async (placeData) => {
    const { name, address, short_description, phone, category } = placeData;
    const result = await pool.query(
        `INSERT INTO places (place_name, place_address, short_description, business_phone, place_category)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING place_id, place_name, place_address, short_description, business_phone, place_category`,
        [name, address, short_description, phone, category]);
    return result.rows[0];
};

exports.put = async (placeData) => {
    const { id, name, address, short_description, phone, category } = placeData;
    const result = await pool.query(
        `UPDATE places SET place_name = $1, place_address = $2, short_description = $3, business_phone = $4, place_category = $5
        WHERE place_id = $6
        RETURNING place_id, place_name, place_address, short_description, business_phone, place_category`,
        [name, address, short_description, phone, category, id]
    );
    return result.rows[0];
};

exports.delete = async (placeData) => {
    const { id } = placeData;
    const result = await pool.query(
        'DELETE FROM places WHERE place_id = $1',
        [id]
    );
    return result.rowCount;
};

exports.upsert = async (placeData) => {
    const { name, category, address, price, rating, short_description, phone, email, image } = placeData;

    const result = await pool.query(
        `INSERT INTO places (
            place_name, place_category, place_address, place_price, place_rating,
            short_description, business_phone, business_email, place_image
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (place_name, place_address, business_phone)
        DO UPDATE SET
            short_description = EXCLUDED.short_description,
            place_category = EXCLUDED.place_category,
            place_price = EXCLUDED.place_price,
            place_rating = EXCLUDED.place_rating,
            business_email = EXCLUDED.business_email,
            place_image = EXCLUDED.place_image
        RETURNING *
        `,
        [name, category, address, price, rating, short_description, phone, email, image]
    );
    return result.rows[0];
};