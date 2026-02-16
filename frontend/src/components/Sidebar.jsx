import React from 'react';
import { LayoutDashboard, FileText, Activity, Settings, Database, ShieldAlert } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onReset }) => {
    const menuItems = [
        { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
        { id: 'analysis', label: 'LEXICAL ANALYSIS', icon: Activity },
        { id: 'incidents', label: 'SECURITY INCIDENTS', icon: ShieldAlert },
        { id: 'traffic', label: 'FULL TRAFFIC', icon: Database },
        { id: 'settings', label: 'CONFIG', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-[#050b14] border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-2xl">
            {/* Brand */}
            <div className="h-14 flex items-center px-4 border-b border-slate-800 bg-[#020617]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                    <span className="font-mono font-bold text-slate-100 tracking-wider text-xs">
                        NET-GUARD<span className="text-blue-500">.OPS</span>
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 space-y-1">
                <div className="px-6 mb-4 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-[0.2em]">Module Selection</div>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-6 py-3 text-[10px] font-mono transition-all group relative
                            ${activeTab === item.id
                                ? 'text-blue-400 bg-blue-500/5'
                                : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900/50'
                            }
                        `}
                    >
                        {activeTab === item.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                        )}
                        <item.icon size={16} className={`mr-4 transition-colors ${activeTab === item.id ? 'text-blue-500' : 'opacity-40 group-hover:opacity-100'}`} />
                        <span className="tracking-widest uppercase">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-slate-800 bg-[#020617]">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Core Status: Stable</span>
                </div>
                <button
                    onClick={onReset}
                    className="w-full py-2 bg-slate-900 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/50 text-slate-400 text-[10px] font-mono uppercase border border-slate-800 transition-all rounded-lg"
                >
                    Reset Dashboard
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
