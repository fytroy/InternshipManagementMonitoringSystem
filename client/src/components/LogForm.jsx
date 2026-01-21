import { useState } from 'react';
import axios from 'axios';

export default function LogForm({ onLogAdded }) {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/logs', {
                date,
                activity_description: description,
                // image_url: '...' // Future image upload
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDescription('');
            onLogAdded(); // Refresh list
            alert("Log submitted successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit log");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4>Submit Daily Log</h4>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                />
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Activity Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                    placeholder="What did you learn today?"
                    required
                />
            </div>

            <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Submit Log
            </button>
        </form>
    );
}
