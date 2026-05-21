

export function randomIP(prefix = ''): string {
  if (prefix) {
    const parts = prefix.split('.').map(Number);
    while (parts.length < 4) parts.push(Math.floor(Math.random() * 254) + 1);
    return parts.slice(0, 4).join('.');
  }
  return [
    Math.floor(Math.random() * 223) + 1,
    Math.floor(Math.random() * 254) + 1,
    Math.floor(Math.random() * 254) + 1,
    Math.floor(Math.random() * 254) + 1,
  ].join('.');
}

export function randomHex(bytes = 16): string {
  return Array.from({ length: bytes }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');
}

export function randomMAC(): string {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join(':');
}

export function randomPort(): number {
  const common = [21, 22, 23, 25, 53, 80, 443, 445, 3306, 3389, 8080, 8443];
  return common[Math.floor(Math.random() * common.length)];
}

export function randomLatency(): string {
  return (Math.random() * 80 + 5).toFixed(2) + ' ms';
}

export function fakeEncryptedString(): string {
  const prefixes = ['AES256', 'RSA4096', 'ChaCha20', 'ECDH521', 'SHA3-512'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${prefix}::${randomHex(24)}`;
}

export function fakeSHA256(): string {
  return randomHex(32);
}

export const FAKE_HOSTS = [
  { ip: '192.168.100.45', hostname: 'neocorp-research.internal', os: 'Ubuntu 22.04 LTS', org: 'NeoCorp Industries' },
  { ip: '10.0.0.88',       hostname: 'syndicate-relay.node',     os: 'Debian 12',        org: 'The Syndicate' },
  { ip: '172.16.44.200',   hostname: 'oracle-uplink.sat',        os: 'Custom RTOS',      org: 'ORACLE Network' },
  { ip: '203.0.113.77',    hostname: 'megacorp-dmz.ext',         os: 'CentOS 9',         org: 'MegaCorp Global' },
  { ip: '198.51.100.12',   hostname: 'shadow-parliament.node',   os: 'Unknown',          org: 'Shadow Parliament' },
  { ip: '10.10.10.50',     hostname: 'vault-zero.internal',      os: 'FreeBSD 14',       org: 'Syndicate Vault' },
];

export const FAKE_SERVICES: Record<number, string> = {
  21:   'FTP',
  22:   'SSH',
  23:   'Telnet',
  25:   'SMTP',
  53:   'DNS',
  80:   'HTTP',
  443:  'HTTPS',
  445:  'SMB',
  3306: 'MySQL',
  3389: 'RDP',
  8080: 'HTTP-Alt',
  8443: 'HTTPS-Alt',
  4444: 'Unknown/Suspicious',
  31337:'NetBus (backdoor)',
};

export const FAKE_VULNERABILITIES = [
  'CVE-2077-1337 — Remote code execution via malformed SSH handshake',
  'CVE-2077-0042 — Privilege escalation via misconfigured sudo',
  'CVE-2077-9981 — Buffer overflow in custom auth daemon',
  'CVE-2076-4421 — SQL injection in admin panel login',
  'CVE-2077-2255 — Exposed /admin endpoint with default credentials',
  'CVE-2077-7722 — Directory traversal in file manager',
  'CVE-2077-3190 — Weak session token entropy',
];

export function generateScanOutput(target: string): string[] {
  const host = FAKE_HOSTS.find(h => h.ip === target || h.hostname === target) ?? {
    ip: target,
    hostname: `unknown-${randomHex(4)}.net`,
    os: 'Unknown',
    org: 'Unknown Organization',
  };
  const openPorts = [22, 80, 443, Math.random() > 0.5 ? 3306 : 8080];
  const vulns = FAKE_VULNERABILITIES.sort(() => Math.random() - 0.5).slice(0, 2);

  return [
    `Starting Ghost-Scan v4.2.1 on ${host.ip} (${host.hostname})`,
    `Scan initiated at ${new Date().toISOString()}`,
    '',
    `HOST: ${host.ip} (${host.hostname})`,
    `ORG:  ${host.org}`,
    `OS:   ${host.os}`,
    `MAC:  ${randomMAC()}`,
    '',
    'PORT     STATE   SERVICE        VERSION',
    ...openPorts.map(p => `${String(p).padEnd(8)} OPEN    ${(FAKE_SERVICES[p] || 'unknown').padEnd(14)} ${randomHex(4)}`),
    '',
    `VULNERABILITIES DETECTED: ${vulns.length}`,
    ...vulns.map(v => `  [!] ${v}`),
    '',
    `Scan complete. ${openPorts.length} ports open. ${vulns.length} vulnerabilities found.`,
    `Elapsed: ${(Math.random() * 3 + 1).toFixed(2)}s`,
  ];
}

export function generateConnectOutput(target: string): string[] {
  const host = FAKE_HOSTS.find(h => h.ip === target || h.hostname === target) ?? {
    ip: target, hostname: target, os: 'Unknown',
  };
  return [
    `Initiating encrypted tunnel to ${host.ip}...`,
    `Routing through Tor circuit: ${randomIP()} → ${randomIP()} → ${randomIP()}`,
    `TLS 1.3 handshake... ${randomHex(32)}`,
    `Certificate fingerprint: SHA-256:${fakeSHA256()}`,
    'Authentication method: publickey',
    `Sending public key: ECDSA ${randomHex(8)}`,
    '.',
    '..',
    '...',
    `Connection established to ${host.hostname} (${host.ip})`,
    `OS fingerprint: ${host.os}`,
    `Session key: ${fakeEncryptedString()}`,
    '',
    `ghost@null:~$ ssh root@${host.ip}`,
    `root@${host.hostname.split('.')[0]}:~# `,
  ];
}

export function generateBreachOutput(target: string): string[] {
  return [
    `[BREACH] Target: ${target}`,
    `[BREACH] Loading exploit modules...`,
    `[BREACH] Module loaded: ghost_escalate_v3.so`,
    `[BREACH] Probing auth service on port 22...`,
    `[BREACH] Attempting bypass via ${FAKE_VULNERABILITIES[0]}`,
    `[BREACH] Sending malformed handshake packet (size: ${Math.floor(Math.random() * 1000) + 500} bytes)`,
    `[BREACH] Firewall response: ${randomHex(4)} — evading...`,
    `[BREACH] IDS signature bypass: ✓`,
    `[BREACH] Injecting shellcode: ${randomHex(32)}`,
    `[BREACH] Waiting for callback...`,
    `[BREACH] Reverse shell received from ${target}:${randomPort()}`,
    `[BREACH] Privilege check: uid=0(root) gid=0(root)`,
    `[BREACH] `,
    `[BREACH] ██████████ ACCESS GRANTED ██████████`,
    `[BREACH] Shell spawned. Type commands to interact.`,
  ];
}

export function generateDecryptOutput(target: string): string[] {
  const passes = Math.floor(Math.random() * 6) + 4;
  const lines = [
    `[DECRYPT] Loading cipher suite...`,
    `[DECRYPT] Target: ${target}`,
    `[DECRYPT] Detected cipher: AES-256-GCM`,
    `[DECRYPT] Key entropy: 256 bits`,
    `[DECRYPT] Initiating rainbow table attack...`,
    `[DECRYPT] Pass ${1}/${passes}: ${randomHex(32)} — NO MATCH`,
  ];
  for (let i = 2; i < passes; i++) {
    lines.push(`[DECRYPT] Pass ${i}/${passes}: ${randomHex(32)} — NO MATCH`);
  }
  lines.push(
    `[DECRYPT] Pass ${passes}/${passes}: ${randomHex(32)} — ✓ MATCH`,
    `[DECRYPT] Key recovered: ${fakeEncryptedString()}`,
    `[DECRYPT] Decrypting payload...`,
    `[DECRYPT] ████████████████████ 100%`,
    `[DECRYPT] Decryption complete. Output saved to /tmp/decrypted_${randomHex(4)}.dat`,
  );
  return lines;
}

export function generateTraceOutput(target: string): string[] {
  const hops = Math.floor(Math.random() * 8) + 6;
  const lines = [
    `[TRACE] Tracing route to ${target}`,
    `[TRACE] Max hops: ${hops + 4} | Protocol: ICMP + TCP`,
    '',
  ];
  for (let i = 1; i <= hops; i++) {
    const ip = randomIP();
    const lat = randomLatency();
    lines.push(`  ${String(i).padStart(2)}.  ${ip.padEnd(16)} ${lat}   AS${Math.floor(Math.random() * 65535)}`);
  }
  lines.push(
    `  ${hops + 1}.  ${target.padEnd(16)} ${randomLatency()}   DESTINATION`,
    '',
    `[TRACE] Target located. Origin triangulated.`,
    `[TRACE] Physical location estimate: [CLASSIFIED]`,
    `[TRACE] ISP: Darknet Relay Services LLC`,
    `[TRACE] Trace complete.`,
  );
  return lines;
}

export function generateInjectOutput(payload: string): string[] {
  return [
    `[INJECT] Preparing payload: ${payload || 'ghost_shell_v2'}`,
    `[INJECT] Encoding: Base64 → XOR(0xDEAD) → AES-256`,
    `[INJECT] Payload size: ${Math.floor(Math.random() * 4096) + 512} bytes`,
    `[INJECT] Selecting injection vector: heap overflow`,
    `[INJECT] Target process: auth_daemon (PID ${Math.floor(Math.random() * 9000) + 1000})`,
    `[INJECT] Allocating memory region at 0x${randomHex(8)}...`,
    `[INJECT] Writing payload to 0x${randomHex(8)}...`,
    `[INJECT] Redirecting execution flow...`,
    `[INJECT] `,
    `[INJECT] ✓ Payload executed successfully`,
    `[INJECT] Callback: ${randomIP()}:${4444 + Math.floor(Math.random() * 100)}`,
    `[INJECT] Cleaning memory traces...`,
    `[INJECT] Injection complete. No traces left.`,
  ];
}

export function generateBypassOutput(): string[] {
  return [
    `[BYPASS] Enumerating security controls...`,
    `[BYPASS] Detected: Firewall (iptables v1.8.9)`,
    `[BYPASS] Detected: IDS (Snort 3.1)`,
    `[BYPASS] Detected: WAF (ModSecurity 3.0)`,
    `[BYPASS] Detected: 2FA (TOTP)`,
    '',
    `[BYPASS] Strategy: Protocol tunneling via DNS`,
    `[BYPASS] Crafting DNS query chain...`,
    `[BYPASS] Firewall bypass: ✓ (DNS port 53 allowed)`,
    `[BYPASS] IDS evasion: ✓ (signature fragmented)`,
    `[BYPASS] WAF bypass: ✓ (encoding obfuscation)`,
    `[BYPASS] 2FA bypass: ✓ (session token reuse, ${fakeEncryptedString()})`,
    '',
    `[BYPASS] ████████████████████ ALL CONTROLS BYPASSED`,
    `[BYPASS] Establishing covert channel...`,
    `[BYPASS] Channel active on ${randomIP()}:${randomPort()}`,
  ];
}

export function generateStatusOutput(user: string, dir: string, target: string | null): string[] {
  return [
    '╔══════════════════════════════════════════╗',
    '║          GHOST OS v7.4.2 — STATUS        ║',
    '╚══════════════════════════════════════════╝',
    '',
    `  Operator   : ${user}`,
    `  Session    : ${randomHex(8)}`,
    `  Directory  : ${dir}`,
    `  Target     : ${target || 'NONE'}`,
    '',
    `  Tor Circuit: ACTIVE (${Math.floor(Math.random() * 3) + 3} hops)`,
    `  VPN Tunnel : ACTIVE — ${randomIP()}`,
    `  MAC Spoof  : ${randomMAC()}`,
    `  Identity   : MASKED`,
    '',
    `  Firewall   : ACTIVE`,
    `  IDS        : BYPASSED`,
    `  Traces     : NONE DETECTED`,
    '',
    `  Uptime     : ${Math.floor(Math.random() * 48)}h ${Math.floor(Math.random() * 59)}m`,
    `  Threat     : ${(['LOW','MODERATE','HIGH','CRITICAL'])[Math.floor(Math.random()*4)]}`,
    '',
  ];
}

export const MATRIX_CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
