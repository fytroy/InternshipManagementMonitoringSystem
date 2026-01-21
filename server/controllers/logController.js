const pool = require('../config/db');

// Create a new Daily Log
const createLog = async (req, res) => {
    try {
        const { date, activity_description, image_url } = req.body;
        const intern_id = req.user.id; // From Auth Middleware

        // 1. Validation
        if (!date || !activity_description) {
            return res.status(400).json({ message: "Date and Activity Description are required." });
        }

        // 2. Insert Log using Postgres RETURNING
        const query = `
            INSERT INTO daily_logs (intern_id, log_date, activity_description, image_url)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const result = await pool.query(query, [intern_id, date, activity_description, image_url]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({ message: "A log for this date already exists." });
        }
        res.status(500).json({ message: "Server error creating log." });
    }
};

// Get Logs
const getLogs = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let query = '';
        let params = [];

        if (role === 'student') {
            query = `SELECT * FROM daily_logs WHERE intern_id = $1 ORDER BY log_date DESC`;
            params = [userId];
        } else if (role === 'company_supervisor') {
            query = `
                SELECT l.*, u.email as intern_email 
                FROM daily_logs l
                JOIN users u ON l.intern_id = u.id
                ORDER BY l.log_date DESC
            `;
        } else {
            return res.status(403).json({ message: "Access denied." });
        }

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching logs." });
    }
};

// Supervisor: Update Status
const updateLogStatus = async (req, res) => {
    try {
        const { id } = req.params; // Log ID
        const { status, supervisor_comment } = req.body;

        if (req.user.role !== 'company_supervisor') {
            return res.status(403).json({ message: "Only supervisors can approve logs." });
        }

        const query = `
            UPDATE daily_logs 
            SET status = $1, supervisor_comment = $2 
            WHERE id = $3 
            RETURNING *
        `;
        const result = await pool.query(query, [status, supervisor_comment, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Log not found." });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating log." });
    }
};

module.exports = { createLog, getLogs, updateLogStatus };
