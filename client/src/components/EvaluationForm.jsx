import { useState } from 'react';
import axios from 'axios';

export default function EvaluationForm({ internId, onEvaluationSubmitted }) {
    const [scores, setScores] = useState({
        critical_thinking_score: 5,
        communication_score: 5,
        teamwork_score: 5,
        professionalism_score: 5,
    });
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/evaluations', {
                intern_id: internId,
                ...scores,
                feedback_notes: feedback
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Evaluation submitted!");
            onEvaluationSubmitted();
        } catch (err) {
            alert("Failed to submit evaluation");
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', marginTop: '1rem' }}>
            <h4>New Evaluation</h4>
            {Object.keys(scores).map(key => (
                <div key={key} style={{ marginBottom: '0.5rem' }}>
                    <label style={{ display: 'block', textTransform: 'capitalize' }}>
                        {key.replace(/_/g, ' ')} (1-10)
                    </label>
                    <input
                        type="number"
                        min="1" max="10"
                        value={scores[key]}
                        onChange={(e) => setScores({ ...scores, [key]: parseInt(e.target.value) })}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
            ))}
            <div style={{ marginBottom: '0.5rem' }}>
                <label>Feedback Notes</label>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem' }}
                />
            </div>
            <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none' }}>
                Submit Evaluation
            </button>
        </form>
    );
}
