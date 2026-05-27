import threading
import time
import math
from collections import Counter
import random

try:
    from scapy.all import sniff, DNS, DNSQR, IP
    SCAPY_AVAILABLE = True
except Exception as e:
    SCAPY_AVAILABLE = False

class LiveSniffer:
    def __init__(self):
        self.active = False
        self.thread = None
        self.lock = threading.Lock()
        
        # Telemetry databases
        self.all_queries = []
        self.anomalies = []
        self.logs = []
        self.total_queries = 0
        self.suspicious_count = 0
        self.threats_count = 0
        
        # Statistics
        self.total_bytes = 0
        self.start_time = None
        self.pps = 0  # Packets per second
        self.active_client_ips = set()
        
        # Adapter status
        self.adapter_name = "Simulation Engine" if not SCAPY_AVAILABLE else "Raw Socket Interface"
        
        # Threat Intelligence Explainer Dictionary
        self.threat_intel = {
            "Cobalt Strike DNS Beaconing": {
                "desc": "Suspicious cyclical hostname structure commonly used by Cobalt Strike C2 beacons to retrieve instructions or post small system updates.",
                "harm": "Enables persistent stealth access, allowing threat actors to execute remote commands, pivot through network nodes, and initiate payload distribution without opening TCP/UDP ports.",
                "mitigation": "Configure active firewall sinkholing for the parent domain, block the source client IP from local network switches, and deploy host-level endpoint detection (EDR)."
            },
            "Iodine DNS Tunneling Payload": {
                "desc": "Extremely high entropy payload structure characteristic of Iodine/DNScat2 protocol exfiltration channels.",
                "harm": "Bypasses perimeter enterprise firewalls and network access controls by encapsulating raw IPv4/IPv6 traffic inside normal-looking recursive DNS queries.",
                "mitigation": "Enforce strict DNS query length restrictions (e.g. limit hostnames to 60 characters) and establish automated recursive query rate limits on the internal DNS gateway."
            },
            "Data Exfiltration (Base64/Hex)": {
                "desc": "High entropy, long length subdomain structured to transmit encrypted binary payloads via DNS queries.",
                "harm": "Leaks critical databases, proprietary codebase intellectual property, or Active Directory system secrets chunk-by-chunk under the radar of standard security log audits.",
                "mitigation": "Isolate the client workstation immediately. Flush DNS caches across local subnet and implement inspection of TXT, CNAME, and NULL records."
            },
            "Subdomain Reconnaissance Probe": {
                "desc": "Rapid burst of unique high-entropy subdomains pointing to a single domain name, suggesting malicious discovery scanning.",
                "harm": "Allows threat actors to map active recursive resolvers, bypass firewall cache entries, and identify open internal endpoints without making direct contact.",
                "mitigation": "Enable response rate limiting (RRL) on authoritative name servers and block source IP address from making recursive queries."
            }
        }

    def calculate_entropy(self, s):
        if not s:
            return 0.0
        p, lns = Counter(s), float(len(s))
        return -sum( count/lns * math.log(count/lns, 2) for count in p.values())

    def add_log(self, message):
        timestamp = time.strftime('%H:%M:%S')
        log_line = f"[{timestamp}] {message}"
        with self.lock:
            self.logs.append(log_line)
            # Cap logs list to prevent memory bloat
            if len(self.logs) > 200:
                self.logs.pop(0)

    def process_live_packet(self, query_name, src_ip, size, timestamp=None):
        if not timestamp:
            timestamp = time.time()
            
        domain = query_name
        subdomain = domain.split('.')[0]
        length = len(subdomain)
        entropy = self.calculate_entropy(subdomain)
        
        # Risk heuristics
        is_suspicious_length = length > 45
        is_suspicious_entropy = entropy > 4.2
        
        risk_score = 0
        reasons = []
        threat_type = None
        
        if is_suspicious_length:
            risk_score += 40
            reasons.append("Unusual Length")
        if is_suspicious_entropy:
            risk_score += 40
            reasons.append("High Entropy")
            
        # Classify threat type based on heuristics
        if risk_score >= 80:
            if entropy > 4.7 and length > 50:
                threat_type = "Iodine DNS Tunneling Payload"
            elif entropy > 4.4:
                threat_type = "Data Exfiltration (Base64/Hex)"
            else:
                threat_type = "Cobalt Strike DNS Beaconing"
        elif risk_score >= 40:
            threat_type = "Subdomain Reconnaissance Probe"
            
        qtype_sim = '1' if random.random() > 0.3 else '28'
        
        # Consistent 5-tier classification logic
        if entropy >= 4.8 or (entropy >= 4.2 and qtype_sim == '16' and size > 110):
            classification = "CRITICAL"
        elif entropy >= 4.2:
            classification = "HIGH RISK"
        elif entropy >= 3.5:
            classification = "SUSPICIOUS"
        elif entropy >= 2.8:
            classification = "LOW RISK"
        else:
            classification = "CLEAN"
            
        is_anomaly = risk_score > 0

        
        query_entry = {
            'timestamp': float(timestamp),
            'src_ip': src_ip,
            'domain': domain,
            'query': domain,
            'qtype': qtype_sim,
            'size': int(size),
            'entropy': round(entropy, 2),
            'classification': classification,
            'is_anomaly': is_anomaly,
            'risk_score': risk_score
        }
        
        with self.lock:
            self.all_queries.append(query_entry)
            self.total_queries += 1
            self.total_bytes += size
            self.active_client_ips.add(src_ip)
            
            # Keep historical list capped at 500 for UI performance
            if len(self.all_queries) > 500:
                self.all_queries.pop(0)
                
            if is_anomaly:
                self.suspicious_count += 1
                
                # Check if threat is confirmed (high risk)
                if risk_score >= 80:
                    self.threats_count += 1
                
                intel = self.threat_intel.get(threat_type, {
                    "desc": "Potential behavioral anomaly bypassing network baselines.",
                    "harm": "Violates corporate protocol standards and represents a structural data threat.",
                    "mitigation": "Monitor device traffic, run threat audits, and secure gateway rules."
                })
                
                anomaly_entry = {
                    'timestamp': float(timestamp),
                    'src_ip': src_ip,
                    'domain': domain,
                    'risk_score': risk_score,
                    'reasons': ", ".join(reasons),
                    'entropy': round(entropy, 2),
                    'length': length,
                    'frequency': random.randint(5, 45) if risk_score < 80 else random.randint(120, 850),
                    'threat_type': threat_type or "Unknown Anomaly",
                    'description': intel['desc'],
                    'harm_explanation': intel['harm'],
                    'mitigation_protocol': intel['mitigation']
                }
                
                self.anomalies.append(anomaly_entry)
                if len(self.anomalies) > 200:
                    self.anomalies.pop(0)
                    
        # Log active alerts
        if is_anomaly:
            log_msg = f"⚠️ [ALERT] Flagged {src_ip} -> {domain} | Risk: {risk_score}% | Reason: {', '.join(reasons)}"
            self.add_log(log_msg)
        else:
            log_msg = f"✓ Parsed packet from {src_ip} for {domain} | Entropy: {round(entropy,2)}"
            self.add_log(log_msg)

    def run_scapy_sniff(self):
        self.add_log("Starting Scapy raw socket listener...")
        self.add_log("Listening on all adapters [Filter: udp port 53 or tcp port 53]...")
        
        def scapy_callback(packet):
            if not self.active:
                return True # Stops Scapy sniffer
            try:
                if packet.haslayer(DNS) and packet.haslayer(DNSQR):
                    dns_layer = packet.getlayer(DNS)
                    query_name = dns_layer.qd.qname.decode('utf-8', errors='ignore').rstrip('.')
                    src_ip = packet[0][1].src if packet.haslayer(IP) else '127.0.0.1'
                    size = len(packet)
                    self.process_live_packet(query_name, src_ip, size)
            except Exception as e:
                # Catch any parsing error and log silently
                pass

        try:
            sniff(filter="udp port 53 or tcp port 53", prn=scapy_callback, store=0)
        except Exception as e:
            self.add_log(f"❌ Scapy live socket capture failed: {str(e)}")
            self.add_log("Automatically falling back to Simulated High-Fidelity Threat Stream...")
            self.adapter_name = "Simulation Engine"
            self.run_simulation()

    def run_simulation(self):
        self.add_log("🚀 Initiating simulated live threat network...")
        self.add_log("Adapter active: Simulated Virtual Interface [Loopback-WiFi]")
        
        benign_domains = [
            "www.google.com", "api.github.com", "ec2.us-east-1.amazonaws.com",
            "registry.npmjs.org", "slack.com", "microsoft.com", "dns.google",
            "fonts.googleapis.com", "discord.gg", "static.cloudflareinsights.com",
            "crl.identrust.com", "clients3.google.com", "safebrowsing.googleapis.com",
            "incoming.telemetry.mozilla.org", "prod.netflix.com", "s3.amazonaws.com"
        ]
        
        malicious_domains = [
            "a1b2c3d4e5f6g7h8.attacker-exfil.net",
            "v1-c2-beacon.tunnel-dns.xyz",
            "g7h8i9j0k1l2m3.malicious-c2.cc",
            "payload-exfiltrate-sysinfo-part1.secure-tunnel.biz",
            "payload-exfiltrate-sysinfo-part2.secure-tunnel.biz",
            "payload-exfiltrate-authkeys-secops.tunnel-dns.xyz",
            "z9y8x7w6v5u4t3s2r1.malicious-exfil.cc",
            "c2-heartbeat-pulse-ops.dns-tunneling-detection.xyz"
        ]
        
        client_ips = ["192.168.1.15", "192.168.1.42", "192.168.1.109", "10.0.0.14", "10.0.0.88"]
        
        while self.active:
            # Random sleep to mimic live packets (between 0.2 and 1.8 seconds)
            time.sleep(random.uniform(0.3, 1.6))
            
            # Determine if this is a malicious packet (12% probability for testing anomalies)
            is_malicious = random.random() < 0.12
            
            if is_malicious:
                query = random.choice(malicious_domains)
                # Introduce slight randomized variations to subdomains
                prefix = f"sub-{random.randint(100, 999)}-"
                if not query.startswith(prefix):
                    query = prefix + query
                src_ip = random.choice(client_ips[2:]) # Keep malicious IPs consistent
                size = random.randint(240, 512)
            else:
                query = random.choice(benign_domains)
                src_ip = random.choice(client_ips[:3])
                size = random.randint(58, 120)
                
            self.process_live_packet(query, src_ip, size)

    def worker_loop(self):
        if SCAPY_AVAILABLE:
            # Let's verify Scapy can open a socket. 
            # We try testing Scapy's socket access inside the thread.
            try:
                # Attempt to retrieve interfaces as a test for WinPcap/Npcap
                from scapy.all import get_if_list
                interfaces = get_if_list()
                if interfaces:
                    self.adapter_name = f"Raw Interface [Active: {interfaces[0]}]"
                    self.run_scapy_sniff()
                else:
                    raise Exception("No active interfaces found")
            except Exception as e:
                self.add_log(f"⚠️ Raw sockets unavailable: {str(e)}")
                self.add_log("Operating System permissions restricted or Npcap missing.")
                self.add_log("Executing High-Fidelity DNS Simulation fallback mode...")
                self.adapter_name = "Simulation Engine"
                self.run_simulation()
        else:
            self.run_simulation()

    def start(self):
        with self.lock:
            if self.active:
                return
            self.active = True
            self.start_time = time.time()
            # Clear previous buffers to start fresh
            self.all_queries = []
            self.anomalies = []
            self.logs = []
            self.total_queries = 0
            self.suspicious_count = 0
            self.threats_count = 0
            self.total_bytes = 0
            self.active_client_ips = set()
            
        self.add_log("Initializing NET-GUARD Executive Live Monitoring Module...")
        self.thread = threading.Thread(target=self.worker_loop, daemon=True)
        self.thread.start()
        self.add_log("Background sniffer thread started successfully.")

    def stop(self):
        with self.lock:
            if not self.active:
                return
            self.active = False
        self.add_log("Terminating background sniffer execution...")
        self.add_log("Live Monitoring Session Closed.")

    def clear(self):
        with self.lock:
            self.all_queries = []
            self.anomalies = []
            self.logs = []
            self.total_queries = 0
            self.suspicious_count = 0
            self.threats_count = 0
            self.total_bytes = 0
            self.active_client_ips = set()
        self.add_log("Telemetry databases purged. Standard buffer baseline initialized.")

    def get_status(self):
        with self.lock:
            duration = 1
            if self.start_time:
                duration = max(1, time.time() - self.start_time)
            
            # Packets per second calculation
            self.pps = round(self.total_queries / duration, 1) if self.active else 0.0
            
            # Prepare volume trend (simple continuous sliding window)
            # Create a 20-point sliding window of recent volume counts
            recent_queries = self.all_queries[-40:]
            volume_trend = []
            
            # Group by timestamp rounded to nearest 2s for plotting
            bin_counts = {}
            for q in recent_queries:
                t_sec = int(q['timestamp']) // 2 * 2
                t_str = time.strftime('%H:%M:%S', time.localtime(t_sec))
                bin_counts[t_str] = bin_counts.get(t_str, 0) + 1
                
            for t_str, c in sorted(bin_counts.items()):
                volume_trend.append({"time": t_str, "traffic": c})
                
            # If empty volume trend, add a spacer to prevent charting anomalies
            if not volume_trend:
                volume_trend = [{"time": time.strftime('%H:%M:%S'), "traffic": 0}]

            # Threat distribution count logic
            critical_threats = len([a for a in self.anomalies if a['risk_score'] >= 80])
            high_threats = len([a for a in self.anomalies if a['risk_score'] >= 40 and a['risk_score'] < 80])
            med_threats = len([a for a in self.anomalies if a['risk_score'] < 40])
            
            import platform
            import sys
            system_info = {
                "os": platform.system(),
                "os_release": platform.release(),
                "os_arch": platform.machine(),
                "python_version": sys.version.split(' ')[0],
                "processor": platform.processor() or "AMD64 Architecture"
            }
            
            return {
                "active": self.active,
                "totalQueries": self.total_queries,
                "suspicious": self.suspicious_count,
                "threats": self.threats_count,
                "pps": self.pps,
                "totalBytes": self.total_bytes,
                "activeClientIPs": len(self.active_client_ips),
                "adapterName": self.adapter_name,
                "volumeTrend": volume_trend,
                "results": self.anomalies[::-1], # Return anomalies in reverse chronological order for easy feed ingestion
                "allQueries": self.all_queries[::-1], # Return in reverse order for live log streams
                "logs": list(self.logs),
                "distribution": {
                    "critical": critical_threats,
                    "high": high_threats,
                    "medium": med_threats
                },
                "systemInfo": system_info
            }
