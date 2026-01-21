import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/ui/StatsCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LogList from '../components/LogList';
import LogForm from '../components/LogForm';
import { FileText, Clock, CheckCircle, Plus } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [showLogForm, setShowLogForm] = useState(false);
    const [statsData, setStatsData] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/dashboard/student/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStatsData(res.data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            title: 'Total Logs',
            value: statsData?.total_logs ?? '-',
            icon: FileText,
            color: 'blue'
        },
        {
            title: 'Hours Logged',
            value: statsData?.hours_logged ?? '-',
            icon: Clock,
            color: 'purple'
        },
        {
            title: 'Evaluations',
            value: statsData?.evaluations ?? '-',
            icon: CheckCircle,
            color: 'green'
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.email?.split('@')[0]}!</h1>
                    <p className="text-slate-500">Here's what's happening with your internship today.</p>
                </div>
                <Button
                    icon={Plus}
                    onClick={() => setShowLogForm(!showLogForm)}
                >
                    {showLogForm ? 'Cancel Entry' : 'New Daily Log'}
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Recent Logs */}
                <div className="lg:col-span-2 space-y-6">
                    {showLogForm && (
                        <div className="animate-fade-in">
                            <Card>
                                <h3 className="text-lg font-semibold mb-4">Submit New Log</h3>
                                <LogForm onSuccess={() => setShowLogForm(false)} />
                            </Card>
                        </div>
                    )}

                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Recent Logs</h3>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                        <LogList />
                    </Card>
                </div>

                {/* Sidebar: Profile/Status */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Internship Status</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Completion</span>
                                    <span className="font-bold text-blue-600">{statsData?.completion_percentage || 0}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${statsData?.completion_percentage || 0}%` }}></div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-sm text-slate-500">Supervisor</p>
                                <p className="font-medium">Mr. Supervisor</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
