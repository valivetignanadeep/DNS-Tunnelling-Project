import json
from analyzer import DNSAnalyzer

def test_analysis():
    analyzer = DNSAnalyzer()
    data = analyzer.analyze_pcap("sample_traffic.pcap")
    results = data["results"]
    
    payload = {
        "totalQueries": data["totalQueries"],
        "suspicious": data["suspicious"],
        "threats": data["threats"],
        "anomaliesPreview": results[:3] 
    }
    
    print(json.dumps(payload, indent=4))

if __name__ == "__main__":
    test_analysis()
