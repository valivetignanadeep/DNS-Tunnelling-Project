import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';

const EXECUTIVE_COLORS = ['#b91c1c', '#b45309', '#4338ca', '#047857', '#334155']; // Crimson, Amber, Indigo, Emerald, Slate

const AnomalyCharts = ({ results }) => {

    const riskDistribution = useMemo(() => {
        if (!Array.isArray(results)) return [];
        const high = results.filter(r => r?.risk_score >= 80).length;
        const medium = results.filter(r => r?.risk_score >= 40 && r?.risk_score < 80).length;
        const low = results.filter(r => (r?.risk_score || 0) < 40).length;

        return [
            { name: 'Critical', value: high },
            { name: 'High', value: medium },
            { name: 'Medium', value: low },
        ].filter(i => i.value > 0);
    }, [results]);

    const topTalkers = useMemo(() => {
        if (!Array.isArray(results)) return [];
        const counts = {};
        results.forEach(r => {
            if (r?.src_ip) {
                counts[r.src_ip] = (counts[r.src_ip] || 0) + 1;
            }
        });
        return Object.entries(counts)
            .map(([ip, count]) => ({ ip, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [results]);

    const lexicalScatter = useMemo(() => {
        if (!Array.isArray(results)) return [];
        return results.map(r => ({
            entropy: r?.entropy || 0,
            length: r?.length || 0,
            risk: r?.risk_score || 0,
            domain: r?.domain || 'Unknown'
        }));
    }, [results]);

    if (!results || results.length === 0) return null;

    return (
        <div className="space-y-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Risk Distribution */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 relative overflow-hidden group shadow-md">
                    <h3 className="text-slate-900 text-lg font-bold mb-8 flex items-center tracking-wide">
                        <span className="w-1.5 h-5 bg-indigo-600 rounded-full mr-4 shadow-sm"></span>
                        Risk Classification
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                    cornerRadius={6}
                                >
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={EXECUTIVE_COLORS[index % EXECUTIVE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Source IPs */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
                    <h3 className="text-slate-900 text-lg font-bold mb-8 flex items-center tracking-wide">
                        <span className="w-1.5 h-5 bg-indigo-500 rounded-full mr-4 shadow-sm"></span>
                        Top Attacking Nodes
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topTalkers} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="ip" type="category" stroke="#94a3b8" tick={{ fontSize: 10 }} width={100} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                                <Bar dataKey="count" fill="#4338ca" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Lexical Pattern Analysis */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <span className="text-[80px] font-mono font-bold text-indigo-500">LEXICAL</span>
                </div>
                <h3 className="text-slate-900 text-lg font-bold mb-8 flex items-center tracking-wide">
                    <span className="w-1.5 h-5 bg-emerald-600 rounded-full mr-4 shadow-sm"></span>
                    Pattern Signature (Entropy vs Length)
                </h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                type="number"
                                dataKey="length"
                                name="Length"
                                unit="ch"
                                stroke="#94a3b8"
                                label={{ value: 'Query Length', position: 'bottom', fill: '#94a3b8', fontSize: 12 }}
                            />
                            <YAxis
                                type="number"
                                dataKey="entropy"
                                name="Entropy"
                                stroke="#94a3b8"
                                label={{ value: 'Entropy', angle: -90, position: 'left', fill: '#94a3b8', fontSize: 12 }}
                            />
                            <ZAxis type="number" dataKey="risk" range={[50, 400]} />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
                                labelStyle={{ color: '#1e293b' }}
                                formatter={(value, name) => [value, name.toUpperCase()]}
                            />
                            <Scatter name="Signatures" data={lexicalScatter} fill="#4338ca">
                                {lexicalScatter.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.risk >= 80 ? '#b91c1c' : entry.risk >= 40 ? '#b45309' : '#4338ca'}
                                        fillOpacity={0.7}
                                        stroke={entry.risk >= 80 ? '#b91c1c' : entry.risk >= 40 ? '#b45309' : '#4338ca'}
                                    />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-center gap-6 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-rose-600 rounded-full"></span> Critical Risk</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-600 rounded-full"></span> High Risk</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-indigo-600 rounded-full"></span> Medium Risk</span>
                </div>
            </div>
        </div>
    );
};

export default AnomalyCharts;
