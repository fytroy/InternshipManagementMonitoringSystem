const pool = require('../config/db');

// Submit an Evaluation (Supervisor Only)
const createEvaluation = async (req, res) => {
    try {
        const {
            intern_id,
            critical_thinking_score,
            communication_score,
            teamwork_score,
            professionalism_score,
            feedback_notes
        } = req.body;

        const supervisor_id = req.user.id;

        // RBAC Check
        if (req.user.role !== 'company_supervisor') {
            return res.status(403).json({ message: "Only supervisors can submit evaluations." });
        }

        const query = `
            INSERT INTO evaluations (
                intern_id, supervisor_id, 
                critical_thinking_score, communication_score, teamwork_score, professionalism_score, 
                feedback_notes
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;

        const values = [
            intern_id, supervisor_id,
            critical_thinking_score, communication_score, teamwork_score, professionalism_score,
            feedback_notes
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error submitting evaluation." });
    }
};

// Get Evaluations (Intern sees their own, Supervisor sees their interns')
const getEvaluations = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let query = '';
        let params = [];

        if (role === 'student') {
            query = `SELECT * FROM evaluations WHERE intern_id = $1 ORDER BY evaluation_date DESC`;
            params = [userId];
        } else if (role === 'company_supervisor') {
            query = `
                SELECT e.*, u.email as intern_email 
                FROM evaluations e
                JOIN users u ON e.intern_id = u.id
                WHERE e.supervisor_id = $1
                ORDER BY e.evaluation_date DESC
            `;
            params = [userId];
        } else {
            return res.status(403).json({ message: "Access denied." });
        }

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching evaluations." });
    }
};

module.exports = { createEvaluation, getEvaluations };
