import React, { useState, Component } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import PacketMonitorSidebar from './components/PacketMonitorSidebar';
import { ShieldCheck, AlertTriangle, RefreshCcw, X } from 'lucide-react';

// Dynamic API Base URL resolver for Vercel/Local dual-routing
export const getApiUrl = (endpoint) => {
  const base = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000'
    : '';
  return `${base}${endpoint}`;
};

// Robust Error Boundary to prevent white screen and show debug info
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Crash Captured:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8f6f2] flex flex-col items-center justify-center p-8 text-center font-mono">
          <div className="w-20 h-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-8 border border-rose-500/20">
            <AlertTriangle className="w-10 h-10 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">CRITICAL_SYSTEM_ERROR</h1>
          <p className="text-slate-500 max-w-md mb-8 text-sm">
            The application encountered a runtime exception during component rendering.
            Diagnostic data has been logged to the system terminal.
          </p>
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-6 mb-8 text-left overflow-auto max-h-[300px]">
            <p className="text-rose-600 font-bold mb-2">ERROR_STACK:</p>
            <pre className="text-[10px] text-slate-500 whitespace-pre-wrap leading-relaxed">
              {this.state.error?.stack || this.state.error?.message}
            </pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-bold text-sm"
          >
            <RefreshCcw size={16} />
            RESTORE SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard'
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [detectionMode, setDetectionMode] = useState('pcap'); // 'pcap' | 'live'
  const [isMonitorOpen, setIsMonitorOpen] = useState(false);
  const [liveActive, setLiveActive] = useState(true); // Single source of truth for live sniffer stream

  const handleAnalysisComplete = (data) => {
    if (data && typeof data === 'object') {
      setDetectionMode('pcap');
      setResults(data);
      setIsUploadOpen(false);
      setView('dashboard');
    } else {
      console.error("Invalid analysis data received:", data);
    }
  };

  const handleToggleLive = async (nextState) => {
    setLiveActive(nextState);
    try {
      await fetch(getApiUrl(`/api/live/${nextState ? 'start' : 'stop'}`), { method: 'POST' });
    } catch (err) {
      console.error("Failed to toggle live capture sniffer:", err);
    }
  };

  const handleStartLive = async () => {
    setDetectionMode('live');
    setLiveActive(true); // Always start in active sniffer state
    setResults({
      totalQueries: 0,
      suspicious: 0,
      threats: 0,
      pps: 0.0,
      totalBytes: 0,
      activeClientIPs: 0,
      adapterName: "Initializing...",
      volumeTrend: [{"time": "00:00:00", "traffic": 0}],
      results: [],
      allQueries: [],
      logs: ["Initializing live sniffer interface..."],
      distribution: { critical: 0, high: 0, medium: 0 }
    });
    setView('dashboard');
    
    try {
      await fetch(getApiUrl('/api/live/start'), { method: 'POST' });
    } catch (err) {
      console.error("Failed to trigger live capture:", err);
    }
  };

  const handleReset = async () => {
    if (detectionMode === 'live') {
      try {
        await fetch(getApiUrl('/api/live/stop'), { method: 'POST' });
      } catch (err) {
        console.error("Failed to cease live capture:", err);
      }
    }
    setResults(null);
    setView('landing');
    setActiveTab('overview');
    setIsUploadOpen(false);
    setDetectionMode('pcap');
    setIsMonitorOpen(false);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-warm-bg font-sans text-slate-800 relative">
        {view === 'dashboard' ? (
          <>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onReset={handleReset}
              detectionMode={detectionMode}
              setDetectionMode={setDetectionMode}
              liveActive={liveActive}
              onToggleLive={handleToggleLive}
            />
            <Dashboard 
              results={results} 
              setResults={setResults}
              activeTab={activeTab} 
              detectionMode={detectionMode}
              isMonitorOpen={isMonitorOpen}
              setIsMonitorOpen={setIsMonitorOpen}
              liveActive={liveActive}
            />
            <PacketMonitorSidebar
              isOpen={isMonitorOpen}
              onClose={() => setIsMonitorOpen(false)}
              liveData={results}
              liveActive={liveActive}
              onToggleLive={handleToggleLive}
            />
          </>
        ) : (
          <LandingPage onStartUpload={() => setIsUploadOpen(true)} onStartLive={handleStartLive} />
        )}

        {/* Upload Modal */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsUploadOpen(false)}></div>

            <div className="w-full max-w-2xl z-10 relative animate-in slide-in-from-bottom-8 duration-500">
              <div className="human-card p-2 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(13,148,136,0.15)]">
                <div className="bg-white rounded-[2.25rem] p-8 border border-slate-100 relative">
                  <button
                    onClick={() => setIsUploadOpen(false)}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 transition-colors hover:bg-slate-50 rounded-lg"
                  >
                    <X size={20} />
                  </button>

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-950 tracking-tight mb-2">Initialize Detection Audit</h3>
                    <p className="text-slate-500 text-sm font-medium">Upload network logs (.pcap, .csv) for heuristic intelligence processing.</p>
                  </div>

                  <FileUpload onAnalysisComplete={handleAnalysisComplete} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
