import React, { useState } from 'react';
import { 
    Database, ShieldCheck, AlertCircle, Info, ShieldAlert, 
    ChevronDown, ChevronUp, Terminal, Sliders, Activity, Search
} from 'lucide-react';

const getClassificationDetails = (classification, entropy, qtype, size) => {
    const cls = classification || (
        entropy >= 4.8 || (entropy >= 4.2 && qtype === '16' && size > 110) ? "CRITICAL" :
        entropy >= 4.2 ? "HIGH RISK" :
        entropy >= 3.5 || qtype === '16' ? "SUSPICIOUS" :
        entropy >= 2.8 ? "LOW RISK" : "CLEAN"
    );

    switch (cls) {
        case "CRITICAL":
            return {
                label: "CRITICAL THREAT",
                color: "bg-rose-500/10 text-rose-600 border-rose-500/25",
                textColor: "text-rose-500",
                icon: ShieldAlert,
                desc: "Severe data leak via encrypted recursive tunneling."
            };
        case "HIGH RISK":
            return {
                label: "HIGH RISK",
                color: "bg-orange-500/10 text-orange-600 border-orange-500/25",
                textColor: "text-orange-600",
                icon: AlertCircle,
                desc: "Potential command-and-control cyclical beacon heartbeat."
            };
        case "SUSPICIOUS":
            return {
                label: "SUSPICIOUS",
                color: "bg-amber-500/10 text-amber-600 border-amber-500/25",
                textColor: "text-amber-600",
                icon: AlertCircle,
                desc: "Elevated domain entropy. Unusual character density."
            };
        case "LOW RISK":
            return {
                label: "LOW RISK",
                color: "bg-sky-500/10 text-sky-600 border-sky-500/25",
                textColor: "text-sky-600",
                icon: Info,
                desc: "Standard dynamic tracking hostname or edge CDN."
            };
        default:
            return {
                label: "CLEAN",
                color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/25",
                textColor: "text-emerald-600",
                icon: ShieldCheck,
                desc: "Safe natural language English hostname resolution."
            };
    }
};

const getQtypeLabel = (qtype) => {
    const q = String(qtype);
    switch (q) {
        case '1':
            return { short: 'A', name: 'A (IPv4 Host Address)', desc: 'Standard host address map' };
        case '28':
            return { short: 'AAAA', name: 'AAAA (IPv6 Address)', desc: 'IPv6 host address map' };
        case '16':
            return { short: 'TXT', name: 'TXT (Text Payload)', desc: 'Arbitrary text. Primary tunneling vector' };
        case '5':
            return { short: 'CNAME', name: 'CNAME (Alias Name)', desc: 'Canonical alias. Frequent beaconing target' };
        case '15':
            return { short: 'MX', name: 'MX (Mail Exchange)', desc: 'Identifies authoritative mail server' };
        default:
            return { short: q || 'DNS', name: `QTYPE ${q}`, desc: 'DNS query protocol layer' };
    }
};

const PacketLogTable = ({ data, detectionMode }) => {
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 overflow-hidden shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="w-1.5 h-6 bg-teal-600 rounded-full mr-4 shadow-sm"></span>
                    Raw Packet Transmission Inspection Console
                </div>
                <span className="text-[10px] font-mono text-slate-500 tracking-wider bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                    {data?.length || 0} ACTIVE PACKET RECORDS IN MEMORY
                </span>
            </h3>

            <div className="overflow-x-auto max-h-[650px] custom-scrollbar">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="sticky top-0 bg-white border-b border-slate-200 z-10">
                        <tr>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[9px] uppercase tracking-widest pl-2 border-b border-slate-100">TIMESTAMP</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[9px] uppercase tracking-widest border-b border-slate-100">SRC_IP</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[9px] uppercase tracking-widest border-b border-slate-100">MODE</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[9px] uppercase tracking-widest border-b border-slate-100">DOMAIN PAYLOAD</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[9px] uppercase tracking-widest text-center border-b border-slate-100">TYPE</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[9px] uppercase tracking-widest text-center border-b border-slate-100">SIZE</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[9px] uppercase tracking-widest text-center border-b border-slate-100">METRICS</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[9px] uppercase tracking-widest text-center border-b border-slate-100">CLASSIFICATION</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[9px] uppercase tracking-widest text-center border-b border-slate-100">DPI</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data && data.length > 0 ? (
                            data.map((row, index) => {
                                const cls = getClassificationDetails(row.classification, row.entropy, row.qtype, row.size);
                                const qtypeInfo = getQtypeLabel(row.qtype);
                                const Icon = cls.icon;
                                const isExpanded = expandedRow === index;
                                
                                // Parse precise subdomain payload
                                const parts = (row.query || row.domain || "").split('.');
                                const subdomain = parts.length > 2 ? parts[0] : "";
                                const baseDomain = parts.length > 2 ? parts.slice(1).join('.') : parts.join('.');
                                
                                // Determine operational session mode
                                let modeLabel = "PCAP_AUDIT";
                                let modeColor = "bg-sky-50 text-sky-700 border-sky-200";
                                if (detectionMode === 'live') {
                                    if (row.src_ip.startsWith('192.168') || row.src_ip.startsWith('10.')) {
                                        modeLabel = "LIVE_SNIFF";
                                        modeColor = "bg-teal-50 text-teal-700 border-teal-200";
                                    } else {
                                        modeLabel = "SIM_NODE";
                                        modeColor = "bg-amber-50 text-amber-700 border-amber-200";
                                    }
                                }

                                return (
                                    <React.Fragment key={index}>
                                        <tr 
                                            onClick={() => toggleRow(index)}
                                            className={`hover:bg-slate-50/80 transition-colors cursor-pointer select-none group ${
                                                isExpanded ? 'bg-slate-50 font-medium' : ''
                                            }`}
                                        >
                                            {/* TIMESTAMP */}
                                            <td className="py-3 font-mono text-[10.5px] text-slate-600 pl-2">
                                                {row?.timestamp 
                                                    ? new Date(row.timestamp * 1000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })
                                                    : '00:00:00.000'
                                                }
                                            </td>

                                            {/* SOURCE IP */}
                                            <td className="py-3 font-mono text-xs text-teal-700 font-bold">{row.src_ip}</td>

                                            {/* DETECTION MODE */}
                                            <td className="py-3">
                                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider font-mono ${modeColor}`}>
                                                    {modeLabel}
                                                </span>
                                            </td>

                                            {/* DOMAIN PAYLOAD */}
                                            <td className="py-3 max-w-[200px] md:max-w-[280px]">
                                                <div className="flex items-center gap-1 overflow-hidden truncate font-mono text-xs leading-normal">
                                                    {subdomain && (
                                                        <span className="text-indigo-600 font-bold select-all break-all" title="Exfiltration payload subdomain">
                                                            {subdomain}.
                                                        </span>
                                                    )}
                                                    <span className="text-stone-700 select-all break-all">{baseDomain}</span>
                                                </div>
                                            </td>

                                            {/* QUERY TYPE */}
                                            <td className="py-3 text-center">
                                                <span className="px-2 py-0.5 bg-slate-100 rounded text-[9.5px] text-slate-600 border border-slate-200 font-black cursor-help" title={qtypeInfo.name}>
                                                    {qtypeInfo.short}
                                                </span>
                                            </td>

                                            {/* SIZE */}
                                            <td className="py-3 text-center font-mono text-xs text-slate-500">{row.size}B</td>

                                            {/* ENTROPY & METRICS */}
                                            <td className="py-3 text-center">
                                                <div className="flex flex-col items-center leading-none">
                                                    <span className="font-mono text-[10px] font-bold text-slate-700">H={row.entropy?.toFixed(2)}</span>
                                                    <span className="text-[8px] font-mono text-slate-400 mt-0.5">L={row.query?.split('.')[0].length || 0}</span>
                                                </div>
                                            </td>

                                            {/* CLASSIFICATION */}
                                            <td className="py-3 text-center">
                                                <div className="flex justify-center">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8.5px] font-black border tracking-widest ${cls.color}`}>
                                                        <Icon size={10} className="shrink-0" />
                                                        {cls.label}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* DPI EXPAND TOGGLE */}
                                            <td className="py-3 text-center">
                                                <div className="flex justify-center text-slate-400 group-hover:text-slate-600 transition-colors">
                                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                </div>
                                            </td>
                                        </tr>

                                        {/* EXPANDABLE DPI DEBUGGER PANEL */}
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan="9" className="bg-[#FAF9F5] border-t border-b border-stone-200/50 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
                                                        
                                                        {/* Left Column: Analytical Assessment */}
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                                                                <Terminal size={14} className="text-teal-600 animate-pulse" />
                                                                <span>Deep Packet Inspection (DPI) Analytics</span>
                                                            </div>
                                                            <p className="text-stone-500 text-[11px] leading-relaxed">
                                                                Structural analysis maps outbound recursive queries to identify character distributions, Shannon randomness indices, and dynamic tunneling signals inside subdomains.
                                                            </p>
                                                            <div className="space-y-2 border-t border-stone-200/60 pt-3">
                                                                <div className="flex justify-between items-center text-[10.5px]">
                                                                    <span className="text-stone-400 font-semibold uppercase tracking-wide">Signal Assessment</span>
                                                                    <span className={`font-black uppercase text-[10px] ${cls.textColor}`}>{cls.label}</span>
                                                                </div>
                                                                <p className="text-[10px] text-stone-500 italic mt-0.5 leading-normal">
                                                                    &quot;{cls.desc}&quot;
                                                                </p>
                                                                <div className="flex justify-between items-center text-[10.5px] mt-2.5">
                                                                    <span className="text-stone-400 font-semibold uppercase tracking-wide">Record Target Mapping</span>
                                                                    <span className="font-bold text-stone-700 font-mono text-[10px]">{qtypeInfo.name}</span>
                                                                </div>
                                                                <p className="text-[10px] text-stone-500 italic mt-0.5 leading-normal">
                                                                    ↳ {qtypeInfo.desc}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Right Column: JSON Structured Debugger */}
                                                        <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-[#1c1917] text-stone-200 font-mono text-[9.5px]">
                                                            <div className="bg-stone-900 border-b border-stone-800 px-4 py-2 flex items-center justify-between text-stone-400 select-none">
                                                                <span>datagram_dpi_payload_inspect</span>
                                                                <span className="text-[8px] bg-stone-850 px-2 py-0.5 rounded border border-stone-800 tracking-wider">JSON</span>
                                                            </div>
                                                            <pre className="flex-1 overflow-x-auto p-4 leading-relaxed whitespace-pre-wrap select-text custom-scrollbar text-stone-200">
                                                                {JSON.stringify({
                                                                    packet_timestamp_raw: row.timestamp || Date.now() / 1000,
                                                                    packet_ip_header: {
                                                                        source_client_socket: `${row.src_ip}:${Math.floor(Math.random()*40000)+1025}`,
                                                                        target_gateway_resolver: "8.8.8.8:53"
                                                                    },
                                                                    dns_query_header: {
                                                                        query_domain: row.query || row.domain,
                                                                        query_type_code: row.qtype,
                                                                        query_type_desc: qtypeInfo.short,
                                                                        packet_size_bytes: row.size
                                                                    },
                                                                    algorithmic_scoring: {
                                                                        shannon_entropy_h: row.entropy || 0.0,
                                                                        entropy_classification: cls.label,
                                                                        subdomain_label_len: subdomain.length,
                                                                        subdomain_character_ratio: subdomain ? (subdomain.replace(/[a-zA-Z]/g, '').length / subdomain.length).toFixed(3) : "0.000"
                                                                    },
                                                                    detection_engine_mode: modeLabel
                                                                }, null, 4)}
                                                            </pre>
                                                        </div>

                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" className="py-12 text-center">
                                    <div className="flex flex-col items-center opacity-30">
                                        <Database className="w-12 h-12 mb-3 text-slate-400" />
                                        <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">Database records empty</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PacketLogTable;
