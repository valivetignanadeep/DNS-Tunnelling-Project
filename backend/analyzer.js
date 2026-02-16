const fs = require('fs');

// Shannon entropy calculation
function calculateEntropy(str) {
    const len = str.length;
    const frequencies = {};
    for (let i = 0; i < len; i++) {
        const char = str[i];
        frequencies[char] = (frequencies[char] || 0) + 1;
    }

    return Object.values(frequencies).reduce((sum, f) => {
        const p = f / len;
        return sum - (p * Math.log2(p));
    }, 0);
}

// Manual PCAP Parser stream logic
// Note: This is a synchronous implementation for simplicity as we read the whole file buffer
// For large files, streams are better, but memory on modern machines handles decent sized PCAPs.
function parsePcapFileInChunks(filePath) {
    const buffer = fs.readFileSync(filePath);
    let offset = 0;

    // Global Header (24 bytes)
    if (buffer.length < 24) return [];

    // Check magic number (d4 c3 b2 a1 for little endian, a1 b2 c3 d4 for big endian)
    // We assume little endian (standard PCAP)
    const magic = buffer.readUInt32LE(0);
    // 0xa1b2c3d4 or 0xd4c3b2a1

    offset += 24;

    const packets = [];

    while (offset < buffer.length) {
        if (offset + 16 > buffer.length) break;

        // Packet Header (16 bytes)
        // ts_sec (4), ts_usec (4), incl_len (4), orig_len (4)
        const tsSec = buffer.readUInt32LE(offset);
        const tsUsec = buffer.readUInt32LE(offset + 4);
        const inclLen = buffer.readUInt32LE(offset + 8);
        const origLen = buffer.readUInt32LE(offset + 12);

        offset += 16;

        if (offset + inclLen > buffer.length) break;

        const packetData = buffer.subarray(offset, offset + inclLen);
        packets.push({
            timestamp: tsSec, // Use seconds only
            data: packetData
        });

        offset += inclLen;
    }

    return packets;
}


function extractDomainsFromBuffer(buffer) {
    try {
        let strings = [];
        let currentString = "";

        // Very simplistic "strings" extraction
        // To be more accurate, we should parse Ethernet -> IP -> UDP -> DNS
        // Ethernet: 14 bytes
        // IP: 20 bytes (usually)
        // UDP: 8 bytes
        // DNS: Starts after UDP
        // Total offset: 42 bytes approx.
        // But headers vary (VLANs, etc).
        // Let's rely on finding domain-like strings in the payload.

        for (let i = 0; i < buffer.length; i++) {
            const byte = buffer[i];
            if ((byte >= 45 && byte <= 46) || (byte >= 48 && byte <= 57) || (byte >= 65 && byte <= 90) || (byte >= 97 && byte <= 122)) {
                // - . 0-9 A-Z a-z
                currentString += String.fromCharCode(byte);
            } else {
                if (currentString.length > 3) {
                    // Check if it looks like a domain
                    if (currentString.includes('.') && !currentString.startsWith('.') && !currentString.endsWith('.')) {
                        // Filter out common false positives
                        if (!currentString.includes('..')) {
                            strings.push(currentString);
                        }
                    }
                }
                currentString = "";
            }
        }
        return strings;
    } catch (e) {
        return [];
    }
}

function analyzePcap(filePath) {
    return new Promise((resolve, reject) => {
        try {
            const rawPackets = parsePcapFileInChunks(filePath);
            const packetData = [];

            rawPackets.forEach(pkt => {
                const domains = extractDomainsFromBuffer(pkt.data);

                domains.forEach(domain => {
                    // Heuristic filter (basic)
                    if (domain.length < 4) return;

                    packetData.push({
                        timestamp: pkt.timestamp,
                        src_ip: '192.168.x.x', // Placeholder as we aren't parsing IP header fully
                        query: domain,
                        size: pkt.data.length
                    });
                });
            });

            const anomalies = detectAnomalies(packetData);
            resolve(anomalies);

        } catch (error) {
            reject(error);
        }
    });
}

function detectAnomalies(data) {
    const results = [];
    const queryCounts = {};

    // 1. Frequency Analysis Prep
    data.forEach(p => {
        const key = `${p.src_ip}-${p.query}`;
        queryCounts[key] = (queryCounts[key] || 0) + 1;
    });

    data.forEach(row => {
        const domain = row.query;
        // Strip trailing dot
        const cleanDomain = domain.endsWith('.') ? domain.slice(0, -1) : domain;

        // Subdomain extraction (simplistic)
        const parts = cleanDomain.split('.');
        if (parts.length < 2) return; // Not a valid domain with TLD
        const subdomain = parts[0];

        // Lexical
        const entropy = calculateEntropy(subdomain);
        const length = subdomain.length;

        // Heuristics
        const isSuspiciousLength = length > 50;
        const isSuspiciousEntropy = entropy > 4.5;

        const key = `${row.src_ip}-${row.query}`;
        const freq = queryCounts[key] || 0;
        const isHighFrequency = freq > 10; // Lower threshold for testing

        let riskScore = 0;
        const reasons = [];

        if (isSuspiciousLength) {
            riskScore += 40;
            reasons.push("Unusual Length");
        }
        if (isSuspiciousEntropy) {
            riskScore += 40;
            reasons.push("High Entropy");
        }
        if (isHighFrequency) {
            riskScore += 20;
            reasons.push("High Frequency");
        }

        if (riskScore > 0) {
            const exists = results.find(r => r.domain === cleanDomain);
            if (!exists) {
                results.push({
                    timestamp: row.timestamp,
                    src_ip: row.src_ip, // Mock IP
                    domain: cleanDomain,
                    risk_score: riskScore,
                    reasons: reasons.join(", "),
                    entropy: parseFloat(entropy.toFixed(2)),
                    length: length,
                    frequency: freq
                });
            }
        }
    });

    return results.sort((a, b) => b.risk_score - a.risk_score);
}

module.exports = analyzePcap;
