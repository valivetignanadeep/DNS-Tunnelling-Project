import React from 'react';
import { LayoutDashboard, FileText, Activity, Settings, Database, ShieldAlert, BookOpen, Info, BrainCircuit } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onReset }) => {
    const menuItems = [
        { id: 'overview', label: 'Security Overview', icon: LayoutDashboard },
        { id: 'analysis', label: 'Lexical Analysis', icon: Activity },
        { id: 'entropy', label: 'Entropy Matrix', icon: BrainCircuit },
        { id: 'incidents', label: 'Threat Intelligence', icon: ShieldAlert },
        { id: 'traffic', label: 'Network Inspector', icon: Database },
        { id: 'docs', label: 'Engine Documentation', icon: BookOpen },
    ];

    return (
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
            {/* Enterprise Brand Header */}
            <div className="h-20 flex items-center px-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg transform rotate-3 shadow-[0_4px_8px_rgba(67,56,202,0.2)]"></div>
                        <div className="absolute inset-0 w-8 h-8 border border-white/40 rounded-lg -rotate-3 transition-transform group-hover:rotate-0"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 tracking-widest text-[11px] leading-tight">
                            NET-GUARD<span className="text-indigo-600">.OPS</span>
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase font-medium">Executive Security Hub</span>
                    </div>
                </div>
            </div>

            {/* Navigation Modules */}
            <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="px-3 mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Deployment Tier</span>
                    <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] border border-indigo-100 rounded uppercase font-bold">Pro</span>
                </div>

                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group
                            ${activeTab === item.id
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm'
                                : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50/80'
                            }
                        `}
                    >
                        <item.icon size={18} className={`mr-4 transition-all duration-300 ${activeTab === item.id ? 'text-indigo-600' : 'opacity-50 group-hover:opacity-100'}`} />
                        <span className="text-[11px] font-semibold tracking-wide">{item.label}</span>
                        {activeTab === item.id && (
                            <div className="ml-auto w-1 h-1 bg-indigo-600 rounded-full shadow-[0_0_6px_rgba(79,70,229,0.5)]"></div>
                        )}
                    </button>
                ))}
            </nav>

            {/* System Status & Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/30 backdrop-blur-sm">
                <div className="glass-card rounded-xl p-4 mb-4 border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-1.5 bg-emerald-50 rounded-lg">
                            <Info size={12} className="text-emerald-600" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">System Pulse</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-[9px] text-slate-400 font-mono uppercase">Node Primary</span>
                        <span className="text-[9px] text-emerald-600 font-bold font-mono">STABLE | v1.2.0</span>
                    </div>
                    <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-emerald-600/80"></div>
                    </div>
                </div>

                <button
                    onClick={onReset}
                    className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest border border-red-100 transition-all rounded-xl shadow-sm"
                >
                    Clear Analytics Session
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
