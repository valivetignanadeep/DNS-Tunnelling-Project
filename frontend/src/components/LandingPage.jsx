import React from 'react';
import {
    Shield, ArrowRight, BrainCircuit, Activity, Hash,
    Layers, Lock, Cpu, Wifi, CheckCircle, Zap, Globe
} from 'lucide-react';

const LandingPage = ({ onStartUpload, onStartLive }) => {

    const features = [
        {
            icon: BrainCircuit,
            title: "Entropy Analysis",
            desc: "Spots machine-generated random hostnames that humans would never type — a key fingerprint of DNS tunneling.",
            color: "text-teal-600",
            bg: "bg-teal-50",
            border: "border-teal-100",
        },
        {
            icon: Hash,
            title: "Lexical Inspection",
            desc: "Examines subdomain length, character mix, and structural patterns to catch encoded payloads hiding in plain sight.",
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-100",
        },
        {
            icon: Activity,
            title: "Frequency Monitoring",
            desc: "Tracks how often queries repeat and from which sources — automated exfiltration tools leave a distinctive rhythm.",
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "border-purple-100",
        },
    ];

    const steps = [
        {
            num: "1",
            emoji: "📡",
            title: "Capture Traffic",
            desc: "Upload a PCAP file or start live monitoring directly from your network interface.",
            color: "bg-teal-500",
        },
        {
            num: "2",
            emoji: "🔍",
            title: "Analyze Patterns",
            desc: "Our engine scores every DNS query against entropy, structure, and frequency baselines.",
            color: "bg-amber-500",
        },
        {
            num: "3",
            emoji: "🚨",
            title: "Flag & Explain",
            desc: "Suspicious queries are highlighted with plain-English explanations of why they're dangerous.",
            color: "bg-rose-500",
        },
    ];

    const stats = [
        { value: "99.8%", label: "Detection Rate",   icon: CheckCircle, color: "text-teal-600" },
        { value: "<12ms", label: "Response Time",     icon: Zap,          color: "text-amber-600" },
        { value: "3",     label: "Detection Models",  icon: BrainCircuit, color: "text-purple-600" },
        { value: "DNS",   label: "Protocol Focus",    icon: Globe,        color: "text-blue-600" },
    ];

    return (
        <div className="min-h-screen font-sans relative overflow-x-hidden" style={{ background: '#f8f6f2' }}>

            {/* Soft background gradient blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-40"
                    style={{ background: 'radial-gradient(circle, #ccfbf1 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-30"
                    style={{ background: 'radial-gradient(circle, #ffedd5 0%, transparent 70%)' }} />
            </div>

            {/* ── Navigation ── */}
            <nav className="fixed top-0 inset-x-0 h-16 bg-white/90 backdrop-blur-xl border-b border-stone-200/80 z-50 flex items-center justify-between px-6 md:px-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-md">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="font-bold text-stone-900 text-sm leading-tight">
                            NET<span className="text-teal-600">GUARD</span>
                        </div>
                        <div className="text-[9px] text-stone-400 font-medium uppercase tracking-widest leading-tight">
                            DNS Tunneling Detector
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {['How It Works', 'Features', 'About'].map(item => (
                        <a key={item} href={`#${item.toLowerCase().replace(/ /g,'-')}`}
                            className="text-sm font-medium text-stone-500 hover:text-teal-600 transition-colors">
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={onStartUpload}
                        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition-all border border-stone-200">
                        Upload PCAP
                    </button>
                    <button onClick={onStartLive}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all shadow-md"
                        style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Go Live
                    </button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section id="hero" className="pt-36 pb-20 px-6 text-center max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border text-sm font-semibold"
                    style={{ background: '#f0fdfa', borderColor: '#99f6e4', color: '#0f766e' }}>
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    Real-time DNS Protection
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 mb-6 leading-tight">
                    Stop hidden threats<br />
                    <span className="text-transparent bg-clip-text" style={{
                        backgroundImage: 'linear-gradient(135deg, #0d9488, #7c3aed)'
                    }}>inside your DNS traffic</span>
                </h1>

                <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
                    Attackers use normal-looking DNS queries to secretly send stolen data. 
                    NETGUARD catches them by analysing patterns that humans can't spot manually.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button onClick={onStartLive}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-white text-base font-bold shadow-lg transition-all active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)', boxShadow: '0 6px 24px rgba(13,148,136,0.35)' }}>
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        Start Live Monitoring
                        <ArrowRight size={18} />
                    </button>
                    <button onClick={onStartUpload}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-stone-700 text-base font-bold border-2 border-stone-200 bg-white hover:border-teal-300 hover:bg-teal-50 transition-all active:scale-95">
                        Analyse a PCAP File
                    </button>
                </div>

                {/* Trust bar */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
                    {stats.map(({ value, label, icon: Icon, color }) => (
                        <div key={label} className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-stone-100 shadow-sm">
                            <Icon size={15} className={color} />
                            <div className="text-left">
                                <div className="font-black text-stone-900 text-sm leading-none">{value}</div>
                                <div className="text-[10px] text-stone-400 font-medium">{label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How it works ── */}
            <section id="how-it-works" className="py-20 px-6 max-w-5xl mx-auto">
                <div className="text-center mb-14">
                    <span className="section-label">Simple 3-Step Process</span>
                    <h2 className="text-4xl font-extrabold text-stone-900">How detection works</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Connecting line */}
                    <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-teal-200 via-amber-200 to-rose-200 z-0" />
                    {steps.map((step, idx) => (
                        <div key={idx} className="human-card p-8 flex flex-col items-center text-center relative z-10 group">
                            <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                {step.emoji}
                            </div>
                            <h3 className="text-lg font-bold text-stone-900 mb-2">{step.title}</h3>
                            <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
                <div className="text-center mb-14">
                    <span className="section-label">Under the Hood</span>
                    <h2 className="text-4xl font-extrabold text-stone-900">Three detection engines, one result</h2>
                    <p className="text-stone-500 mt-3 max-w-xl mx-auto">
                        Each model targets a different telltale sign of DNS tunneling, working together to catch what others miss.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <div key={i} className={`human-card p-8 group hover:border-teal-200 transition-all`}>
                            <div className={`w-12 h-12 ${f.bg} border ${f.border} rounded-2xl flex items-center justify-center mb-5`}>
                                <f.icon className={`w-6 h-6 ${f.color}`} />
                            </div>
                            <h3 className="text-lg font-bold text-stone-900 mb-2">{f.title}</h3>
                            <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── About & CTA ── */}
            <section id="about" className="py-20 px-6 max-w-5xl mx-auto">
                <div className="human-card p-10 md:p-14 overflow-hidden relative"
                    style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #fffbeb 100%)' }}>
                    <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                        <Shield className="w-full h-full text-teal-600" />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <span className="section-label">Why DNS?</span>
                        <h2 className="text-3xl font-extrabold text-stone-900 mb-4">
                            DNS is the internet's phone book — and attackers abuse it daily
                        </h2>
                        <p className="text-stone-600 leading-relaxed mb-4">
                            Over <strong>90% of malware</strong> uses DNS to communicate. Because DNS traffic is 
                            rarely inspected deeply, attackers hide stolen data and receive commands inside 
                            perfectly normal-looking queries.
                        </p>
                        <p className="text-stone-600 leading-relaxed mb-8">
                            NETGUARD watches every query's <em>shape</em> — its randomness, length, and rhythm — 
                            not just its content. That's how it catches threats that signature-based tools miss.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={onStartLive}
                                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold text-sm transition-all shadow-md active:scale-95"
                                style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)' }}>
                                <Wifi size={16} className="animate-pulse" />
                                Launch Live Sniffer
                            </button>
                            <button onClick={onStartUpload}
                                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm border-2 border-stone-200 bg-white hover:border-teal-300 transition-all text-stone-700">
                                Upload Network Capture
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-stone-200 py-10 px-6 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-stone-700 text-sm">NETGUARD</span>
                    <span className="text-stone-300 text-sm">•</span>
                    <span className="text-stone-400 text-xs">DNS Tunneling Detection v1.2.0</span>
                </div>
                <div className="flex gap-6">
                    {['Security Policy', 'Detection Wiki', 'Support'].map(l => (
                        <span key={l} className="text-xs text-stone-400 hover:text-teal-600 transition-colors cursor-pointer font-medium">{l}</span>
                    ))}
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
