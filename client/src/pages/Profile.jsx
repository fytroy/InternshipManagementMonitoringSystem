import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { User, Mail, Shield } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // In a real app, we'd fetch the full profile from API. 
    // Here we use the Auth User info + mock.
    const [formData, setFormData] = useState({
        fullName: 'John Doe', // Placeholder
        email: user?.email,
        role: user?.role
    });

    const handleSave = () => {
        // API Call to update profile would go here
        console.log("Saving profile", formData);
        setIsEditing(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>

            <Card className="space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <User size={40} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{formData.fullName}</h2>
                        <p className="text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            disabled={!isEditing}
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input
                                type="email"
                                disabled
                                value={formData.email}
                                className="w-full pl-10 bg-slate-50 text-slate-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input
                                type="text"
                                disabled
                                value={formData.role}
                                className="w-full pl-10 bg-slate-50 text-slate-500 capitalize"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </div>
                    ) : (
                        <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Profile;
