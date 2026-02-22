import math
from collections import Counter
import pandas as pd
from scapy.all import rdpcap, DNS, DNSQR, DNSRR
import os

class DNSAnalyzer:
    def __init__(self):
        self.results = []

    def calculate_entropy(self, s):
        p, lns = Counter(s), float(len(s))
        return -sum( count/lns * math.log(count/lns, 2) for count in p.values())

    def analyze_pcap(self, filepath):
        packets = rdpcap(filepath)
        data = []
        
        for packet in packets:
            if packet.haslayer(DNS):
                dns_layer = packet.getlayer(DNS)
                if packet.haslayer(DNSQR):
                    query_name = dns_layer.qd.qname.decode('utf-8').rstrip('.')
                    data.append({
                        'timestamp': float(packet.time),
                        'src_ip': packet[0][1].src if packet.haslayer('IP') else 'Unknown',
                        'query': query_name,
                        'qtype': str(dns_layer.qd.qtype),
                        'size': len(packet)
                    })
        
        df = pd.DataFrame(data)
        if df.empty:
            return []
            
        anomalies = self.detect_anomalies(df)
        
        # Calculate Volume Trend (simple time-based bins)
        df['time_bin'] = pd.to_datetime(df['timestamp'], unit='s').dt.floor('s')
        trend_df = df.groupby('time_bin').size().reset_index(name='count')
        volume_trend = [
            {"time": t.strftime('%H:%M:%S'), "traffic": int(c)} 
            for t, c in trend_df.itertuples(index=False)
        ]

        # Prepare Engine Logs
        logs = [
            f"Analyzing file: source_pcap",
            f"Packets parsed: {len(df)}",
            f"Anomalies found: {len(anomalies)}",
            f"Risk Distribution: Critical({len([a for a in anomalies if a['risk_score'] >= 80])}), High({len([a for a in anomalies if a['risk_score'] >= 40 and a['risk_score'] < 80])}), Medium({len([a for a in anomalies if a['risk_score'] < 40])})",
            "Cleaning up temporary file...",
            "Returning JSON response to frontend."
        ]

        # Prepare All Queries Log
        df['entropy'] = df['query'].apply(lambda x: self.calculate_entropy(x.split('.')[0]))
        df['classification'] = df['entropy'].apply(lambda e: "HIGH" if e >= 4.5 else "AVG" if e >= 3.0 else "LOW")
        
        # Drop time_bin as Timestamps are not JSON serializable
        df_for_log = df.drop(columns=['time_bin'], errors='ignore')
        all_queries = df_for_log.to_dict('records')
        for q in all_queries:
            q['timestamp'] = float(q['timestamp'])
            q['entropy'] = round(q['entropy'], 2)

        # Return both anomalies and aggregate stats
        return {
            "totalQueries": len(df),
            "suspicious": len(anomalies),
            "threats": len([a for a in anomalies if a['risk_score'] >= 80]),
            "volumeTrend": volume_trend[:50], 
            "results": anomalies,
            "logs": logs,
            "allQueries": all_queries
        }

    def detect_anomalies(self, df):
        analysis_results = []
        
        # Frequency Analysis
        query_counts = df.groupby(['src_ip', 'query']).size().reset_index(name='count')
        
        for _, row in df.iterrows():
            domain = row['query']
            subdomain = domain.split('.')[0] # simplistic extraction

            # Lexical Analysis
            entropy = self.calculate_entropy(subdomain)
            length = len(subdomain)
            
            # Heuristics for Anomaly Detection
            is_suspicious_length = length > 50  
            is_suspicious_entropy = entropy > 4.5 
            
            # Frequency Check
            freq = query_counts[(query_counts['src_ip'] == row['src_ip']) & (query_counts['query'] == row['query'])]['count'].values[0]
            is_high_frequency = freq > 100 

            risk_score = 0
            reasons = []
            
            if is_suspicious_length:
                risk_score += 40
                reasons.append("Unusual Length")
            if is_suspicious_entropy:
                risk_score += 40
                reasons.append("High Entropy")
            if is_high_frequency:
                risk_score += 20
                reasons.append("High Frequency")
                
            if risk_score > 0:
                # Check if already added (only add unique domain-ip pairs)
                if not any(r['domain'] == domain and r['src_ip'] == row['src_ip'] for r in analysis_results):
                    analysis_results.append({
                        'timestamp': float(row['timestamp']),
                        'src_ip': row['src_ip'],
                        'domain': domain,
                        'risk_score': risk_score,
                        'reasons': ", ".join(reasons),
                        'entropy': round(entropy, 2),
                        'length': length,
                        'frequency': int(freq)
                    })
                
        return sorted(analysis_results, key=lambda x: x['risk_score'], reverse=True)

