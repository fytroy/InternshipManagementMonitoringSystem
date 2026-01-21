const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

// Test DB Connection before starting
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected successfully:', res.rows[0].now);

        // Start Server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
});
