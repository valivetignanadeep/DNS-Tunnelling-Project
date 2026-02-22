import React from 'react';
import { ShieldCheck, ArrowRight, BrainCircuit, Activity, Hash, Layers, Zap, Info, Shield, Lock, Cpu } from 'lucide-react';

const LandingPage = ({ onStartUpload }) => {
    const models = [
        {
            title: "Shannon Intelligence",
            desc: "Detects machine-generated randomness in hostnames by measuring character predictability.",
            icon: BrainCircuit,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        },
        {
            title: "Lexical Analysis",
            desc: "Analyzes structural attributes like subdomain depth and character diversity for exfiltration patterns.",
            icon: Hash,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Temporal Heartbeat",
            desc: "Identifies automated data tunneling 'heartbeats' and high-volume temporal exfiltration bursts.",
            icon: Activity,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        }
    ];

    const steps = [
        { id: "01", title: "Ingest Traffic", desc: "Upload PCAP or raw DNS log files for deep packet inspection." },
        { id: "02", title: "Heuristic Processing", desc: "Engine maps every query against 3 behavioral intelligence models." },
        { id: "03", title: "Risk Stratification", desc: "System assigns a composite risk score and flags C2 channels." }
    ];

    return (
        <div className="min-h-screen bg-[#fdfbf7] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans relative overflow-x-hidden">
            {/* Background Grid & Mesh */}
            <div className="bg-mesh pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none"></div>

            {/* Navigation Header */}
            <nav className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 z-[60] flex items-center justify-between px-6 md:px-12">
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(67,56,202,0.2)] group-hover:rotate-12 transition-transform duration-500">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 tracking-widest text-sm leading-tight">NET-GUARD<span className="text-indigo-600">.OPS</span></span>
                        <span className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase font-medium">Executive Security Hub</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden md:flex items-center gap-10">
                        {['Intelligence', 'Architecture', 'Mission'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-[11px] font-bold text-slate-600 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onStartUpload();
                            }}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[11px] tracking-widest hover:bg-indigo-700 transition-all shadow-[0_4px_12px_rgba(67,56,202,0.3)] active:scale-95"
                        >
                            INITIATE DETECTION
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-32 md:pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
                {/* Hero Section */}
                <section id="mission" className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto text-center scroll-mt-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-8">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Global Sec-Ops Standard</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tighter mb-8 leading-[0.9]">
                        DNS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">TUNNELLING DETECTION</span><br />
                        FOR COVERT DATA EXFILTRATION
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
                        Deploying military-grade lexical analysis and shannon entropy models to neutralize stealth tunneling threats before exfiltration begins.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-center">
                        <button
                            onClick={onStartUpload}
                            className="px-10 py-5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-[2rem] font-bold text-sm tracking-wide transition-all shadow-[0_4px_12px_rgba(67,56,202,0.3)] flex items-center gap-3 active:scale-95"
                        >
                            Start Detection Session
                            <ArrowRight size={18} />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-slate-900 opacity-50"></div>
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                                    +1.2k
                                </div>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">Nodes Secured Weekly</span>
                        </div>
                    </div>
                </section>

                {/* About & Mission Section */}
                <div id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40 items-center scroll-mt-24">
                    <div className="enterprise-card p-12 rounded-[3rem] relative overflow-hidden bg-white border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                        <div className="bg-mesh opacity-50"></div>
                        <div className="relative z-10 flex flex-col gap-8">
                            <div className="p-4 bg-indigo-50 rounded-3xl border border-indigo-100 w-fit">
                                <Shield className="w-12 h-12 text-indigo-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Securing the protocol that powers the internet.</h2>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                DNS remains the single largest blind spot in enterprise security. Over 90% of malware uses DNS to establish C2 communication, yet many security stacks fail to inspect the payload properties of individual queries.
                            </p>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                NET-GUARD provides advanced heuristic models that fingerprint tunneling signatures at the packet layer, ensuring zero-day exfiltration attempts are flagged with executive precision.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 hover:border-indigo-300 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                                <Lock className="text-indigo-600 mb-4" />
                                <h4 className="text-slate-900 font-bold mb-2 tracking-tight text-lg">Protocol Hardening</h4>
                                <p className="text-slate-500 text-xs leading-relaxed uppercase tracking-wider font-bold">Inland RFC Enforcement</p>
                            </div>
                            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 hover:border-emerald-300 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                                <Cpu className="text-emerald-600 mb-4" />
                                <h4 className="text-slate-900 font-bold mb-2 tracking-tight text-lg">Inference Engine</h4>
                                <p className="text-slate-500 text-xs leading-relaxed uppercase tracking-wider font-bold">Heuristic Behavioral Scoring</p>
                            </div>
                        </div>
                        <div className="space-y-8 mt-12">
                            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 hover:border-amber-300 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                                <Layers className="text-amber-600 mb-4" />
                                <h4 className="text-slate-900 font-bold mb-2 tracking-tight text-lg">Recursive Bloom</h4>
                                <p className="text-slate-500 text-xs leading-relaxed uppercase tracking-wider font-bold">Multi-Layer Intelligence</p>
                            </div>
                            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 hover:border-rose-300 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                                <Activity className="text-rose-600 mb-4" />
                                <h4 className="text-slate-900 font-bold mb-2 tracking-tight text-lg">Temporal Drift</h4>
                                <p className="text-slate-500 text-xs leading-relaxed uppercase tracking-wider font-bold">Pattern Variance Detection</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Model Intelligence Section */}
                <div id="intelligence" className="mb-48 scroll-mt-24">
                    <header className="mb-16 text-center">
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.4em] block mb-4">Precision Intelligence</span>
                        <h2 className="text-5xl font-bold text-slate-900 tracking-tighter">Executive Detection <span className="text-slate-500">Models</span></h2>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {models.map((model, index) => (
                            <div key={index} className="enterprise-card p-10 rounded-[3rem] text-left group hover:-translate-y-2 transition-all duration-700 bg-white border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                                    <model.icon className="w-7 h-7 text-indigo-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{model.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">{model.desc}</p>
                                <div className="flex items-center gap-2 py-2 border-t border-slate-100">
                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Engine Load: Optimizing</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Workflow Section */}
                <div id="architecture" className="enterprise-card p-16 rounded-[4rem] bg-white border border-slate-200 relative overflow-hidden scroll-mt-24 shadow-xl">
                    <div className="absolute inset-0 bg-indigo-50/30 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                            <div className="max-w-xl">
                                <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">Integration Pipeline. <br /><span className="text-slate-400">How our detection flows.</span></h2>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col justify-between h-32 w-32 shadow-sm">
                                    <span className="text-2xl font-bold text-slate-900">99.8%</span>
                                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest leading-none">Detection Precision</span>
                                </div>
                                <div className="p-4 bg-indigo-600 rounded-2xl flex flex-col justify-between h-32 w-32 shadow-lg shadow-indigo-200">
                                    <span className="text-2xl font-bold text-white">#081</span>
                                    <span className="text-[9px] text-indigo-100 uppercase font-black tracking-widest leading-none">Protocol Suite</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                            {/* Connecting Line (desktop only) - positioned behind the icons */}
                            <div className="absolute top-[32px] left-0 right-0 h-px bg-slate-200 hidden md:block z-0"></div>

                            {steps.map((step, idx) => (
                                <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-8 shadow-sm group-hover:border-indigo-500 group-hover:shadow-md transition-all duration-700 relative z-20">
                                        <span className="text-xl font-black text-indigo-600 font-mono">{step.id}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-indigo-600 mb-4 tracking-tight">{step.title}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed max-w-[240px]">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <footer className="mt-40 border-t border-slate-200 pt-20 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        <ShieldCheck className="w-8 h-8 text-indigo-600" />
                        <span className="font-bold text-slate-900 tracking-[0.2em] text-[10px]">NET-GUARD.OPS</span>
                    </div>
                    <div className="flex gap-10">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors cursor-pointer">Security Policy</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors cursor-pointer">Detection Wiki</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors cursor-pointer">Support API</span>
                    </div>
                    <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        Handcrafted by OPS Intelligence // Deployment v1.2.0
                    </p>
                </footer>
            </main>
        </div>
    );
};

export default LandingPage;
