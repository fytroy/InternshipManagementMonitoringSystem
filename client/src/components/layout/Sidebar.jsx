import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    BookOpen,
    ClipboardCheck,
    LogOut,
    User,
    Settings
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const navItems = [
        {
            label: 'Dashboard',
            path: '/',
            icon: <LayoutDashboard size={20} />,
            roles: ['student', 'company_supervisor']
        },
        {
            label: 'My Logs',
            path: '/logs',
            icon: <BookOpen size={20} />,
            roles: ['student']
        },
        // Supervisor Items
        {
            label: 'Evaluations',
            path: '/evaluations',
            icon: <ClipboardCheck size={20} />,
            roles: ['company_supervisor']
        },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 glass-panel border-r border-white/20 m-0 rounded-none z-50 flex flex-col">
            {/* Logo Area */}
            <div className="p-6 border-b border-gray-100/10">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    IMMS
                </h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Internship System</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    (!item.roles || item.roles.includes(user?.role)) && (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                }
                            `}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    )
                ))}
            </nav>

            {/* User Profile Hook */}
            <div className="p-4 border-t border-gray-100/10 mb-2">
                <NavLink to="/profile" className="glass-panel p-4 flex items-center justify-between bg-gradient-to-br from-white/40 to-white/10 hover:bg-white/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <User size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{user?.email}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                        </div>
                    </div>
                </NavLink>
                <button
                    onClick={logout}
                    className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
