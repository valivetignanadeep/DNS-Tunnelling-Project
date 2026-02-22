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
        <div className="w-full h-full bg-white rounded-2xl border border-slate-200 p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Network Traffic Volume</h3>
                    <p className="text-xs text-slate-500">Real-time packet analysis (24h)</p>
                </div>
                <div className="flex gap-4">
                    <span className="flex items-center text-xs text-slate-500 font-bold">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mr-2 shadow-sm"></span>
                        Total Packets
                    </span>
                </div>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4338ca" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#4338ca" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#94a3b8"
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                borderColor: '#e2e8f0',
                                color: '#1e293b',
                                fontSize: '12px',
                                borderRadius: '8px',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                            }}
                            itemStyle={{ color: '#4338ca' }}
                            cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="traffic"
                            stroke="#4338ca"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTraffic)"
                            activeDot={{ r: 6, strokeWidth: 2, fill: '#ffffff', stroke: '#4338ca' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TrafficChart;
