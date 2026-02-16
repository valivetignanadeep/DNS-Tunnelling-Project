import React from 'react';

const MetricCard = ({ title, value, subtext, status, icon: Icon }) => {
    const statusColors = {
        critical: 'text-rose-500 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]',
        warning: 'text-amber-500 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
        success: 'text-emerald-500 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
        neutral: 'text-blue-400 border-slate-700 shadow-none',
    };

    const bgColors = {
        critical: 'bg-rose-950/10',
        warning: 'bg-amber-950/10',
        success: 'bg-emerald-950/10',
        neutral: 'bg-slate-900/50',
    }

    const borderClass = statusColors[status] || statusColors.neutral;
    const bgClass = bgColors[status] || bgColors.neutral;
    const textClass = borderClass.split(' ')[0]; // Extract text color for icon

    return (
        <div className={`p-4 rounded-sm border ${bgClass} ${borderClass} transition-all relative overflow-hidden group`}>
            {/* Decorative Corner */}
            <div className={`absolute top-0 right-0 w-8 h-8 opacity-10 ${textClass}`}>
                <Icon className="w-full h-full" />
            </div>

            <div className="flex justify-between items-start mb-1 relative z-10">
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{title}</p>
                <div className={`w-1.5 h-1.5 rounded-full ${textClass.replace('text', 'bg')}`}></div>
            </div>

            <div className="relative z-10 mt-1">
                <h3 className="text-2xl font-bold text-slate-100 font-mono tracking-tight">{value}</h3>
                <p className={`text-[10px] font-mono mt-1 ${status === 'neutral' ? 'text-slate-500' : textClass}`}>
                    [{subtext}]
                </p>
            </div>
        </div>
    );
};

export default MetricCard;
