import React, { useState, Component } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import { ShieldCheck, AlertTriangle, RefreshCcw } from 'lucide-react';

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
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 text-center font-mono">
          <div className="w-20 h-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-8 border border-rose-500/20">
            <AlertTriangle className="w-10 h-10 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">CRITICAL_SYSTEM_ERROR</h1>
          <p className="text-slate-400 max-w-md mb-8 text-sm">
            The application encountered a runtime exception during component rendering.
            Diagnostic data has been logged to the system terminal.
          </p>
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 text-left overflow-auto max-h-[300px]">
            <p className="text-rose-400 font-bold mb-2">ERROR_STACK:</p>
            <pre className="text-[10px] text-slate-500 whitespace-pre-wrap leading-relaxed">
              {this.state.error?.stack || this.state.error?.message}
            </pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-bold text-sm"
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
  const [view, setView] = useState('upload'); // 'upload' | 'dashboard'
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleAnalysisComplete = (data) => {
    // Ensure we have a valid object and results array before proceeding
    if (data && typeof data === 'object') {
      setResults(data);
      setView('dashboard');
    } else {
      console.error("Invalid analysis data received:", data);
    }
  };

  const handleReset = () => {
    setResults(null);
    setView('upload');
    setActiveTab('overview');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#020617] font-sans text-slate-200">
        {view === 'dashboard' && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onReset={handleReset}
          />
        )}

        {view === 'upload' ? (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 pointer-events-none"></div>

            <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-1000 relative z-10">
              <div className="inline-flex items-center justify-center p-5 bg-blue-600/10 rounded-2xl mb-8 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.15)]">
                <ShieldCheck className="w-14 h-14 text-blue-500" />
              </div>
              <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tighter">
                DNS Tunnelling Detection<span className="text-blue-500"> of Packets</span>
              </h1>
              <p className="text-slate-400 max-w-md mx-auto text-lg font-medium leading-relaxed">
              DNS Tunneling Detection for Covert Data Exfiltration

              </p>
            </div>

            <div className="w-full max-w-xl z-10 p-1 bg-gradient-to-b from-slate-700/50 to-slate-800/50 rounded-2xl shadow-2xl border border-slate-700/30">
              <FileUpload onAnalysisComplete={handleAnalysisComplete} />
            </div>

            <div className="mt-10 flex flex-col items-center gap-2 text-center opacity-40">
              <p className="text-xs text-slate-500 uppercase tracking-[0.4em] font-bold">
                Secure Environment • Log Analysis Active
              </p>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
            </div>
          </div>
        ) : (
          <Dashboard results={results} activeTab={activeTab} />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
