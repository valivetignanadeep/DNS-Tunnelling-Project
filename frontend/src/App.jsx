import React, { useState, Component, useEffect, useMemo } from 'react';
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

  // Unique tab identifier to manage Broadcast Channel leadership election
  const tabId = useMemo(() => Math.random().toString(36).substring(2, 11), []);
  
  // Establish the BroadcastChannel on origin scope
  const syncChannel = useMemo(() => new BroadcastChannel('dns_detector_tab_sync'), []);

  // Multi-tab message broker hook
  useEffect(() => {
    let isMounted = true;

    const handleSyncMessage = (event) => {
      if (!isMounted) return;
      const { type, payload, senderId } = event.data;

      // Ignore our own loopbacks
      if (senderId === tabId) return;

      switch (type) {
        case 'STATE_REQUEST':
          // If we are currently running a session, respond with our active state
          const isLeader = localStorage.getItem('dns_leader_tab') === tabId;
          if (isLeader || results) {
            syncChannel.postMessage({
              type: 'STATE_RESPONSE',
              senderId: tabId,
              payload: {
                view,
                results,
                activeTab,
                detectionMode,
                isMonitorOpen,
                liveActive
              }
            });
          }
          break;

        case 'STATE_RESPONSE':
          // Elect the responder as the leader tab
          localStorage.setItem('dns_leader_tab', senderId);
          localStorage.setItem('dns_leader_heartbeat', Date.now().toString());
          // Sync state values
          setResults(payload.results);
          setView(payload.view);
          setActiveTab(payload.activeTab);
          setDetectionMode(payload.detectionMode);
          setIsMonitorOpen(payload.isMonitorOpen);
          setLiveActive(payload.liveActive);
          break;

        case 'STATE_UPDATE':
          // Dynamically synchronize live metrics, logs, trend charts, and state
          setResults(payload.results);
          setView(payload.view);
          setActiveTab(payload.activeTab);
          setDetectionMode(payload.detectionMode);
          setIsMonitorOpen(payload.isMonitorOpen);
          setLiveActive(payload.liveActive);
          break;

        case 'ACTION_NAVIGATE':
          // Sync navigation tabs
          setView(payload.view);
          setActiveTab(payload.activeTab);
          break;

        case 'ACTION_MONITOR_TOGGLE':
          // Sync monitor sidebar visibility
          setIsMonitorOpen(payload.isMonitorOpen);
          break;

        case 'ACTION_RESET':
          // Sync session resets
          setResults(null);
          setView('landing');
          setActiveTab('overview');
          setIsUploadOpen(false);
          setDetectionMode('pcap');
          setIsMonitorOpen(false);
          break;
      }
    };

    syncChannel.addEventListener('message', handleSyncMessage);

    // Prompt active tabs to synchronize state upon load
    syncChannel.postMessage({ type: 'STATE_REQUEST', senderId: tabId });

    // Periodic heartbeat to maintain leadership registry
    const heartbeatInterval = setInterval(() => {
      const currentLeader = localStorage.getItem('dns_leader_tab');
      if (currentLeader === tabId || !currentLeader) {
        localStorage.setItem('dns_leader_tab', tabId);
        localStorage.setItem('dns_leader_heartbeat', Date.now().toString());
      } else {
        // If leader heartbeat is lost (older than 2.5 seconds), assume leadership
        const hb = parseInt(localStorage.getItem('dns_leader_heartbeat') || "0");
        if (Date.now() - hb > 2500) {
          localStorage.setItem('dns_leader_tab', tabId);
          localStorage.setItem('dns_leader_heartbeat', Date.now().toString());
        }
      }
    }, 1000);

    return () => {
      isMounted = false;
      syncChannel.removeEventListener('message', handleSyncMessage);
      clearInterval(heartbeatInterval);
    };
  }, [tabId, syncChannel, results, view, activeTab, detectionMode, isMonitorOpen, liveActive]);

  // Synchronize state updates triggered by the active Leader tab
  useEffect(() => {
    const isLeader = localStorage.getItem('dns_leader_tab') === tabId;
    if (isLeader && results) {
      syncChannel.postMessage({
        type: 'STATE_UPDATE',
        senderId: tabId,
        payload: {
          results,
          view,
          activeTab,
          detectionMode,
          isMonitorOpen,
          liveActive
        }
      });
    }
  }, [results, view, activeTab, detectionMode, isMonitorOpen, liveActive, tabId, syncChannel]);

  const handleAnalysisComplete = (data) => {
    if (data && typeof data === 'object') {
      setDetectionMode('pcap');
      setResults(data);
      setIsUploadOpen(false);
      setView('dashboard');
      
      // Broadcast static analysis payload
      syncChannel.postMessage({
        type: 'STATE_UPDATE',
        senderId: tabId,
        payload: {
          results: data,
          view: 'dashboard',
          activeTab: 'overview',
          detectionMode: 'pcap',
          isMonitorOpen: false,
          liveActive: true
        }
      });
    } else {
      console.error("Invalid analysis data received:", data);
    }
  };

  const handleToggleLive = async (nextState) => {
    setLiveActive(nextState);
    
    // Broadcast live active state toggle
    syncChannel.postMessage({
      type: 'STATE_UPDATE',
      senderId: tabId,
      payload: {
        results,
        view,
        activeTab,
        detectionMode,
        isMonitorOpen,
        liveActive: nextState
      }
    });

    try {
      await fetch(getApiUrl(`/api/live/${nextState ? 'start' : 'stop'}`), { method: 'POST' });
    } catch (err) {
      console.error("Failed to toggle live capture sniffer:", err);
    }
  };

  const handleStartLive = async () => {
    setDetectionMode('live');
    setLiveActive(true); // Always start in active sniffer state
    localStorage.setItem('dns_leader_tab', tabId); // Claim leadership
    
    const initialLiveState = {
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
    };

    setResults(initialLiveState);
    setView('dashboard');
    
    // Broadcast capture start event
    syncChannel.postMessage({
      type: 'STATE_UPDATE',
      senderId: tabId,
      payload: {
        results: initialLiveState,
        view: 'dashboard',
        activeTab: 'overview',
        detectionMode: 'live',
        isMonitorOpen: false,
        liveActive: true
      }
    });

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
    
    // Clear local states
    setResults(null);
    setView('landing');
    setActiveTab('overview');
    setIsUploadOpen(false);
    setDetectionMode('pcap');
    setIsMonitorOpen(false);
    
    // Clear leadership key
    localStorage.removeItem('dns_leader_tab');

    // Broadcast reset action to all open windows
    syncChannel.postMessage({
      type: 'ACTION_RESET',
      senderId: tabId
    });
  };

  const handleSetActiveTabSync = (newTab) => {
    setActiveTab(newTab);
    
    // Broadcast navigation click
    syncChannel.postMessage({
      type: 'ACTION_NAVIGATE',
      senderId: tabId,
      payload: { view, activeTab: newTab }
    });
  };

  const handleSetMonitorOpenSync = (isOpen) => {
    setIsMonitorOpen(isOpen);
    
    // Broadcast sidebar toggle
    syncChannel.postMessage({
      type: 'ACTION_MONITOR_TOGGLE',
      senderId: tabId,
      payload: { isMonitorOpen: isOpen }
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-warm-bg font-sans text-slate-800 relative">
        {view === 'dashboard' ? (
          <>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={handleSetActiveTabSync}
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
              setIsMonitorOpen={handleSetMonitorOpenSync}
              liveActive={liveActive}
            />
            <PacketMonitorSidebar
              isOpen={isMonitorOpen}
              onClose={() => handleSetMonitorOpenSync(false)}
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
