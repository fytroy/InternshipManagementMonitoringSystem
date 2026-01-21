import React from 'react';
import Card from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
    const colorMap = {
        blue: 'text-blue-600 bg-blue-50',
        green: 'text-emerald-600 bg-emerald-50',
        purple: 'text-violet-600 bg-violet-50',
        orange: 'text-orange-600 bg-orange-50'
    };

    return (
        <Card>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>

                    {trend && (
                        <div className={`flex items-center mt-2 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {trend === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                            <span>{trendValue}</span>
                            <span className="text-slate-400 ml-1">vs last week</span>
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-lg ${colorMap[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
        </Card>
    );
};

export default StatsCard;
