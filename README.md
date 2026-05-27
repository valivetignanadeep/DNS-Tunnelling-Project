# 🛡️ NET-GUARD.OPS // DNS Tunneling Detection Suite

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-emerald?style=for-the-badge&logo=vercel&logoColor=white)](https://dns-tunnelling-project.vercel.app/)
[![React 18](https://img.shields.io/badge/React-18-teal?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Flask API](https://img.shields.io/badge/Flask-3.0-stone?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Security Scapy](https://img.shields.io/badge/Security-Scapy%20Sniffer-rose?style=for-the-badge&logo=wireshark&logoColor=white)](https://scapy.net/)

> **Live Deployment Link**: 🔗 [dns-tunnelling-project.vercel.app](https://dns-tunnelling-project.vercel.app/)

---

## 👁️ Core Vision

Standard security gateways frequently allow DNS recursion to pass unrestricted, making the protocol a prime target for stealth command-and-control (C2) channels and data exfiltration. **NET-GUARD.OPS** is an enterprise-grade DNS Tunneling Detection suite designed to parse, classify, and isolate dynamic threat profiles hidden inside standard recursive queries.

By combining **Shannon Entropy scoring**, **subdomain character density filters**, and **query type structural weighting (QTYPE)**, the platform analyzes active protocols in real-time, providing network operators with immediate visibility and defensive protocols to mitigate stealth attacks under the radar.

---

## 📊 Heuristic 5-Tier DNS Classification Matrix

DNS requests are parsed on-the-fly and assigned a granular security level based on mathematical randomness ($H(x)$), record types, and bytes:

```
 CLEAN            LOW RISK          SUSPICIOUS         HIGH RISK          CRITICAL
   |                  |                  |                 |                 |
 Entropy < 2.8   Entropy 2.8-3.5    CNAME / TXT        Entropy 4.2-4.8    Entropy > 4.8 /
  google.com     Dynamic DNS/CDNs   Subdomain scans    C2 heartbeats      Large TXT exfil
```

*   🟢 **`CLEAN` (Legitimate)**: Standard hostnames with low entropy and normal payload sizes.
*   🔵 **`LOW RISK` (CDNs/Dynamic)**: CDNs, dynamic trackers, and standard web queries with slightly elevated randomness.
*   🟡 **`SUSPICIOUS` (Telemetry/Recon)**: Subdomains with elevated character lengths indicating telemetry tracking or network scanning probes.
*   🟠 **`HIGH RISK` (C2 Beaconing)**: Cyclical entropy profiles (4.2 - 4.8) matching Cobalt Strike command-and-control heartbeats.
*   🔴 **`CRITICAL` (Exfiltration)**: Long payloads, very high entropy ($H(x) \ge 4.8$), or oversized `TXT` records carrying encoded binary files out of the network.

---

## 🖥️ Live Scrolling CLI Packet Console

To provide high-fidelity security operations, we built a **Live Packet Console** sliding sidebar:

*   **Autoscroll CLI**: Prints incoming queries chronologically at the bottom like a physical `tcpdump` or `tshark` stream.
*   **Buffer Controls**: Features a Play/Pause button to halt the global sniffer/simulator stream instantly and a Clear button to empty the CLI viewport.
*   **Triage Filters**: Instant pillbox filters allow operators to filter the scrolling feed by specific categories (e.g. show only *Suspicious* or *Critical* packets).
*   **Technical Format**:
    `[12:35:48] 192.168.1.42 > DNS: [TXT] exfil.tunnel.xyz (148B) | [CRITICAL] H=5.21`

---

## ⚡ Tech Stack & Aesthetics

*   **Frontend**: React 18, Vite 5, Recharts, Lucide Icons, and custom CSS.
*   **Design Language**: Custom **Sandstone light theme** featuring humanized warm backgrounds (`#fdfbf7`), sharp teal brand colors (`#0d9488`), and rich borders.
*   **Backend**: Python Flask 3, Scapy packet analyzer, pandas, numpy, and shannon-entropy calculations.

---

## 🚀 Local Installation & Run Guide

### Prerequisites
*   [Python 3.9+](https://www.python.org/downloads/)
*   [Node.js 18+](https://nodejs.org/)
*   **For Raw Packet Capture**: Install [Npcap](https://npcap.com/) (Windows) or `libpcap` (macOS/Linux).



## 📂 Codebase Navigation

*   [`frontend/src/App.jsx`](./frontend/src/App.jsx): Holds the global state including the unified play/pause stream state (`liveActive`).
*   [`frontend/src/components/PacketMonitorSidebar.jsx`](./frontend/src/components/PacketMonitorSidebar.jsx): Holds the terminal CLI scrolling packet console panel and filters.
*   [`frontend/src/components/Dashboard.jsx`](./frontend/src/components/Dashboard.jsx): Hosts the primary high-fidelity DNS sniffer simulator hook.
*   [`backend/live_sniffer.py`](./backend/live_sniffer.py): Holds the Scapy udp/tcp raw socket interface and local loopback simulator.
*   [`backend/analyzer.py`](./backend/analyzer.py): Runs static PCAP analysis algorithms utilizing pandas dataframes.
