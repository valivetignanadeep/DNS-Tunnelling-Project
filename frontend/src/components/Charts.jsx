import React, { useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const COLORS = ['#059669', '#d97706', '#991b1b']; // Forest Emerald, Deep Amber, Intelligence Crimson

const Charts = ({ data }) => {
    const total = data?.totalQueries || 0;
    const suspicious = data?.suspicious || 0;
    const threats = data?.threats || 0;
    const normal = Math.max(0, total - suspicious);

    const distributionData = useMemo(() => [
        { name: 'Normal Traffic', value: normal },
        { name: 'Suspicious Activity', value: suspicious - threats },
        { name: 'Critical Threats', value: threats },
    ].filter(i => i.value > 0), [normal, suspicious, threats]);

    const kpiData = useMemo(() => [
        { name: 'Queries', count: total },
        { name: 'Suspicious', count: suspicious },
        { name: 'Threats', count: threats },
    ], [total, suspicious, threats]);

    if (!data) return (
        <div className="h-full flex items-center justify-center text-slate-500 font-mono text-[10px] uppercase tracking-widest">
            Initializing Distribution Engine...
        </div>
    );

    return (
        <div className="space-y-10">
            {/* Distribution Doughnut */}
            <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={distributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {distributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                            itemStyle={{ fontSize: '12px', color: '#1e293b' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-mono font-bold text-slate-500">RATIO</span>
                </div>
            </div>

            {/* KPI Bar Chart */}
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={kpiData} margin={{ left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            tick={{ fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                            itemStyle={{ color: '#1e293b' }}
                        />
                        <Bar
                            dataKey="count"
                            fill="#4338ca"
                            radius={[4, 4, 0, 0]}
                            barSize={24}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Charts;
