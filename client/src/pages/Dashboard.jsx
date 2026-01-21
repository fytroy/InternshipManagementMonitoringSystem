import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import SupervisorDashboard from './SupervisorDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    if (user.role === 'company_supervisor' || user.role === 'university_coordinator') {
        return <SupervisorDashboard />;
    }

    return <StudentDashboard />;
};

export default Dashboard;
