import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { Check, X } from 'lucide-react';

const LogList = ({ isSupervisor = false }) => {
    const [logs, setLogs] = useState([]);
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleApproval = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/logs/${id}/status`,
                { status, supervisor_comment: status === 'approved' ? 'Great work!' : 'Please revise.' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchLogs(); // Refresh list
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3">Date</th>
                        {isSupervisor && <th className="px-6 py-3">Intern</th>}
                        <th className="px-6 py-3">Activity</th>
                        <th className="px-6 py-3 text-center">Status</th>
                        {isSupervisor && <th className="px-6 py-3 text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {logs.length === 0 ? (
                        <tr>
                            <td colSpan={isSupervisor ? 5 : 4} className="px-6 py-8 text-center text-slate-400">
                                No logs found.
                            </td>
                        </tr>
                    ) : (
                        logs.map((log) => (
                            <tr key={log.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                    {new Date(log.log_date).toLocaleDateString()}
                                </td>
                                {isSupervisor && (
                                    <td className="px-6 py-4 text-slate-500">
                                        {log.intern_email}
                                    </td>
                                )}
                                <td className="px-6 py-4 max-w-sm truncate" title={log.activity_description}>
                                    {log.activity_description}
                                    {log.supervisor_comment && (
                                        <p className="text-xs text-slate-400 mt-1 italic">
                                            Feedback: {log.supervisor_comment}
                                        </p>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Badge type={log.status}>{log.status}</Badge>
                                </td>
                                {isSupervisor && (
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {log.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 p-2 h-auto"
                                                    onClick={() => handleApproval(log.id, 'approved')}
                                                    title="Approve"
                                                >
                                                    <Check size={16} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 p-2 h-auto"
                                                    onClick={() => handleApproval(log.id, 'rejected')}
                                                    title="Reject"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LogList;
