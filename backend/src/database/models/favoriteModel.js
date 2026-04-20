const pool = require('../config/db')

exports.getByUser = async (userId) => {
    const result = await pool.query(
        `SELECT p.place_id, p.place_name, p.place_address, p.place_rating, p.place_category, f.added_at
        FROM favorites f
        JOIN places p ON f.place_id = p.place_id
        WHERE f.user_id = $1
        ORDER BY f.added_at DESC`,
        [userId]);
        return result.rows;
};

exports.add = async (userId, placeId) => {
    const result = await pool.query(
        `INSERT INTO favorites (user_id, place_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, place_id) DO NOTHING
        RETURNING user_id, place_id, added_at`,
        [userId, placeId]
    );
    return result.rows[0];
};

exports.delete = async (userId, placeId) => {
    const result = await pool.query(
        `DELETE FROM favorites WHERE user_id = $1 AND place_id = $2`,
        [userId, placeId]
    );
    return result.rowCount;
};

exports.exists = async (userId, placeId) => {
    const result = await pool.query(
        `SELECT 1 FROM favorites WHERE user_id = $1 AND place_id = $2`,
        [userId, placeId]
    );
    return result.rows.length > 0;
};