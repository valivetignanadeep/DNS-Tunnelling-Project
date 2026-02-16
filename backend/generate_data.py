from scapy.all import IP, UDP, DNS, DNSQR, wrpcap, Ether
import random
import time

def generate_pcap(filename="sample_traffic.pcap"):
    packets = []
    
    # Normal traffic
    domains = ["google.com", "facebook.com", "yahoo.com", "example.com"]
    for _ in range(20):
        domain = random.choice(domains)
        packet = Ether() / IP(src="192.168.1.10", dst="8.8.8.8") / UDP(sport=random.randint(1024, 65535), dport=53) / DNS(rd=1, qd=DNSQR(qname=domain))
        packet.time = time.time() - random.randint(100, 1000)
        packets.append(packet)

    # Tunneling traffic (High Entropy)
    tunnel_domain = "tunnel.com"
    for _ in range(10):
        # Generate random subdomains
        subdomain = "".join(random.choices("abcdefghijklmnopqrstuvwxyz0123456789", k=55))
        full_domain = f"{subdomain}.{tunnel_domain}"
        packet = Ether() / IP(src="192.168.1.20", dst="8.8.8.8") / UDP(sport=random.randint(1024, 65535), dport=53) / DNS(rd=1, qd=DNSQR(qname=full_domain))
        packet.time = time.time() - random.randint(10, 50)
        packets.append(packet)

    # Frequency Attack
    freq_domain = "freq-test.com"
    for _ in range(150): # High frequency
        packet = Ether() / IP(src="192.168.1.30", dst="8.8.8.8") / UDP(sport=random.randint(1024, 65535), dport=53) / DNS(rd=1, qd=DNSQR(qname=freq_domain))
        packet.time = time.time() - random.randint(0, 60) # All within last minute
        packets.append(packet)

    wrpcap(filename, packets)
    print(f"Generated {filename}")

if __name__ == "__main__":
    generate_pcap()
