const pool = require('../config/db');

// GET /api/dashboard/student/stats
const getStudentStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Parallel queries for efficiency
        const logsQuery = pool.query(
            `SELECT COUNT(*) as count, 
             SUM(CASE WHEN status = 'approved' THEN 8 ELSE 0 END) as hours 
             FROM daily_logs WHERE intern_id = $1`,
            [userId]
        );

        const evalsQuery = pool.query(
            `SELECT COUNT(*) as count FROM evaluations WHERE intern_id = $1`,
            [userId]
        );

        const [logsRes, evalsRes] = await Promise.all([logsQuery, evalsQuery]);

        res.json({
            total_logs: parseInt(logsRes.rows[0].count) || 0,
            hours_logged: parseInt(logsRes.rows[0].hours) || 0,
            evaluations: parseInt(evalsRes.rows[0].count) || 0,
            completion_percentage: Math.min(100, Math.floor((parseInt(logsRes.rows[0].count) / 60) * 100)) // Assuming 60 days internship
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching student stats" });
    }
};

// GET /api/dashboard/supervisor/stats
const getSupervisorStats = async (req, res) => {
    try {
        const supervisorId = req.user.id; // Currently we associate all users? Or logic based on supervisor
        // For MVP/V2, Supervisor sees *ALL* system stats or specific ones. 
        // Let's assume Supervisor sees ALL Interns for now as there is no specific "Assignment" table yet.

        const internsQuery = pool.query(`SELECT COUNT(*) as count FROM users WHERE role = 'student'`);

        const pendingLogsQuery = pool.query(`SELECT COUNT(*) as count FROM daily_logs WHERE status = 'pending'`);

        const evalsDueQuery = pool.query(`
            SELECT COUNT(*) as count 
            FROM users u 
            WHERE u.role = 'student' 
            AND u.id NOT IN (
                SELECT intern_id FROM evaluations 
                WHERE evaluation_date > NOW() - INTERVAL '30 days'
            )
        `);
        // Logic: Count interns who haven't been evaluated in last 30 days

        const [internsRes, pendingRes, evalsRes] = await Promise.all([internsQuery, pendingLogsQuery, evalsDueQuery]);

        res.json({
            active_interns: parseInt(internsRes.rows[0].count) || 0,
            pending_logs: parseInt(pendingRes.rows[0].count) || 0,
            evaluations_due: parseInt(evalsRes.rows[0].count) || 0
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching supervisor stats" });
    }
};

module.exports = { getStudentStats, getSupervisorStats };
