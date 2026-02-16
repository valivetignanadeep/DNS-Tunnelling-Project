import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';

const NEON_COLORS = ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

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
                <div className="glass-card p-8 rounded-2xl border border-slate-800/40 relative overflow-hidden group shadow-lg">
                    <h3 className="text-white text-lg font-bold mb-8 flex items-center tracking-wide">
                        <span className="w-1.5 h-5 bg-neon-pink rounded-full mr-4"></span>
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
                                        <Cell key={`cell-${index}`} fill={NEON_COLORS[index % NEON_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#cbd5e1' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Source IPs */}
                <div className="glass-card p-8 rounded-2xl border border-slate-800/40 shadow-lg">
                    <h3 className="text-white text-lg font-bold mb-8 flex items-center tracking-wide">
                        <span className="w-1.5 h-5 bg-neon-cyan rounded-full mr-4"></span>
                        Top Attacking Nodes
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topTalkers} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                                <YAxis dataKey="ip" type="category" stroke="#64748b" tick={{ fontSize: 10 }} width={100} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Lexical Pattern Analysis */}
            <div className="glass-card p-8 rounded-2xl border border-slate-800/40 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <span className="text-[80px] font-mono font-bold text-blue-500">LEXICAL</span>
                </div>
                <h3 className="text-white text-lg font-bold mb-8 flex items-center tracking-wide">
                    <span className="w-1.5 h-5 bg-emerald-500 rounded-full mr-4"></span>
                    Pattern Signature (Entropy vs Length)
                </h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                type="number"
                                dataKey="length"
                                name="Length"
                                unit="ch"
                                stroke="#64748b"
                                label={{ value: 'Query Length', position: 'bottom', fill: '#64748b', fontSize: 12 }}
                            />
                            <YAxis
                                type="number"
                                dataKey="entropy"
                                name="Entropy"
                                stroke="#64748b"
                                label={{ value: 'Entropy', angle: -90, position: 'left', fill: '#64748b', fontSize: 12 }}
                            />
                            <ZAxis type="number" dataKey="risk" range={[50, 400]} />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                                labelStyle={{ color: '#fff' }}
                                formatter={(value, name) => [value, name.toUpperCase()]}
                            />
                            <Scatter name="Signatures" data={lexicalScatter} fill="#8b5cf6">
                                {lexicalScatter.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.risk >= 80 ? '#ef4444' : entry.risk >= 40 ? '#f59e0b' : '#3b82f6'}
                                        fillOpacity={0.6}
                                        stroke={entry.risk >= 80 ? '#ef4444' : entry.risk >= 40 ? '#f59e0b' : '#3b82f6'}
                                    />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-center gap-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-rose-500 rounded-full"></span> Critical Risk</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> High Risk</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Medium Risk</span>
                </div>
            </div>
        </div>
    );
};

export default AnomalyCharts;
