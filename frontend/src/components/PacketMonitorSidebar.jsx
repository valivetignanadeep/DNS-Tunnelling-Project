import React, { useState, useEffect, useRef } from 'react';
import { 
    X, Radio, Cpu, ShieldAlert, ArrowRightLeft, 
    Circle, Wifi, AlertCircle, CheckCircle, 
    TrendingUp, Binary, ArrowDown, ArrowUp, Terminal,
    Play, Pause, Trash2, Filter
} from 'lucide-react';

// ────────────────────────────────────────────────
// Packet Classification System
// ────────────────────────────────────────────────
const getPacketClassification = (entropy, qtype, size) => {
    const qtypeStr = String(qtype);
    
    // Critical DNS Exfiltration
    if (entropy >= 4.8 || (entropy >= 4.2 && qtypeStr === '16' && size > 110)) {
        return {
            label: "CRITICAL",
            color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
            textColor: "text-rose-600",
            termColor: "text-rose-400 font-bold",
            desc: "DNS Exfiltration Payload"
        };
    }
    // High Risk C2 Tunneling
    if (entropy >= 4.2) {
        return {
            label: "HIGH RISK",
            color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
            textColor: "text-orange-600",
            termColor: "text-orange-400 font-bold",
            desc: "C2 Tunneling Beacon"
        };
    }
    // Suspicious Activity
    if (entropy >= 3.5 || qtypeStr === '16') {
        return {
            label: "SUSPICIOUS",
            color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
            textColor: "text-amber-600",
            termColor: "text-amber-400",
            desc: "Telemetry / Recon Probe"
        };
    }
    // Low Risk CDNs or Dynamics
    if (entropy >= 2.8) {
        return {
            label: "LOW RISK",
            color: "bg-sky-500/10 text-sky-600 border-sky-500/20",
            textColor: "text-sky-600",
            termColor: "text-sky-400",
            desc: "Dynamic DNS Lookup"
        };
    }
    // Clean natural domain name queries
    return {
        label: "CLEAN",
        color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        textColor: "text-emerald-600",
        termColor: "text-emerald-400",
        desc: "Legitimate Traffic"
    };
};

// ────────────────────────────────────────────────
// Section header for each panel
// ────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, badge, badgeColor = 'bg-teal-100 text-teal-700' }) => (
    <div className="flex items-center justify-between px-4 py-2.5 bg-stone-50 border-b border-stone-200/80 sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <Icon size={13} className="text-teal-600" />
            <span className="text-[10px] font-black text-stone-800 uppercase tracking-widest">{title}</span>
        </div>
        {badge && (
            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeColor}`}>
                {badge}
            </span>
        )}
    </div>
);

// ────────────────────────────────────────────────
// 1. Packet Console Panel (Live CLI Stream)
// ────────────────────────────────────────────────
const ConsolePanel = ({ queries, liveActive, onToggleLive }) => {
    const [filterClass, setFilterClass] = useState('ALL');
    const [bufferedPackets, setBufferedPackets] = useState([]);
    const terminalEndRef = useRef(null);

    // Sync packets but respect play/pause status
    useEffect(() => {
        if (!queries) return;
        if (liveActive) {
            // queries is stored newest first, so we reverse it to display chronologically in console
            const reversed = [...queries].reverse();
            setBufferedPackets(reversed);
        }
    }, [queries, liveActive]);

    // Auto scroll to bottom of terminal
    useEffect(() => {
        if (liveActive) {
            terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [bufferedPackets, liveActive]);

    const handleClear = () => {
        setBufferedPackets([]);
    };

    const filteredPackets = bufferedPackets.filter(p => {
        if (filterClass === 'ALL') return true;
        const cls = getPacketClassification(p.entropy, p.qtype, p.size);
        return cls.label === filterClass;
    });

    return (
        <div className="flex flex-col h-full bg-[#1c1917] text-stone-200 font-mono text-[9px] relative">
            {/* Console Settings Toolstrip */}
            <div className="flex items-center justify-between bg-stone-900 border-b border-stone-800 px-3 py-1.5 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </div>
                    <span className="text-[8px] text-stone-400 tracking-wide lowercase">dns-sniff-console@netguard</span>
                </div>
                <div className="flex items-center gap-2.5 text-[8px] text-stone-400">
                    <button 
                        onClick={() => onToggleLive(!liveActive)} 
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded border transition-colors ${
                            !liveActive 
                            ? 'bg-amber-600/20 border-amber-600/30 text-amber-400 hover:bg-amber-600/30' 
                            : 'bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-300'
                        }`}
                        title={!liveActive ? "Resume Live Sniffer Console" : "Pause Live Sniffer Console"}
                    >
                        {!liveActive ? <Play size={8} /> : <Pause size={8} />}
                        {!liveActive ? "RESUME" : "PAUSE"}
                    </button>
                    <button 
                        onClick={handleClear} 
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-stone-700 bg-stone-800 hover:bg-stone-700 hover:text-white transition-colors"
                        title="Clear console window"
                    >
                        <Trash2 size={8} />
                        CLEAR
                    </button>
                </div>
            </div>

            {/* Filter Pillbox */}
            <div className="flex items-center gap-1 bg-[#292524] px-3 py-1 border-b border-stone-800 shrink-0 overflow-x-auto select-none custom-scrollbar">
                <Filter size={7} className="text-stone-500 shrink-0" />
                {['ALL', 'CLEAN', 'LOW RISK', 'SUSPICIOUS', 'HIGH RISK', 'CRITICAL'].map(cls => (
                    <button
                        key={cls}
                        onClick={() => setFilterClass(cls)}
                        className={`text-[7.5px] font-bold px-1.5 py-0.5 rounded transition-all shrink-0 uppercase ${
                            filterClass === cls
                            ? 'bg-teal-600 text-white font-black'
                            : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                        }`}
                    >
                        {cls}
                    </button>
                ))}
            </div>

            {/* Terminal Screen */}
            <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1.5 custom-scrollbar select-text bg-[#1c1917]">
                {filteredPackets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-stone-500 opacity-50 py-16">
                        <Terminal size={18} className="animate-pulse" />
                        <span>AWAITING PACKET TRANSMISSION STREAM...</span>
                    </div>
                ) : (
                    filteredPackets.map((p, i) => {
                        const cls = getPacketClassification(p.entropy, p.qtype, p.size);
                        const timeStr = p.timestamp 
                            ? new Date(p.timestamp * 1000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
                            : new Date().toLocaleTimeString([], { hour12: false });
                        
                        const qtypeLabel = p.qtype === '1' ? 'A' : p.qtype === '28' ? 'AAAA' : p.qtype === '16' ? 'TXT' : p.qtype === '5' ? 'CNAME' : 'DNS';

                        return (
                            <div 
                                key={i} 
                                className="leading-relaxed hover:bg-stone-900/40 py-0.5 rounded px-1 transition-all border-l-2 border-transparent hover:border-teal-500/30 flex flex-wrap gap-x-1"
                            >
                                <span className="text-stone-500">[{timeStr}]</span>
                                <span className="text-teal-400 font-bold">{p.src_ip}</span>
                                <span className="text-stone-400">&gt; DNS:</span>
                                <span className="text-indigo-400 font-black">[{qtypeLabel}]</span>
                                <span className="text-stone-100 font-bold break-all flex-1 min-w-[120px]">{p.query || p.domain}</span>
                                <span className="text-stone-500">({p.size}B)</span>
                                <span className="text-stone-500">|</span>
                                <span className={cls.termColor}>[{cls.label}]</span>
                                <span className="text-stone-500">H={p.entropy?.toFixed(2)}</span>
                            </div>
                        );
                    })
                )}
                <div ref={terminalEndRef} />
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────
// 2. Packet Parsing Panel (Deep-Dive Cards)
// ────────────────────────────────────────────────
const ParsingPanel = ({ queries }) => {
    const bottomRef = useRef(null);
    const recent = queries ? queries.slice(0, 25) : [];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [queries]);

    return (
        <div className="flex flex-col h-full bg-white">
            <SectionHeader
                icon={Binary}
                title="Packet Parsing"
                badge={`${queries?.length || 0} pkts`}
                badgeColor="bg-teal-50 text-teal-700 border border-teal-100"
            />
            <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar bg-white">
                {recent.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30 py-12">
                        <Radio size={24} className="text-stone-400 animate-pulse" />
                        <span className="text-[9px] text-stone-400 font-mono uppercase tracking-widest text-center">
                            Awaiting packet stream...
                        </span>
                    </div>
                ) : (
                    recent.map((q, i) => {
                        const cls = getPacketClassification(q.entropy, q.qtype, q.size);
                        const isAlerted = cls.label === 'CRITICAL' || cls.label === 'HIGH RISK';
                        
                        return (
                            <div
                                key={i}
                                className={`py-2 border-b border-stone-100 group transition-colors ${
                                    isAlerted ? 'bg-rose-50/40' : 'hover:bg-stone-50/50'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="font-mono text-[9.5px] text-teal-700 font-bold truncate max-w-[150px]">
                                        {q.src_ip || '0.0.0.0'}
                                    </span>
                                    <div className="flex gap-1 items-center">
                                        <span className={`text-[7.5px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${cls.color}`}>
                                            {cls.label}
                                        </span>
                                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded uppercase bg-stone-100 text-stone-600 border border-stone-200">
                                            {q.qtype === '1' ? 'A' : q.qtype === '28' ? 'AAAA' : q.qtype === '16' ? 'TXT' : q.qtype === '5' ? 'CNAME' : 'DNS'}
                                        </span>
                                    </div>
                                </div>
                                <p className="font-mono text-[9px] text-stone-600 truncate leading-tight mt-0.5" title={q.domain || q.query}>
                                    {q.domain || q.query}
                                </p>
                                <div className="flex gap-3 mt-1">
                                    <span className="font-mono text-[8px] text-stone-400">
                                        Entropy: <span className={`font-bold ${
                                            q.entropy >= 4.5 ? 'text-rose-500' :
                                            q.entropy >= 3.0 ? 'text-amber-600' : 'text-emerald-600'
                                        }`}>{q.entropy}</span>
                                    </span>
                                    <span className="font-mono text-[8px] text-stone-400">
                                        Size: <span className="font-bold text-stone-600">{q.size}B</span>
                                    </span>
                                    <span className="font-mono text-[8px] text-stone-400 italic">
                                        {cls.desc}
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
// 3. Detection Panel (Threat Analysis Feed)
// ────────────────────────────────────────────────
const DetectionPanel = ({ anomalies, distribution }) => {
    const recent = anomalies ? anomalies.slice(0, 20) : [];

    return (
        <div className="flex flex-col h-full bg-white">
            <SectionHeader
                icon={ShieldAlert}
                title="Detection Engine"
                badge={`${anomalies?.length || 0} flags`}
                badgeColor={anomalies?.length > 0 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}
            />
            {/* Distribution mini-stats */}
            {distribution && (
                <div className="grid grid-cols-3 gap-0 border-b border-stone-200/80 shrink-0">
                    {[
                        { label: 'Critical', value: distribution.critical, color: 'text-rose-600 bg-rose-50', border: 'border-rose-100' },
                        { label: 'High',     value: distribution.high,     color: 'text-amber-600 bg-amber-50', border: 'border-amber-100' },
                        { label: 'Medium',   value: distribution.medium,   color: 'text-sky-600 bg-sky-50',     border: 'border-sky-100' },
                    ].map(({ label, value, color, border }) => (
                        <div key={label} className={`flex flex-col items-center py-2 border-r ${border} last:border-r-0`}>
                            <span className={`text-sm font-black font-mono leading-tight ${color.split(' ')[0]}`}>{value ?? 0}</span>
                            <span className="text-[7.5px] text-stone-400 uppercase font-bold tracking-wider">{label}</span>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar bg-white">
                {recent.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30 py-12">
                        <CheckCircle size={24} className="text-emerald-500 animate-pulse" />
                        <span className="text-[9px] text-stone-400 font-mono uppercase tracking-widest text-center">
                            No threats detected yet
                        </span>
                    </div>
                ) : (
                    recent.map((a, i) => (
                        <div
                            key={i}
                            className="py-2.5 border-b border-stone-100 animate-in fade-in duration-500"
                        >
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <AlertCircle size={10} className={`shrink-0 ${
                                        a.risk_score >= 80 ? 'text-rose-500' :
                                        a.risk_score >= 40 ? 'text-amber-500' : 'text-sky-500'
                                    }`} />
                                    <p className="font-mono text-[9px] text-stone-800 font-bold truncate" title={a.domain}>
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
                            <p className="text-[8.5px] text-stone-500 truncate font-mono mb-0.5 ml-4">
                                Src IP: <span className="font-bold text-stone-700">{a.src_ip}</span>
                            </p>
                            {a.threat_type && (
                                <span className="ml-4 text-[8px] font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded px-1 py-0.5 uppercase tracking-wide inline-block leading-none mt-0.5">
                                    ↳ {a.threat_type}
                                </span>
                            )}
                            {a.reasons && (
                                <p className="ml-4 text-[8px] text-stone-400 mt-1">Reasons: {a.reasons}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────
// 4. Transmitting Panel (PPS Traffic Statistics)
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
        <div className="flex flex-col h-full bg-white">
            <SectionHeader
                icon={ArrowRightLeft}
                title="Transmit Monitor"
                badge={pps > 0 ? `${pps} PPS` : 'IDLE'}
                badgeColor={pps > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-stone-100 text-stone-500 border border-stone-200'}
            />

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 gap-0 border-b border-stone-200/80 shrink-0">
                {[
                    { label: 'Throughput', value: `${pps} PPS`, icon: TrendingUp, color: 'text-teal-600' },
                    { label: 'Data Volume', value: formatBytes(totalBytes), icon: Binary, color: 'text-purple-600' },
                    { label: 'Active Sources', value: `${clientIPs} IPs`, icon: Radio, color: 'text-emerald-600' },
                    { label: 'Safe Ratio', value: `${safePct}%`, icon: CheckCircle, color: 'text-sky-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="flex flex-col px-3 py-2 border-b border-r border-stone-100 last:border-r-0">
                        <Icon size={10} className={`${color} mb-1`} />
                        <span className="font-mono font-black text-xs text-stone-900 leading-tight">{value}</span>
                        <span className="text-[7.5px] text-stone-400 uppercase font-bold tracking-wide">{label}</span>
                    </div>
                ))}
            </div>

            {/* Adapter source */}
            <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 border-b border-stone-100 shrink-0">
                <Wifi size={10} className="text-teal-500" />
                <span className="text-[8.5px] font-mono text-stone-600 truncate">
                    Adapter: <span className="font-bold text-teal-700">{adapterName}</span>
                </span>
            </div>

            {/* Traffic ratio bars */}
            <div className="px-3 py-2.5 border-b border-stone-100 space-y-2 shrink-0">
                <div>
                    <div className="flex justify-between mb-0.5">
                        <span className="text-[8px] text-stone-500 font-bold uppercase tracking-wide flex items-center gap-1">
                            <ArrowDown size={8} className="text-emerald-500" /> Clean Traffic
                        </span>
                        <span className="text-[8px] font-mono font-bold text-emerald-600">{safePct}%</span>
                    </div>
                    <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${safePct}%` }}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between mb-0.5">
                        <span className="text-[8px] text-stone-500 font-bold uppercase tracking-wide flex items-center gap-1">
                            <ArrowUp size={8} className="text-rose-500" /> Threat Traffic
                        </span>
                        <span className="text-[8px] font-mono font-bold text-rose-600">{threatPct}%</span>
                    </div>
                    <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-rose-400 rounded-full transition-all duration-700"
                            style={{ width: `${threatPct}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Live engine log stream */}
            <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar bg-white space-y-0">
                <p className="text-[8px] font-bold text-stone-300 uppercase tracking-widest pb-1 border-b border-stone-100 mb-1">
                    Engine Log Stream
                </p>
                {recentLogs.length === 0 ? (
                    <div className="flex items-center gap-2 opacity-30 py-4">
                        <Circle size={10} className="text-stone-400 animate-pulse" />
                        <span className="text-[9px] text-stone-400 font-mono">Waiting for log events...</span>
                    </div>
                ) : (
                    recentLogs.map((log, i) => {
                        const isAlert = log?.includes('ALERT') || log?.includes('⚠') || log?.includes('Flagged');
                        const isSuccess = log?.includes('✓') || log?.includes('Clean');
                        const isInfo = log?.includes('Initializ') || log?.includes('Adapter') || log?.includes('Starting') || log?.includes('Sniffer');
                        
                        return (
                            <div
                                key={i}
                                className="flex gap-1.5 items-start py-1 border-b border-stone-50 font-mono text-[9px] text-stone-600 animate-in fade-in duration-300"
                            >
                                <span className="text-stone-300 text-[8px] pt-0.5 shrink-0 select-none">
                                    {new Date().toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                                <span className={`break-all leading-normal ${
                                    isAlert ? 'text-rose-600 font-bold' :
                                    isSuccess ? 'text-emerald-600 font-medium' :
                                    isInfo ? 'text-teal-600 font-semibold' : 'text-stone-700'
                                }`}>
                                    {log}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────
// Main Packet Monitor Sidebar
// ────────────────────────────────────────────────
const PacketMonitorSidebar = ({ isOpen, onClose, liveData, liveActive, onToggleLive }) => {
    const [activePanel, setActivePanel] = useState('console'); // Default to console stream!

    const panels = [
        { id: 'console',      label: 'Console',     icon: Terminal },
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
                className="fixed inset-0 bg-stone-900/35 backdrop-blur-sm z-[60]"
                onClick={onClose}
            />

            {/* Sliding Panel */}
            <div className="fixed right-0 top-0 h-screen w-96 max-w-[95vw] bg-white border-l border-stone-200 shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">

                {/* Panel Header */}
                <div className="h-14 bg-white border-b border-stone-150 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-teal-600 rounded-lg shadow-sm">
                            <Cpu size={13} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-stone-850 uppercase tracking-widest leading-tight">Security Telemetry</span>
                            <span className="text-[8px] text-stone-400 font-mono uppercase tracking-wide">Live Packet Console & Analyzer</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-all"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Tab switcher */}
                <div className="flex border-b border-stone-150 shrink-0 bg-stone-50">
                    {panels.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActivePanel(id)}
                            className={`flex-1 flex flex-col items-center py-2 gap-1 text-[8px] font-bold uppercase tracking-wide transition-all border-r border-stone-150 last:border-r-0 ${
                                activePanel === id
                                    ? 'bg-white text-teal-700 border-b-2 border-teal-600 -mb-px font-black shadow-sm'
                                    : 'text-stone-500 hover:text-teal-600 hover:bg-white/60'
                            }`}
                        >
                            <Icon size={12} className={activePanel === id ? 'text-teal-600' : 'text-stone-400'} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Panel content area */}
                <div className="flex-1 overflow-hidden">
                    {activePanel === 'console' && (
                        <ConsolePanel 
                            queries={queries} 
                            liveActive={liveActive} 
                            onToggleLive={onToggleLive} 
                        />
                    )}
                    {activePanel === 'parsing'      && <ParsingPanel   queries={queries} />}
                    {activePanel === 'detection'    && <DetectionPanel anomalies={anomalies} distribution={dist} />}
                    {activePanel === 'transmitting' && <TransmittingPanel stats={stats} logs={logs} />}
                </div>
            </div>
        </>
    );
};

export default PacketMonitorSidebar;
