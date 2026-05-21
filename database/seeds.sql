USE hacker_sim;

INSERT INTO users (username, email, password, handle, level, xp, rep, theme)
VALUES ('ghost', 'ghost@null.sys', '$2a$10$K9mQjMFnvkCX7s5v7zD3BeJhfTHo6G0AkGqBk6PfaxlV5JRF9PCAO', 'Ghost_Null', 5, 2400, 320, 'green')
ON DUPLICATE KEY UPDATE username=username;

INSERT INTO settings (user_id, sound_enabled, crt_effect, scanlines, animation_intensity, terminal_font_size, theme_color, ambient_volume)
SELECT id, 1, 1, 1, 'high', 14, 'green', 40 FROM users WHERE username='ghost'
ON DUPLICATE KEY UPDATE user_id=user_id;

INSERT INTO crypto_wallets (user_id, currency, address, balance)
SELECT id, 'BTC', '1GhostNullXkT9f7rPqW2Y5vMnBHjD4oXz', 3.14159
FROM users WHERE username='ghost'
ON DUPLICATE KEY UPDATE user_id=user_id;

INSERT INTO crypto_wallets (user_id, currency, address, balance)
SELECT id, 'XMR', '48ghXzK1r4NvMcWzpFdnTqBjXsGhYm7oLpR3vCaKdP2qWE1nSe', 128.00
FROM users WHERE username='ghost'
ON DUPLICATE KEY UPDATE user_id=user_id;

INSERT INTO missions (slug, title, description, difficulty, category, xp_reward, rep_reward, lore, unlock_level, sort_order) VALUES
('ghost-protocol',
 'GHOST PROTOCOL',
 'Infiltrate NeoCorp Industries. Extract classified project files from their internal research server before the 0300 lockdown.',
 'EASY', 'infiltration', 200, 25,
 'NeoCorp has been selling neural implant data to government agencies. The resistance needs proof. You are the only one who can get in undetected.',
 1, 1),

('rogue-signal',
 'ROGUE SIGNAL',
 'Trace and disable a rogue AI broadcasting encrypted signals from abandoned satellite infrastructure.',
 'MEDIUM', 'trace', 400, 50,
 'The signal started three weeks ago. ORACLE calls it a ghost — something that was never supposed to exist. Find it. Kill it.',
 2, 2),

('vault-zero',
 'VAULT ZERO',
 'Breach the Syndicate''s offline vault. Download encrypted financial ledgers before the 6-hour window closes.',
 'HARD', 'breach', 700, 90,
 'The Syndicate keeps their dirtiest secrets in Vault Zero — an air-gapped system accessible only during scheduled maintenance windows. That window opens tonight.',
 4, 3),

('shadow-parliament',
 'SHADOW PARLIAMENT',
 'Expose the Shadow Parliament — a secret network of politicians laundering funds through fake charity DAOs.',
 'EXTREME', 'investigation', 1200, 150,
 'They own the courts. They own the media. But they don''t own the network. Not yet.',
 7, 4),

('dead-mans-switch',
 'DEAD MAN''S SWITCH',
 'Recover and decrypt a dead hacker''s data cache before it is permanently wiped by an autonomous kill-switch.',
 'MEDIUM', 'decrypt', 500, 60,
 'Zero_Day left one message before going dark: "The cache is your inheritance. The password is what I never told you."',
 3, 5),

('surveillance-blackout',
 'SURVEILLANCE BLACKOUT',
 'Disable 12 surveillance nodes across the city grid. Coordinate a 90-second blackout window for the extraction team.',
 'HARD', 'sabotage', 800, 100,
 'The extraction team is pinned. Eyes everywhere. You have 90 seconds of cover if you can kill the grid. Don''t miss.',
 5, 6);

INSERT INTO mission_stages (mission_id, stage_number, title, objective, hint, trigger_cmd) VALUES
((SELECT id FROM missions WHERE slug='ghost-protocol'), 1, 'Reconnaissance', 'Run a port scan on target 192.168.100.45', 'Use the scan command followed by the target IP', 'scan'),
((SELECT id FROM missions WHERE slug='ghost-protocol'), 2, 'Establish Connection', 'Connect to the SSH service on port 22', 'Use: connect 192.168.100.45', 'connect'),
((SELECT id FROM missions WHERE slug='ghost-protocol'), 3, 'Privilege Escalation', 'Gain root access on the target system', 'Try: sudo escalate', 'sudo'),
((SELECT id FROM missions WHERE slug='ghost-protocol'), 4, 'Data Extraction', 'Extract files from /vault/neocorp/classified/', 'Navigate to the directory and use cat on the files', 'cat');

INSERT INTO mission_stages (mission_id, stage_number, title, objective, hint, trigger_cmd) VALUES
((SELECT id FROM missions WHERE slug='rogue-signal'), 1, 'Signal Trace', 'Trace the rogue signal to its source', 'Use: trace SIGNAL_OMEGA_7', 'trace'),
((SELECT id FROM missions WHERE slug='rogue-signal'), 2, 'Decrypt Broadcast', 'Decrypt the AI''s encrypted broadcast', 'Use: decrypt 
((SELECT id FROM missions WHERE slug='rogue-signal'), 3, 'Inject Kill Switch', 'Inject termination protocol into the AI core', 'Use: inject 
((SELECT id FROM missions WHERE slug='rogue-signal'), 4, 'Disconnect & Purge', 'Disconnect all sessions and clear traces', 'Use: disconnect 

INSERT INTO filesystem_nodes (path, name, type, permissions, owner) VALUES
('/', '/', 'dir', 'drwxr-xr-x', 'root'),
('/home', 'home', 'dir', 'drwxr-xr-x', 'root'),
('/home/ghost', 'ghost', 'dir', 'drwx
('/root', 'root', 'dir', 'drwx
('/intel', 'intel', 'dir', 'drwx
('/darknet', 'darknet', 'dir', 'drwx
('/vault', 'vault', 'dir', 'drwx
('/var', 'var', 'dir', 'drwxr-xr-x', 'root'),
('/var/logs', 'logs', 'dir', 'drwxr-x
('/sys', 'sys', 'dir', 'drwxr-xr-x', 'root'),
('/tmp', 'tmp', 'dir', 'drwxrwxrwx', 'root'),
('/etc', 'etc', 'dir', 'drwxr-xr-x', 'root');

INSERT INTO filesystem_nodes (path, name, type, content, permissions, owner, size_bytes) VALUES
('/home/ghost/.bashrc', '.bashrc', 'file',
'# Ghost Shell Config\nexport PS1="\\[\\033[01;32m\\]ghost@null\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]$ "\nexport PATH=$PATH:/usr/local/ghost/bin\nalias ls="ls 
'-rw

('/home/ghost/notes.txt', 'notes.txt', 'file',
'PRIORITY TARGETS:\n- NeoCorp R&D (192.168.100.45) - Project LAZARUS files\n- Syndicate relay node (10.0.0.88) - VAULT_ZERO access\n- ORACLE satellite uplink (SIGNAL_OMEGA_7)\n\nREMINDER: The password rotates every 72h.\nLast key: [REDACTED]\nContact: zero_day@darkweb.onion\n\n"Trust no one. Verify everything. Leave no trace."',
'-rw

('/intel/targets.db', 'targets.db', 'file',
'[ENCRYPTED BINARY DATA]\nHeader: GHOST_DB_v2.1\nRecords: 47\nLast updated: 2077-03-14 02:11:09\n\nDecryption key required.\nUse: decrypt 
'-rw

('/intel/neocorp_leak.txt', 'neocorp_leak.txt', 'file',
'CONFIDENTIAL - NEOCORP INTERNAL MEMO\nProject: LAZARUS\nDate: 2077-01-08\n\nStatus: Phase 3 complete. Neural mapping of 4,200 test subjects confirmed.\nNext phase: Mass deployment via NeuroPatch v3.1 firmware update.\n\nConcern flagged by Dr. Reyes (Ethics Board) — DISMISSED by exec order 77-C.\nAll ethics board records purged from main servers.\nBackup copies transferred to Vault Zero.\n\n[END OF MEMO]',
'-rw-r

('/darknet/markets.txt', 'markets.txt', 'file',
'ACTIVE DARKNET MARKETPLACES:\n\n[1] ShadowBay v4.2 - http://shadowbay4zxcvbn.onion\n    Status: ONLINE | Vendors: 847 | Uptime: 99.1%\n    Categories: Data, Access, Tools, Comms\n\n[2] CryptoBlack - http://cryptoblk7qwerty.onion\n    Status: ONLINE | Vendors: 312 | Uptime: 97.8%\n    Categories: Zero-days, Credentials, Botnet\n\n[3] GhostMarket - OFFLINE (law enforcement action)\n\nWARNING: All listings are fictional. This is a simulation.',
'-rw

('/darknet/comms.enc', 'comms.enc', 'file',
'[AES-256-GCM ENCRYPTED]\nIV: a3f8c2e1b7d94f2a\nTag: 8f3a2c1e4b7d9f2a\nCiphertext: [2048 bytes of encrypted data]\n\nDecrypt with: decrypt 
'-rw

('/vault/neocorp/classified/lazarus_manifest.txt', 'lazarus_manifest.txt', 'file',
'PROJECT LAZARUS - CLASSIFIED MANIFEST\nClearance Level: OMEGA\n\nObjective: Develop persistent neural firmware capable of remote behavioral\nmodification in human subjects without conscious awareness.\n\nFunding: $4.7B (black budget, NeoCorp Defense Division)\nTimeline: 2074-2078\nSubjects: Civilian volunteers [NOTE: consent forms altered post-signing]\n\nKey Personnel:\n- Dr. A. Reyes — Lead Neuroengineer (WHISTLEBLOWER RISK - monitor)\n- Director V. Kane — Project Oversight\n- Agent 7 — Field Operations\n\nCurrent Phase: DEPLOYMENT READY\nRisk Assessment: CRITICAL (public exposure would be catastrophic)\n\n[DOCUMENT END — PROPERTY OF NEOCORP INDUSTRIES]',
'-rw

('/var/logs/system.log', 'system.log', 'file',
'2077-05-19 23:58:01 [INFO]  System boot complete. Kernel 6.7.2-ghost\n2077-05-19 23:58:03 [INFO]  Firewall initialized. Rules: 2,847 active\n2077-05-19 23:59:11 [WARN]  Unusual traffic spike on eth0 (12.4 GB/s)\n2077-05-20 00:02:44 [CRIT]  Intrusion attempt detected: 94.21.183.47\n2077-05-20 00:02:45 [INFO]  Auto-countermeasures deployed\n2077-05-20 00:02:46 [INFO]  Attacker IP blacklisted\n2077-05-20 01:14:22 [INFO]  Scheduled scan complete. 0 anomalies found.\n2077-05-20 02:30:00 [INFO]  Backup completed: /vault (48.2 GB)\n2077-05-20 03:00:01 [WARN]  SSH login attempt: user=admin from 10.0.0.1\n2077-05-20 03:00:02 [CRIT]  Multiple failed auth attempts. Lockout initiated.',
'-rw-r

('/etc/ghost.conf', 'ghost.conf', 'file',
'# Ghost OS System Configuration\n# Modified: 2077-05-20\n\n[network]\ninterface=eth0\nmtu=9000\nstealth_mode=1\npacket_fragmentation=enabled\n\n[security]\nfirewall=active\nids=active\nhoneypot=enabled\nzero_log_mode=1\n\n[identity]\nspoof_mac=1\nrandom_hostname=1\nclear_metadata=1\n\n[ops]\nmax_concurrent_sessions=8\nauto_disconnect_idle=300\nencrypt_all_traffic=1',
'-rw-r

('/root/.secret', '.secret', 'file',
'You found it.\n\nCode: OMEGA-NULL-7\n\nThis unlocks the PHANTOM terminal theme.\nType: theme unlock phantom\n\n"The quieter you become, the more you can hear."\n— Unknown',
'-rw

INSERT INTO darknet_listings (title, description, price_btc, vendor, category) VALUES
('Zero-Day Bundle (3x exploits)', 'Three unpatched kernel vulnerabilities. Verified against latest firmware. No logs, clean delivery.', 2.5000, 'phantom_zero', 'zero-days'),
('Corporate Credential Dump', '14,000 verified credentials from Fortune 500 breach. Sorted by access level.', 0.8000, 'databroker_9', 'credentials'),
('Anonymous VPN Cluster Access', '6-month access to 120-node rotating VPN. No logs. Kill switch included.', 0.1200, 'darknet_infra', 'privacy'),
('Custom RAT + C2 Setup', 'Fully custom remote access trojan with encrypted C2. FUD guaranteed 30 days.', 1.2000, 'maldev_uk', 'tools'),
('Insider - NeoCorp Schematics', 'Full neural implant schematics. PCB layouts + firmware source. Leaked by insider.', 4.0000, 'insider_x', 'intel'),
('Monero Tumbler Service', 'Industrial-grade XMR tumbling. 99.9% chain analysis resistant. 0.5% fee.', 0.0000, 'wash_dao', 'finance');

INSERT INTO system_events (event_type, message, severity) VALUES
('BOOT', 'Ghost OS v7.4.2 initialized', 'info'),
('FIREWALL', 'Firewall rules loaded: 2847 active', 'info'),
('THREAT', 'Incoming probe from 94.21.183.47 — blocked', 'warning'),
('IDS', 'Anomaly detected on port 4444 — quarantined', 'critical'),
('AUTH', 'Failed login attempt: admin from 10.0.0.1', 'warning'),
('NET', 'Tor circuit established: 3 hops', 'info'),
('SCAN', 'Network sweep completed: 254 hosts mapped', 'info'),
('CRYPT', 'Key rotation completed for all vaults', 'info');
