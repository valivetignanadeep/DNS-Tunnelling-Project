import React, { useState, Component, useEffect, useMemo } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import PacketMonitorSidebar from './components/PacketMonitorSidebar';
import { ShieldCheck, AlertTriangle, RefreshCcw, X, Cpu } from 'lucide-react';

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
  const [isBlocked, setIsBlocked] = useState(false); // Tab block status lock

  // Unique tab identifier to manage Broadcast Channel session locks
  const tabId = useMemo(() => `node-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, []);
  
  // Establish the BroadcastChannel on origin scope
  const syncChannel = useMemo(() => new BroadcastChannel('dns_detector_tab_sync'), []);

  // Multi-tab message broker and session locker hook
  useEffect(() => {
    let isMounted = true;

    // Check if another tab is already active on load
    const activeTabId = localStorage.getItem('dns_active_tab_id');
    const lastHb = parseInt(localStorage.getItem('dns_active_tab_heartbeat') || "0");
    if (activeTabId && activeTabId !== tabId && Date.now() - lastHb < 2500) {
      setIsBlocked(true);
    }

    const handleSyncMessage = (event) => {
      if (!isMounted) return;
      const { type, payload, senderId } = event.data;

      // Ignore our own loopbacks
      if (senderId === tabId) return;

      switch (type) {
        case 'FORCE_LOCK':
          // Another tab has claimed session control, suspend this tab instantly
          setIsBlocked(true);
          break;

        case 'STATE_REQUEST':
          // If we are currently the active unlocked session, respond with our active state
          if (!isBlocked && results) {
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
          if (!isBlocked) {
            setResults(payload.results);
            setView(payload.view);
            setActiveTab(payload.activeTab);
            setDetectionMode(payload.detectionMode);
            setIsMonitorOpen(payload.isMonitorOpen);
            setLiveActive(payload.liveActive);
          }
          break;

        case 'ACTION_NAVIGATE':
          if (!isBlocked) {
            setView(payload.view);
            setActiveTab(payload.activeTab);
          }
          break;

        case 'ACTION_MONITOR_TOGGLE':
          if (!isBlocked) {
            setIsMonitorOpen(payload.isMonitorOpen);
          }
          break;

        case 'ACTION_RESET':
          if (!isBlocked) {
            setResults(null);
            setView('landing');
            setActiveTab('overview');
            setIsUploadOpen(false);
            setDetectionMode('pcap');
            setIsMonitorOpen(false);
          }
          break;
      }
    };

    syncChannel.addEventListener('message', handleSyncMessage);

    // Request active tab state sync upon load
    if (activeTabId && activeTabId !== tabId && Date.now() - lastHb < 2500) {
      // Do not sync if blocked
    } else {
      syncChannel.postMessage({ type: 'STATE_REQUEST', senderId: tabId });
    }

    // Periodic heartbeat to maintain leadership and session locks
    const heartbeatInterval = setInterval(() => {
      if (!isBlocked) {
        localStorage.setItem('dns_active_tab_id', tabId);
        localStorage.setItem('dns_active_tab_heartbeat', Date.now().toString());
      } else {
        // If we are currently blocked, verify if the session-claimed tab is still alive
        const currentActive = localStorage.getItem('dns_active_tab_id');
        const hb = parseInt(localStorage.getItem('dns_active_tab_heartbeat') || "0");
        if ((!currentActive || Date.now() - hb > 2500) && isMounted) {
          // Heartbeat is lost, unlock this tab and claim session control
          setIsBlocked(false);
          localStorage.setItem('dns_active_tab_id', tabId);
          localStorage.setItem('dns_active_tab_heartbeat', Date.now().toString());
        }
      }
    }, 1000);

    return () => {
      isMounted = false;
      syncChannel.removeEventListener('message', handleSyncMessage);
      clearInterval(heartbeatInterval);
    };
  }, [tabId, syncChannel, results, view, activeTab, detectionMode, isMonitorOpen, liveActive, isBlocked]);

  // Synchronize state updates triggered by the active Leader tab
  useEffect(() => {
    if (!isBlocked && results) {
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
  }, [results, view, activeTab, detectionMode, isMonitorOpen, liveActive, tabId, syncChannel, isBlocked]);

  const claimSession = () => {
    setIsBlocked(false);
    localStorage.setItem('dns_active_tab_id', tabId);
    localStorage.setItem('dns_active_tab_heartbeat', Date.now().toString());
    
    // Broadcast FORCE_LOCK to terminate concurrent browser windows
    syncChannel.postMessage({
      type: 'FORCE_LOCK',
      senderId: tabId
    });

    // Prompt active tabs to synchronize state
    syncChannel.postMessage({ type: 'STATE_REQUEST', senderId: tabId });
  };

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
    localStorage.setItem('dns_active_tab_id', tabId); // Claim active lock
    
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
    
    // Clear lock keys
    localStorage.removeItem('dns_active_tab_id');

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

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-6 font-sans text-stone-850 relative select-none">
        {/* Background Grid Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e0d9_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-45 z-0"></div>

        <div className="w-full max-w-md bg-white border border-stone-200/80 p-8 rounded-[2.5rem] shadow-xl text-center flex flex-col items-center gap-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center shadow-sm animate-pulse">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-stone-900 tracking-tighter uppercase">Session Lock Active</h1>
            <p className="text-stone-400 font-mono text-[9px] uppercase tracking-widest leading-none">NET-GUARD.OPS // PROTOCOL_SHIELD</p>
          </div>

          <div className="h-px w-full bg-stone-100"></div>

          <p className="text-stone-600 text-xs font-medium leading-relaxed">
            Security policy restricts NET-GUARD auditing to **a single active browser session** per node to maintain UDP/TCP socket and telemetry stream integrity.
          </p>

          <div className="w-full bg-stone-50 border border-stone-150 rounded-2xl p-4 font-mono text-[9px] text-left text-stone-500 space-y-1.5">
            <div className="flex justify-between">
              <span>STATUS:</span>
              <span className="text-rose-600 font-bold">SESSION_CONFLICT</span>
            </div>
            <div className="flex justify-between">
              <span>ACTIVE SESSION INSTANCE:</span>
              <span className="text-stone-800 font-black truncate max-w-[150px]">{localStorage.getItem('dns_active_tab_id') || 'Unknown Node'}</span>
            </div>
            <div className="flex justify-between">
              <span>POLICIES ENFORCED:</span>
              <span className="text-stone-700 font-bold">SINGLE_SESSION_LOCK (MAX=1)</span>
            </div>
          </div>

          <button
            onClick={claimSession}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest transition-all shadow-[0_4px_12px_rgba(13,148,136,0.25)] active:scale-[0.98]"
          >
            Terminate Other Sessions & Claim Control
          </button>
          
          <p className="text-[9.5px] text-stone-400 font-mono italic mt-1 leading-normal">
            Claiming control will immediately suspend and lock the session in the other browser tab.
          </p>
        </div>
      </div>
    );
  }

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
