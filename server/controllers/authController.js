const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const register = async (req, res) => {
    const client = await pool.connect();
    try {
        const { email, password, role, consent, policy_version } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        if (consent !== true && consent !== 'true') {
            return res.status(400).json({
                error: "PrivacyConsentRequired",
                message: "You must agree to the privacy policy to register."
            });
        }

        await client.query('BEGIN');

        // Check exists
        const exists = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (exists.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: "Email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // We use manual UUID generation for broader compatibility
        const userId = uuidv4();

        // 3. User Creation
        await client.query(
            `INSERT INTO users (id, email, password_hash, role) VALUES ($1, $2, $3, $4)`,
            [userId, email, passwordHash, role]
        );

        // 4. Record Privacy Consent
        const consentId = uuidv4();
        await client.query(
            `INSERT INTO privacy_consents (id, user_id, consent_granted, policy_version, ip_address) 
             VALUES ($1, $2, $3, $4, $5)`,
            [consentId, userId, true, policy_version || 'v1.0', req.ip]
        );

        // 5. Create specific profile
        if (role === 'student') {
            await client.query(
                `INSERT INTO intern_profiles (user_id, full_name) VALUES ($1, $2)`,
                [userId, 'New Student']
            );
        } else if (role === 'company_supervisor') {
            await client.query(
                `INSERT INTO supervisors (user_id, full_name, company_name) VALUES ($1, $2, $3)`,
                [userId, 'New Supervisor', 'Pending Company']
            );
        }

        await client.query('COMMIT');

        res.status(201).json({ message: "User registered successfully." });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: "Server error during registration." });
    } finally {
        client.release();
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find User
        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const user = result.rows[0];

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // 3. Generate Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during login." });
    }
};

module.exports = { register, login };
