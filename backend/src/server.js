require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./database/config/db')
const routes = require('./database/routes/index');
const supportRoutes = require('./database/routes/support');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/api', supportRoutes);

pool.query('SELECT NOW()', (err, res) => {
    if (err) { console.log('Error connecting to the database', err.stack); }
    else { console.log('Connected to the database', res.rows); }
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(
    PORT, HOST, () => {
        console.log(`server running on port ${PORT}`)
    }
)