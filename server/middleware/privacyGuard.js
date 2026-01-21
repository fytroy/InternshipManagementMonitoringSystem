const pool = require('../config/db'); // Assuming pg pool setup

/**
 * Privacy Middleware: "Privacy by Design"
 * 
 * Objectives:
 * 1. Verify that the user has given valid consent.
 * 2. Ensure consent is active/latest version.
 * 3. Log access if necessary for audit (optional).
 * 
 * Usage: Apply this middleware to any route that processes personal data (e.g., Profile Update, Log Submission).
 */
const privacyGuard = async (req, res, next) => {
    try {
        const userId = req.user.id; // Assumes Auth middleware ran first and populated req.user

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User identification failed." });
        }

        // Query the database for active consent
        const query = `
            SELECT consent_granted, policy_version 
            FROM privacy_consents 
            WHERE user_id = $1 
            ORDER BY consent_timestamp DESC 
            LIMIT 1
        `;
        
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(403).json({ 
                error: "PrivacyViolation", 
                message: "No privacy consent record found. You must accept the data processing policy." 
            });
        }

        const consent = result.rows[0];

        // Check if consent is granted
        if (consent.consent_granted !== true) {
            return res.status(403).json({ 
                error: "PrivacyViolation", 
                message: "Consent for data processing has been revoked or denied." 
            });
        }

        // Optional: Check policy version (if you update policy and require re-consent)
        const LATEST_POLICY_VERSION = 'v1.0'; 
        if (consent.policy_version !== LATEST_POLICY_VERSION) {
             return res.status(403).json({ 
                error: "PolicyUpdate", 
                message: "Privacy policy has been updated. Please review and accept the new terms." 
            });
        }

        // If all checks pass, proceed
        next();

    } catch (error) {
        console.error("Privacy Middleware Error:", error);
        return res.status(500).json({ message: "Internal Server Error during Privacy Check." });
    }
};

module.exports = privacyGuard;
