import React, { useState, useEffect, useRef } from 'react';
import { 
    X, Radio, Cpu, ShieldAlert, ArrowRightLeft, 
    Circle, Wifi, AlertCircle, CheckCircle, 
    TrendingUp, Binary, ArrowDown, ArrowUp
} from 'lucide-react';

// ────────────────────────────────────────────────
// Single scrolling log line component
// ────────────────────────────────────────────────
const LogLine = ({ text, type = 'normal', index }) => {
    const colors = {
        alert:   'text-rose-600 font-bold',
        warning: 'text-amber-500 font-semibold',
        success: 'text-emerald-600',
        normal:  'text-slate-700',
        muted:   'text-slate-400',
        info:    'text-indigo-600 font-semibold',
    };
    return (
        <div
            className="flex gap-1.5 items-start py-1 border-b border-slate-50 animate-in fade-in slide-in-from-right-2 duration-300"
            style={{ animationDelay: `${index * 20}ms` }}
        >
            <span className="text-slate-300 font-mono text-[9px] pt-0.5 shrink-0">
                {new Date().toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className={`font-mono text-[9.5px] leading-relaxed break-all ${colors[type] || colors.normal}`}>
                {text}
            </span>
        </div>
    );
};

// ────────────────────────────────────────────────
// Section header for each panel
// ────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, badge, badgeColor = 'bg-indigo-100 text-indigo-700' }) => (
    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <Icon size={13} className="text-indigo-600" />
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{title}</span>
        </div>
        {badge && (
            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeColor}`}>
                {badge}
            </span>
        )}
    </div>
);

// ────────────────────────────────────────────────
// Packet Parsing Panel
// ────────────────────────────────────────────────
const ParsingPanel = ({ queries }) => {
    const bottomRef = useRef(null);
    const recent = queries ? queries.slice(0, 25) : [];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [queries]);

    return (
        <div className="flex flex-col h-full">
            <SectionHeader
                icon={Binary}
                title="Packet Parsing"
                badge={`${queries?.length || 0} pkts`}
                badgeColor="bg-indigo-50 text-indigo-700"
            />
            <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar bg-white space-y-0">
                {recent.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30 py-8">
                        <Radio size={24} className="text-slate-400 animate-pulse" />
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest text-center">
                            Awaiting packet stream...
                        </span>
                    </div>
                ) : (
                    recent.map((q, i) => {
                        const isAlerted = q.is_anomaly;
                        return (
                            <div
                                key={i}
                                className={`py-2 border-b border-slate-50 group transition-colors ${
                                    isAlerted ? 'bg-rose-50/40' : 'hover:bg-slate-50/80'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="font-mono text-[9px] text-indigo-700 font-bold truncate max-w-[150px]">
                                        {q.src_ip || '0.0.0.0'}
                                    </span>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                        isAlerted
                                            ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    }`}>
                                        {q.qtype === '1' ? 'A' : q.qtype === '28' ? 'AAAA' : 'DNS'}
                                    </span>
                                </div>
                                <p className="font-mono text-[9px] text-slate-600 truncate leading-tight" title={q.domain || q.query}>
                                    {q.domain || q.query}
                                </p>
                                <div className="flex gap-3 mt-0.5">
                                    <span className="font-mono text-[8px] text-slate-400">
                                        Entropy: <span className={`font-bold ${
                                            q.entropy >= 4.5 ? 'text-rose-500' :
                                            q.entropy >= 3.0 ? 'text-amber-500' : 'text-emerald-600'
                                        }`}>{q.entropy}</span>
                                    </span>
                                    <span className="font-mono text-[8px] text-slate-400">
                                        Size: <span className="font-bold text-slate-600">{q.size}B</span>
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────
// Detection Panel
// ────────────────────────────────────────────────
const DetectionPanel = ({ anomalies, distribution }) => {
    const recent = anomalies ? anomalies.slice(0, 20) : [];

    return (
        <div className="flex flex-col h-full">
            <SectionHeader
                icon={ShieldAlert}
                title="Detection Engine"
                badge={`${anomalies?.length || 0} flags`}
                badgeColor={anomalies?.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}
            />
            {/* Distribution mini-stats */}
            {distribution && (
                <div className="grid grid-cols-3 gap-0 border-b border-slate-100">
                    {[
                        { label: 'Critical', value: distribution.critical, color: 'text-rose-600 bg-rose-50', border: 'border-rose-100' },
                        { label: 'High',     value: distribution.high,     color: 'text-amber-600 bg-amber-50', border: 'border-amber-100' },
                        { label: 'Medium',   value: distribution.medium,   color: 'text-sky-600 bg-sky-50',     border: 'border-sky-100' },
                    ].map(({ label, value, color, border }) => (
                        <div key={label} className={`flex flex-col items-center py-2 border-r ${border} last:border-r-0`}>
                            <span className={`text-base font-black font-mono leading-tight ${color.split(' ')[0]}`}>{value ?? 0}</span>
                            <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">{label}</span>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar bg-white">
                {recent.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30 py-8">
                        <CheckCircle size={24} className="text-emerald-500" />
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest text-center">
                            No threats detected yet
                        </span>
                    </div>
                ) : (
                    recent.map((a, i) => (
                        <div
                            key={i}
                            className="py-2.5 border-b border-slate-50 animate-in fade-in duration-500"
                        >
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <AlertCircle size={10} className={`shrink-0 ${
                                        a.risk_score >= 80 ? 'text-rose-500' :
                                        a.risk_score >= 40 ? 'text-amber-500' : 'text-sky-500'
                                    }`} />
                                    <p className="font-mono text-[9px] text-slate-800 font-bold truncate" title={a.domain}>
                                        {a.domain}
                                    </p>
                                </div>
                                <span className={`shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded font-mono ${
                                    a.risk_score >= 80 ? 'bg-rose-500/10 text-rose-600' :
                                    a.risk_score >= 40 ? 'bg-amber-500/10 text-amber-600' : 'bg-sky-500/10 text-sky-600'
                                }`}>
                                    {a.risk_score}%
                                </span>
                            </div>
                            <p className="text-[8.5px] text-slate-500 truncate font-mono mb-0.5 ml-4">
                                {a.src_ip}
                            </p>
                            {a.threat_type && (
                                <span className="ml-4 text-[8px] font-bold text-indigo-600 uppercase tracking-wide leading-none">
                                    ↳ {a.threat_type}
                                </span>
                            )}
                            {a.reasons && (
                                <p className="ml-4 text-[8px] text-slate-400 mt-0.5">{a.reasons}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────
// Transmitting Panel
// ────────────────────────────────────────────────
const TransmittingPanel = ({ stats, logs }) => {
    const recentLogs = logs ? logs.slice(-30).reverse() : [];
    const pps = stats?.pps ?? 0;
    const totalBytes = stats?.totalBytes ?? 0;
    const clientIPs = stats?.activeClientIPs ?? 0;
    const adapterName = stats?.adapterName ?? 'Initializing...';
    const suspicious = stats?.suspicious ?? 0;
    const totalQueries = stats?.totalQueries ?? 0;

    const safePct = totalQueries > 0 ? (((totalQueries - suspicious) / totalQueries) * 100).toFixed(1) : '100.0';
    const threatPct = totalQueries > 0 ? ((suspicious / totalQueries) * 100).toFixed(1) : '0.0';

    const formatBytes = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="flex flex-col h-full">
            <SectionHeader
                icon={ArrowRightLeft}
                title="Transmit Monitor"
                badge={pps > 0 ? `${pps} PPS` : 'IDLE'}
                badgeColor={pps > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}
            />

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 gap-0 border-b border-slate-100">
                {[
                    { label: 'Throughput', value: `${pps} PPS`, icon: TrendingUp, color: 'text-indigo-600' },
                    { label: 'Data Volume', value: formatBytes(totalBytes), icon: Binary, color: 'text-purple-600' },
                    { label: 'Active Sources', value: `${clientIPs} IPs`, icon: Radio, color: 'text-emerald-600' },
                    { label: 'Safe Ratio', value: `${safePct}%`, icon: CheckCircle, color: 'text-sky-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="flex flex-col px-3 py-2.5 border-b border-r border-slate-50 last:border-r-0">
                        <Icon size={10} className={`${color} mb-1`} />
                        <span className="font-mono font-black text-sm text-slate-900 leading-tight">{value}</span>
                        <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wide">{label}</span>
                    </div>
                ))}
            </div>

            {/* Adapter source */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50/80 border-b border-slate-100">
                <Wifi size={10} className="text-indigo-500" />
                <span className="text-[8.5px] font-mono text-slate-600 truncate">
                    Adapter: <span className="font-bold text-indigo-700">{adapterName}</span>
                </span>
            </div>

            {/* Traffic ratio bars */}
            <div className="px-3 py-3 border-b border-slate-100 space-y-2">
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wide flex items-center gap-1">
                            <ArrowDown size={8} className="text-emerald-500" /> Clean Traffic
                        </span>
                        <span className="text-[8px] font-mono font-bold text-emerald-600">{safePct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${safePct}%` }}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wide flex items-center gap-1">
                            <ArrowUp size={8} className="text-rose-500" /> Threat Traffic
                        </span>
                        <span className="text-[8px] font-mono font-bold text-rose-600">{threatPct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-rose-400 rounded-full transition-all duration-700"
                            style={{ width: `${threatPct}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Live engine log stream */}
            <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar bg-white space-y-0">
                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest pb-1 border-b border-slate-50 mb-1">
                    Engine Log Stream
                </p>
                {recentLogs.length === 0 ? (
                    <div className="flex items-center gap-2 opacity-30 py-4">
                        <Circle size={10} className="text-slate-400 animate-pulse" />
                        <span className="text-[9px] text-slate-400 font-mono">Waiting for log events...</span>
                    </div>
                ) : (
                    recentLogs.map((log, i) => (
                        <LogLine
                            key={i}
                            text={log}
                            index={i}
                            type={
                                log?.includes('ALERT') || log?.includes('⚠') ? 'alert' :
                                log?.includes('Flagged') ? 'warning' :
                                log?.includes('✓') ? 'success' :
                                log?.includes('Initializ') || log?.includes('Adapter') ? 'info' : 'normal'
                            }
                        />
                    ))
                )}
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────
// Main Packet Monitor Sidebar
// ────────────────────────────────────────────────
const PacketMonitorSidebar = ({ isOpen, onClose, liveData }) => {
    const [activePanel, setActivePanel] = useState('parsing');

    const panels = [
        { id: 'parsing',      label: 'Parsing',     icon: Binary },
        { id: 'detection',    label: 'Detection',   icon: ShieldAlert },
        { id: 'transmitting', label: 'Transmit',    icon: ArrowRightLeft },
    ];

    if (!isOpen) return null;

    const queries   = liveData?.allQueries   ?? [];
    const anomalies = liveData?.results      ?? [];
    const logs      = liveData?.logs         ?? [];
    const dist      = liveData?.distribution ?? { critical: 0, high: 0, medium: 0 };
    const stats     = {
        pps:             liveData?.pps             ?? 0,
        totalBytes:      liveData?.totalBytes      ?? 0,
        activeClientIPs: liveData?.activeClientIPs ?? 0,
        adapterName:     liveData?.adapterName     ?? 'Initializing...',
        suspicious:      liveData?.suspicious      ?? 0,
        totalQueries:    liveData?.totalQueries    ?? 0,
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[60]"
                onClick={onClose}
            />

            {/* Sliding Panel */}
            <div className="fixed right-0 top-0 h-screen w-80 bg-white border-l border-slate-200 shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-400">

                {/* Panel Header */}
                <div className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-indigo-600 rounded-lg shadow-sm">
                            <Cpu size={13} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-tight">Packet Monitor</span>
                            <span className="text-[8px] text-slate-400 font-mono uppercase tracking-wide">Live Telemetry Feed</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Tab switcher */}
                <div className="flex border-b border-slate-100 shrink-0 bg-slate-50">
                    {panels.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActivePanel(id)}
                            className={`flex-1 flex flex-col items-center py-2.5 gap-1 text-[8.5px] font-bold uppercase tracking-wide transition-all border-r border-slate-100 last:border-r-0 ${
                                activePanel === id
                                    ? 'bg-white text-indigo-700 border-b-2 border-indigo-600 -mb-px'
                                    : 'text-slate-500 hover:text-indigo-600 hover:bg-white/60'
                            }`}
                        >
                            <Icon size={13} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Panel content area */}
                <div className="flex-1 overflow-hidden">
                    {activePanel === 'parsing'      && <ParsingPanel  queries={queries}    />}
                    {activePanel === 'detection'    && <DetectionPanel anomalies={anomalies} distribution={dist} />}
                    {activePanel === 'transmitting' && <TransmittingPanel stats={stats} logs={logs} />}
                </div>
            </div>
        </>
    );
};

export default PacketMonitorSidebar;
