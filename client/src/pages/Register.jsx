import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student',
        consent: false
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.consent) {
            setError("You must agree to the Privacy Policy to register.");
            return;
        }

        const result = await register({
            ...formData,
            policy_version: 'v1.0' // Hardcoded current policy version
        });

        if (result.success) {
            alert("Registration successful! Please login.");
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create IMMS Account</h2>
                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.group}>
                        <label>Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
                            <option value="student">Student (Intern)</option>
                            <option value="company_supervisor">Company Supervisor</option>
                            <option value="university_coordinator">University Coordinator</option>
                        </select>
                    </div>

                    <div style={styles.group}>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} required />
                    </div>

                    <div style={styles.group}>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} required />
                    </div>

                    {/* Privacy Consent - CRITICAL */}
                    <div style={{ ...styles.group, flexDirection: 'row', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            name="consent"
                            checked={formData.consent}
                            onChange={handleChange}
                            id="consent"
                            style={{ marginTop: '4px' }}
                        />
                        <label htmlFor="consent" style={{ fontSize: '0.875rem' }}>
                            I agree to the <strong>Privacy Policy</strong> and consent to the processing of my personal data for the purpose of the internship program. I understand I have the 'Right to Erasure'.
                        </label>
                    </div>

                    <button type="submit" style={styles.button}>Register</button>
                </form>

                <p style={styles.link}>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9' },
    card: { width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    title: { textAlign: 'center', marginBottom: '1.5rem', color: '#1e293b' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    group: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    input: { padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' },
    button: { padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    error: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
    link: { textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }
};
