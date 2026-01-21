const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'imms_db',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

const seed = async () => {
    const client = await pool.connect();
    try {
        console.log("Seeding database...");
        await client.query('BEGIN');

        // 1. Create Student
        const studentId = uuidv4();
        const studentHash = await bcrypt.hash('password', 10);
        await client.query(
            `INSERT INTO users (id, email, password_hash, role) VALUES ($1, $2, $3, 'student') ON CONFLICT (email) DO NOTHING`,
            [studentId, 'student@test.com', studentHash]
        );

        // Consent & Profile for Student
        await client.query(`INSERT INTO privacy_consents (user_id, consent_granted, policy_version, ip_address) VALUES ((SELECT id FROM users WHERE email='student@test.com'), true, 'v1.0', '127.0.0.1') ON CONFLICT DO NOTHING`);
        await client.query(`INSERT INTO intern_profiles (user_id, full_name, student_id) VALUES ((SELECT id FROM users WHERE email='student@test.com'), 'Demo Student', 'STU-001') ON CONFLICT DO NOTHING`);

        // 2. Create Supervisor
        const superId = uuidv4();
        const superHash = await bcrypt.hash('password', 10);
        await client.query(
            `INSERT INTO users (id, email, password_hash, role) VALUES ($1, $2, $3, 'company_supervisor') ON CONFLICT (email) DO NOTHING`,
            [superId, 'supervisor@test.com', superHash]
        );

        // Consent & Profile for Supervisor
        await client.query(`INSERT INTO privacy_consents (user_id, consent_granted, policy_version, ip_address) VALUES ((SELECT id FROM users WHERE email='supervisor@test.com'), true, 'v1.0', '127.0.0.1') ON CONFLICT DO NOTHING`);
        await client.query(`INSERT INTO supervisors (user_id, full_name, company_name) VALUES ((SELECT id FROM users WHERE email='supervisor@test.com'), 'Mr. Supervisor', 'Tech Corp') ON CONFLICT DO NOTHING`);

        // 3. Create Sample Log
        const logId = uuidv4();
        await client.query(`
            INSERT INTO daily_logs (id, intern_id, log_date, activity_description, status)
            VALUES ($1, (SELECT id FROM users WHERE email='student@test.com'), CURRENT_DATE, 'Set up the dev environment and ran seed script.', 'pending')
            ON CONFLICT DO NOTHING
        `, [logId]);

        await client.query('COMMIT');
        console.log("Database seeded successfully!");
        console.log("users: student@test.com / supervisor@test.com (password: 'password')");

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Seeding failed:", err);
    } finally {
        client.release();
        pool.end();
    }
};

seed();
