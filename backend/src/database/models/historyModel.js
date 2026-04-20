const pool = require('../config/db');

exports.getByUser = async (userId, limit = 50) => {
    const result = await pool.query(
        `SELECT p.place_id, p.place_name, p.place_address, p.place_rating, p.place_category, h.viewed_at
         FROM history h
         JOIN places p ON h.place_id = p.place_id
         WHERE h.user_id = $1
         ORDER BY h.viewed_at DESC
         LIMIT $2`,
        [userId, limit]
    );
    return result.rows;
};

exports.add = async (userId, placeId) => {
    const result = await pool.query(
        `INSERT INTO history (user_id, place_id, viewed_at)
        VALUES ($1, $2, NOW())
        RETURNING user_id, place_id, viewed_at`,
        [userId, placeId]
    );
    return result.rows[0];
};

exports.upsert = async (userId, placeId) => {
    const sql = `
    WITH deleted AS (
      DELETE FROM history
      WHERE user_id = $1 AND place_id = $2
    )
    INSERT INTO history (user_id, place_id, viewed_at)
    VALUES ($1, $2, NOW())
    RETURNING user_id, place_id, viewed_at
    `;
    const result = await pool.query(sql, [userId, placeId]);
    return result.rows[0];
};

exports.clearOld = async (userId, days = 30) => {
    const result = await pool.query(
        `DELETE FROM history 
         WHERE user_id = $1 
           AND viewed_at < NOW() - ($2::int * INTERVAL '1 day')`,
        [userId, days]
    );
    return result.rowCount;
};