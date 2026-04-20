const pool = require('../config/db');
const crypto = require('crypto');

exports.get = async () => {
    const result = await pool.query('SELECT user_id, user_name, user_email FROM users');
    return result.rows;
};

exports.getByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE user_email = $1`, 
        [email]);
    return result.rows[0];
};

exports.getById = async (userId) => {
    const result = await pool.query(
        `SELECT user_id, user_email, user_name, password_hash, role
        FROM users
        WHERE user_id = $1`,
        [userId]);
    return result.rows[0];
};

exports.create = async (userData) => {
    const { name, email, passwordHash, role='user' } = userData;
    const result = await pool.query(
        `INSERT INTO users (user_name, user_email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, user_name, user_email, role`,
        [name, email, passwordHash, role]
    );
    return result.rows[0];
};

exports.updatePassword = async (userData) => {
    const { userId, newHash } = userData;
    await pool.query(
        `UPDATE users SET password_hash = $1 WHERE user_id = $2`,
        [newHash, userId]
    );
};

// exports.createToken = async (userData) => {
//     const {userId, newEmail} = userData;
//     const token = crypto.randomBytes(32).toString('hex');
//     const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

//     const sql = `
//     INSERT INTO confirmTokens (user_id, new_email, token, expires_at)
//     VALUES ($1, $2, $3, $4)
//     ON CONFLICT (new_email)
//     DO UPDATE SET
//         user_id = EXCLUDED.user_id,
//         token = EXCLUDED.token,
//         expires_at = EXCLUDED.expires_at
//     RETURNING token`;

//     const result = await pool.query(sql, [userId, newEmail, token, expiresAt]);
//     return result.rows[0];
// };

// exports.getToken = async (token) => {
//     const result = await pool.query(
//         `SELECT * FROM confirmTokens WHERE token = $1`,
//         [token]
//     );
//     return result.rows[0];
// };

// exports.updateEmail = async (userData) => {
//     const { userId, token, newEmail } = userData;
//     const client = await pool.connect();

//     try {
//         await client.query('BEGIN');

//         const updateSql = `
//         UPDATE users
//         SET user_email = $1
//         WHERE user_id = $2
//         RETURNING user_id, user_name, user_email, role`;

//         const result = await client.query(updateSql, [newEmail, userId]);
//         if (result.rows.length === 0)
//             {
//                 throw new Error ('user not found');
//             }

//         const deleteTokenSql = `
//         DELETE FROM confirmTokens
//         WHERE token = $1 AND user_id = $2`;
//         await client.query(deleteTokenSql, [token, userId]);

//         await client.query('COMMIT');
//         return result.rows[0];
//     } catch (err) {
//         await client.query('ROLLBACK');
//         throw err;
//     } finally {
//         client.release();
//     }
// };

// exports.deleteUserTokens = async (userId) => {
//     const result = await pool.query('DELETE FROM confirmTokens WHERE user_id = $1', [userId]);
//     return result.rowCount;
// };

exports.updateEmail = async (userData) => {
    const { newEmail, userId } = userData;
    await pool.query(`
        UPDATE users SET user_email = $1
        WHERE user_id = $2`,
    [newEmail, userId]);
};

exports.delete = async (userData) => {
    const { id } = userData;
    const result = await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
    return result.rowCount;
};
