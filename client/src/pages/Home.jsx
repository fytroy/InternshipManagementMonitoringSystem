import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Home = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Decorative Background Elements */}
            <div className="fixed top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="fixed top-20 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

            <Card className="max-w-2xl w-full text-center space-y-8 glass-panel border-white/40 shadow-2xl relative z-10">
                <div className="space-y-2">
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        IMMS
                    </h1>
                    <p className="text-xl text-slate-500 font-light">
                        Internship Management & Monitoring System
                    </p>
                </div>

                <p className="text-slate-600 leading-relaxed max-w-lg mx-auto">
                    Streamline your internship experience. Log daily activities, track progress,
                    and receive structured feedback—all in one elegant platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link to="/login">
                        <Button size="lg" className="w-full sm:w-auto px-10">
                            Login
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="secondary" size="lg" className="w-full sm:w-auto px-10">
                            Register
                        </Button>
                    </Link>
                </div>

                <p className="text-xs text-slate-400 pt-8">
                    Privacy by Design • RBAC Security • Real-time Tracking
                </p>
            </Card>
        </div>
    );
};

export default Home;
