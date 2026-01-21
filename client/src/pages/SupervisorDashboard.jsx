import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/ui/StatsCard';
import Card from '../components/ui/Card';
import LogList from '../components/LogList'; // Supervisor sees all/assigned logs here
import EvaluationForm from '../components/EvaluationForm';
import { Users, FileText, AlertCircle } from 'lucide-react';

import axios from 'axios'; // Ensure axios is imported

const SupervisorDashboard = () => {
    const { user } = useAuth();
    const [statsData, setStatsData] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/dashboard/supervisor/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStatsData(res.data);
            } catch (err) {
                console.error("Failed to fetch supervisor stats", err);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { title: 'Active Interns', value: statsData?.active_interns || '-', icon: Users, color: 'blue' },
        { title: 'Pending Logs', value: statsData?.pending_logs || '-', icon: AlertCircle, color: 'orange' },
        { title: 'Evaluations Due', value: statsData?.evaluations_due || '-', icon: FileText, color: 'purple' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Supervisor Overview</h1>
                <p className="text-slate-500">Manage your interns and review their progress.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Pending Logs Review */}
                <Card className="xl:col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Pending Log Approvals</h3>
                    <LogList isSupervisor={true} />
                </Card>

                {/* Quick Evaluation (Keep existing form for now, maybe move to its own page later) */}
                <Card>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Evaluation</h3>
                    <p className="text-sm text-slate-500 mb-4">Submit a competency evaluation for an intern.</p>
                    <EvaluationForm />
                </Card>
            </div>
        </div>
    );
};

export default SupervisorDashboard;
