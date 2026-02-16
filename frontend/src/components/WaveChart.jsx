import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateData = () => {
    const data = [];
    let traffic = 100;
    for (let i = 0; i < 24; i++) {
        const change = Math.floor(Math.random() * 100) - 40;
        traffic = Math.max(50, traffic + change);
        data.push({
            time: `${i}:00`,
            traffic: traffic * 10,
            threats: Math.floor(Math.random() * 5),
        });
    }
    return data;
};

const TrafficChart = ({ data }) => {
    const chartData = Array.isArray(data) && data.length > 5 ? data : generateData();

    return (
        <div className="w-full h-full bg-[#1e293b] rounded-xl border border-slate-700/50 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white tracking-tight">Network Traffic Volume</h3>
                    <p className="text-xs text-slate-400">Real-time packet analysis (24h)</p>
                </div>
                <div className="flex gap-4">
                    <span className="flex items-center text-xs text-slate-400 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                        Total Packets
                    </span>
                </div>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} strokeOpacity={0.5} />
                        <XAxis
                            dataKey="time"
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                borderColor: '#334155',
                                color: '#f1f5f9',
                                fontSize: '12px',
                                borderRadius: '8px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                            }}
                            itemStyle={{ color: '#bae6fd' }}
                            cursor={{ stroke: '#475569', strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="traffic"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTraffic)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#60a5fa' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TrafficChart;
