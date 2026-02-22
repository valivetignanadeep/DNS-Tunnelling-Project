import React, { useState, Component } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import { ShieldCheck, AlertTriangle, RefreshCcw, X } from 'lucide-react';

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
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard'
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleAnalysisComplete = (data) => {
    // Ensure we have a valid object and results array before proceeding
    if (data && typeof data === 'object') {
      setResults(data);
      setIsUploadOpen(false);
      setView('dashboard');
    } else {
      console.error("Invalid analysis data received:", data);
    }
  };

  const handleReset = () => {
    setResults(null);
    setView('landing');
    setActiveTab('overview');
    setIsUploadOpen(false);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#020617] font-sans text-slate-200">
        {view === 'dashboard' ? (
          <>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onReset={handleReset}
            />
            <Dashboard results={results} activeTab={activeTab} />
          </>
        ) : (
          <LandingPage onStartUpload={() => setIsUploadOpen(true)} />
        )}

        {/* Upload Modal */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" onClick={() => setIsUploadOpen(false)}></div>

            <div className="w-full max-w-2xl z-10 relative animate-in slide-in-from-bottom-8 duration-500">
              <div className="enterprise-card p-2 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(37,99,235,0.2)]">
                <div className="bg-[#020617] rounded-[2.25rem] p-8 border border-slate-800/50 relative">
                  <button
                    onClick={() => setIsUploadOpen(false)}
                    className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Initialize Detection Audit</h3>
                    <p className="text-slate-400 text-sm">Upload network logs (.pcap, .csv) for heuristic intelligence processing.</p>
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
