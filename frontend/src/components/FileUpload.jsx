import React, { useState } from "react";
import axios from "axios";
import { Upload, FileText, AlertCircle, Loader2, Sparkles } from "lucide-react";

// Helper to get API base
const getApiUrl = (endpoint) => {
  const base = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000'
    : '';
  return `${base}${endpoint}`;
};

const FileUpload = ({ onAnalysisComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(getApiUrl("/api/upload"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // The backend returns the full analysis object
      onAnalysisComplete(response.data);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.error || "Error connecting to the backend server. You can run in Demo Mode below."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadDemoData = () => {
    // High-fidelity pre-compiled detection report for offline use (e.g. on Vercel public demo)
    const demoData = {
      totalQueries: 486,
      suspicious: 14,
      threats: 3,
      totalBytes: 38592,
      activeClientIPs: 4,
      adapterName: "Offline-Demo-Node",
      distribution: {
        critical: 3,
        high: 7,
        medium: 4
      },
      volumeTrend: [
        { time: "10:00:00", traffic: 24 },
        { time: "10:15:00", traffic: 48 },
        { time: "10:30:00", traffic: 92 },
        { time: "10:45:00", traffic: 120 },
        { time: "11:00:00", traffic: 154 },
        { time: "11:15:00", traffic: 48 }
      ],
      results: [
        {
          timestamp: 1774586400,
          src_ip: "192.168.1.105",
          domain: "v1.exfil.data.081bc7e4f8a.tunnel.net",
          risk_score: 95,
          reasons: "High Entropy, Unusual Length",
          entropy: 5.76,
          length: 42,
          frequency: 18,
          threat_type: "DNS Tunneling (Exfiltration)"
        },
        {
          timestamp: 1774586415,
          src_ip: "192.168.1.105",
          domain: "a3f9e8b2c1d9.c2server.attacker.com",
          risk_score: 88,
          reasons: "High Entropy",
          entropy: 5.12,
          length: 36,
          frequency: 24,
          threat_type: "C2 Communication Channel"
        },
        {
          timestamp: 1774586430,
          src_ip: "192.168.1.112",
          domain: "dns-auth.99283f982bc71.hack-tunnel.xyz",
          risk_score: 82,
          reasons: "Unusual Length, High Frequency",
          entropy: 4.88,
          length: 38,
          frequency: 112,
          threat_type: "Data Exfiltration Pipeline"
        },
        {
          timestamp: 1774586445,
          src_ip: "192.168.1.42",
          domain: "w9a8s7d6f5g4.command.cnc-hub.biz",
          risk_score: 65,
          reasons: "High Entropy",
          entropy: 4.62,
          length: 32,
          frequency: 54,
          threat_type: "Malicious Beaconing"
        }
      ],
      allQueries: [
        { timestamp: 1774586400, src_ip: "192.168.1.105", query: "v1.exfil.data.081bc7e4f8a.tunnel.net", qtype: "16", size: 124, entropy: 5.76 },
        { timestamp: 1774586402, src_ip: "192.168.1.101", query: "google.com", qtype: "1", size: 54, entropy: 2.12 },
        { timestamp: 1774586405, src_ip: "192.168.1.105", query: "a3f9e8b2c1d9.c2server.attacker.com", qtype: "1", size: 88, entropy: 5.12 },
        { timestamp: 1774586407, src_ip: "192.168.1.12", query: "github.com", qtype: "28", size: 62, entropy: 2.65 },
        { timestamp: 1774586410, src_ip: "192.168.1.42", query: "vercel.app", qtype: "1", size: 58, entropy: 2.84 },
        { timestamp: 1774586412, src_ip: "192.168.1.101", query: "fonts.googleapis.com", qtype: "1", size: 76, entropy: 3.12 },
        { timestamp: 1774586415, src_ip: "192.168.1.112", query: "dns-auth.99283f982bc71.hack-tunnel.xyz", qtype: "16", size: 142, entropy: 4.88 },
        { timestamp: 1774586418, src_ip: "192.168.1.42", query: "w9a8s7d6f5g4.command.cnc-hub.biz", qtype: "1", size: 94, entropy: 4.62 },
        { timestamp: 1774586420, src_ip: "192.168.1.101", query: "reddit.com", qtype: "1", size: 52, entropy: 2.34 },
        { timestamp: 1774586422, src_ip: "192.168.1.105", query: "aws.amazon.com", qtype: "1", size: 68, entropy: 2.76 }
      ],
      logs: [
        "[✓] Loaded offline demonstration audit sequence",
        "[✓] Lexical analyzer initialized: 486 DNS frames processed",
        "[✓] Applied character-frequency entropy mapping",
        "[ALERT] High entropy TXT record query flagged from 192.168.1.105",
        "[ALERT] Beaconing tunnel footprint detected at w9a8s7d6f5g4.command.cnc-hub.biz",
        "[✓] Baseline normalization complete"
      ]
    };
    onAnalysisComplete(demoData);
  };

  return (
    <div className="p-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 hover:bg-white hover:border-teal-300 transition-all group shadow-sm">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFile}
        disabled={isUploading}
      />

      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center gap-6 w-full"
      >
        <div className="p-6 bg-teal-50 rounded-2xl group-hover:bg-teal-100 transition-all shadow-inner">
          {isUploading ? (
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-teal-600" />
          )}
        </div>

        <div className="text-center">
          <p className="text-slate-900 font-bold text-xl tracking-tight">
            {isUploading ? "Detection Analysis in Progress..." : "Upload Intelligence Payload"}
          </p>
          <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">
            Support for .pcap, .pcapng files
          </p>
        </div>
      </label>

      {error && (
        <div className="mt-6 w-full flex flex-col gap-4">
          <div className="flex items-center gap-3 text-rose-700 text-xs bg-rose-50 p-4 rounded-xl border border-rose-100 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>

          <button
            onClick={handleLoadDemoData}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100/60 rounded-xl transition-all font-bold text-[11px] uppercase tracking-wider"
          >
            <Sparkles size={13} className="animate-pulse" />
            Simulate Demo Audit Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
