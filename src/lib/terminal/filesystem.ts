

export interface VFSNode {
  name: string;
  type: 'dir' | 'file';
  content?: string;
  permissions: string;
  owner: string;
  size: number;
  hidden?: boolean;
  children?: Record<string, VFSNode>;
}

export const VIRTUAL_FS: VFSNode = {
  name: '/',
  type: 'dir',
  permissions: 'drwxr-xr-x',
  owner: 'root',
  size: 0,
  children: {
    home: {
      name: 'home', type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', size: 0,
      children: {
        ghost: {
          name: 'ghost', type: 'dir', permissions: 'drwx------', owner: 'ghost', size: 0,
          children: {
            '.bashrc': { name: '.bashrc', type: 'file', hidden: true, permissions: '-rw-------', owner: 'ghost', size: 312,
              content: '# Ghost Shell Config\nexport PS1="\\[\\033[01;32m\\]ghost@null\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]$ "\nexport PATH=$PATH:/usr/local/ghost/bin\nalias ls="ls --color=auto"\nalias ll="ls -la"\nalias cls="clear"\nexport HISTSIZE=0\nexport HISTFILE=/dev/null' },
            'notes.txt': { name: 'notes.txt', type: 'file', permissions: '-rw-------', owner: 'ghost', size: 445,
              content: 'PRIORITY TARGETS:\n- NeoCorp R&D (192.168.100.45) - Project LAZARUS files\n- Syndicate relay node (10.0.0.88) - VAULT_ZERO access\n- ORACLE satellite uplink (SIGNAL_OMEGA_7)\n\nREMINDER: The password rotates every 72h.\nLast key: [REDACTED]\nContact: zero_day@darkweb.onion\n\n"Trust no one. Verify everything. Leave no trace."' },
            'missions.log': { name: 'missions.log', type: 'file', permissions: '-rw-r-----', owner: 'ghost', size: 287,
              content: '2077-05-19 22:14:01 — GHOST PROTOCOL: Stage 2 complete\n2077-05-18 03:44:22 — ROGUE SIGNAL: Initiated\n2077-05-17 19:01:55 — VAULT ZERO: Target identified\n\nActive bounties: 3\nCompleted: 7\nTotal XP earned: 2400' },
          },
        },
      },
    },
    root: {
      name: 'root', type: 'dir', permissions: 'drwx------', owner: 'root', size: 0,
      children: {
        '.secret': { name: '.secret', type: 'file', hidden: true, permissions: '-rw-------', owner: 'root', size: 198,
          content: 'You found it.\n\nCode: OMEGA-NULL-7\n\nThis unlocks the PHANTOM terminal theme.\nType: theme unlock phantom\n\n"The quieter you become, the more you can hear."\n— Unknown' },
        'toolkit.sh': { name: 'toolkit.sh', type: 'file', permissions: '-rwx------', owner: 'root', size: 892,
          content: '#!/bin/bash\n# Ghost Toolkit v3.1\n# SIMULATION ONLY\n\necho "[GHOST] Loading modules..."\necho "[GHOST] recon module: OK"\necho "[GHOST] breach module: OK"\necho "[GHOST] decrypt module: OK"\necho "[GHOST] inject module: OK"\necho "[GHOST] All modules loaded."' },
      },
    },
    intel: {
      name: 'intel', type: 'dir', permissions: 'drwx------', owner: 'root', size: 0,
      children: {
        'targets.db': { name: 'targets.db', type: 'file', permissions: '-rw-------', owner: 'root', size: 48200,
          content: '[ENCRYPTED BINARY DATA]\nHeader: GHOST_DB_v2.1\nRecords: 47\nLast updated: 2077-03-14 02:11:09\n\nDecryption key required.\nUse: decrypt --file /intel/targets.db --key <KEY>' },
        'neocorp_leak.txt': { name: 'neocorp_leak.txt', type: 'file', permissions: '-rw-r-----', owner: 'root', size: 687,
          content: 'CONFIDENTIAL - NEOCORP INTERNAL MEMO\nProject: LAZARUS\nDate: 2077-01-08\n\nStatus: Phase 3 complete. Neural mapping of 4,200 test subjects confirmed.\nNext phase: Mass deployment via NeuroPatch v3.1 firmware update.\n\nConcern flagged by Dr. Reyes (Ethics Board) — DISMISSED by exec order 77-C.\nAll ethics board records purged from main servers.\nBackup copies transferred to Vault Zero.\n\n[END OF MEMO]' },
        'orgs.txt': { name: 'orgs.txt', type: 'file', permissions: '-rw-r--r--', owner: 'ghost', size: 512,
          content: 'KNOWN THREAT ACTORS:\n\n[NeoCorp Industries]\n  HQ: Neo-Tokyo, Sector 7\n  Threat level: CRITICAL\n  Known ops: LAZARUS, PHANTOM WIRE\n\n[The Syndicate]\n  Structure: Decentralized\n  Threat level: EXTREME\n  Known ops: VAULT ZERO, SHADOW LEDGER\n\n[ORACLE Network]\n  Origin: Unknown\n  Threat level: UNKNOWN\n  Classification: Rogue AI' },
      },
    },
    darknet: {
      name: 'darknet', type: 'dir', permissions: 'drwx------', owner: 'ghost', size: 0,
      children: {
        'markets.txt': { name: 'markets.txt', type: 'file', permissions: '-rw-------', owner: 'ghost', size: 512,
          content: 'ACTIVE DARKNET MARKETPLACES (FICTIONAL SIMULATION):\n\n[1] ShadowBay v4.2\n    Status: ONLINE | Vendors: 847 | Uptime: 99.1%\n    Categories: Data, Access, Tools, Comms\n\n[2] CryptoBlack\n    Status: ONLINE | Vendors: 312 | Uptime: 97.8%\n    Categories: Zero-days, Credentials, Botnet\n\n[3] GhostMarket — OFFLINE (law enforcement action)\n\n⚠ WARNING: All listings are FICTIONAL. This is a simulation.' },
        'comms.enc': { name: 'comms.enc', type: 'file', permissions: '-rw-------', owner: 'ghost', size: 2048,
          content: '[AES-256-GCM ENCRYPTED]\nIV: a3f8c2e1b7d94f2a\nTag: 8f3a2c1e4b7d9f2a\nCiphertext: [2048 bytes of encrypted data]\n\nDecrypt with: decrypt --file /darknet/comms.enc' },
        'wallets.dat': { name: 'wallets.dat', type: 'file', permissions: '-rw-------', owner: 'ghost', size: 256,
          content: 'CRYPTO WALLETS (FICTIONAL):\n\nBTC: 1GhostNullXkT9f7rPqW2Y5vMnBHjD4oXz\n    Balance: 3.14159265 BTC\n\nXMR: 48ghXzK1r4NvMcWzpFdnTqBjXsGhYm7oLpR3vCaKdP2qWE1nSe\n    Balance: 128.00000000 XMR\n\n⚠ SIMULATION ONLY — Not real currency' },
      },
    },
    vault: {
      name: 'vault', type: 'dir', permissions: 'drwx------', owner: 'root', size: 0,
      children: {
        neocorp: {
          name: 'neocorp', type: 'dir', permissions: 'drwx------', owner: 'root', size: 0,
          children: {
            classified: {
              name: 'classified', type: 'dir', permissions: 'drwx------', owner: 'root', size: 0,
              children: {
                'lazarus_manifest.txt': { name: 'lazarus_manifest.txt', type: 'file', permissions: '-rw-------', owner: 'root', size: 891,
                  content: 'PROJECT LAZARUS - CLASSIFIED MANIFEST\nClearance Level: OMEGA\n\nObjective: Develop persistent neural firmware capable of remote behavioral\nmodification in human subjects without conscious awareness.\n\nFunding: $4.7B (black budget, NeoCorp Defense Division)\nTimeline: 2074-2078\nSubjects: Civilian volunteers [NOTE: consent forms altered post-signing]\n\nKey Personnel:\n- Dr. A. Reyes — Lead Neuroengineer (WHISTLEBLOWER RISK)\n- Director V. Kane — Project Oversight\n- Agent 7 — Field Operations\n\nCurrent Phase: DEPLOYMENT READY\nRisk Assessment: CRITICAL\n\n[DOCUMENT END — PROPERTY OF NEOCORP INDUSTRIES]' },
                'personnel.enc': { name: 'personnel.enc', type: 'file', permissions: '-rw-------', owner: 'root', size: 3200,
                  content: '[ENCRYPTED — AES-256]\nPersonnel records for Project LAZARUS\nDecrypt to view.' },
              },
            },
          },
        },
      },
    },
    var: {
      name: 'var', type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', size: 0,
      children: {
        logs: {
          name: 'logs', type: 'dir', permissions: 'drwxr-x---', owner: 'root', size: 0,
          children: {
            'system.log': { name: 'system.log', type: 'file', permissions: '-rw-r-----', owner: 'root', size: 788,
              content: '2077-05-19 23:58:01 [INFO]  System boot complete. Kernel 6.7.2-ghost\n2077-05-19 23:58:03 [INFO]  Firewall initialized. Rules: 2,847 active\n2077-05-19 23:59:11 [WARN]  Unusual traffic spike on eth0 (12.4 GB/s)\n2077-05-20 00:02:44 [CRIT]  Intrusion attempt detected: 94.21.183.47\n2077-05-20 00:02:45 [INFO]  Auto-countermeasures deployed\n2077-05-20 00:02:46 [INFO]  Attacker IP blacklisted\n2077-05-20 01:14:22 [INFO]  Scheduled scan complete. 0 anomalies found.\n2077-05-20 02:30:00 [INFO]  Backup completed: /vault (48.2 GB)\n2077-05-20 03:00:01 [WARN]  SSH login attempt: user=admin from 10.0.0.1\n2077-05-20 03:00:02 [CRIT]  Multiple failed auth attempts. Lockout initiated.' },
            'access.log': { name: 'access.log', type: 'file', permissions: '-rw-r-----', owner: 'root', size: 445,
              content: '2077-05-20 01:22:11 ghost LOGIN  /dev/tty1\n2077-05-20 01:22:44 ghost cd     /intel\n2077-05-20 01:23:01 ghost cat    /intel/neocorp_leak.txt\n2077-05-20 01:24:18 ghost scan   192.168.100.45\n2077-05-20 01:25:44 ghost connect 192.168.100.45\n2077-05-20 01:26:09 ghost cd     /vault/neocorp/classified' },
          },
        },
      },
    },
    tmp: {
      name: 'tmp', type: 'dir', permissions: 'drwxrwxrwx', owner: 'root', size: 0,
      children: {},
    },
    etc: {
      name: 'etc', type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', size: 0,
      children: {
        'ghost.conf': { name: 'ghost.conf', type: 'file', permissions: '-rw-r--r--', owner: 'root', size: 456,
          content: '# Ghost OS System Configuration\n\n[network]\ninterface=eth0\nmtu=9000\nstealth_mode=1\npacket_fragmentation=enabled\n\n[security]\nfirewall=active\nids=active\nhoneypot=enabled\nzero_log_mode=1\n\n[identity]\nspoof_mac=1\nrandom_hostname=1\nclear_metadata=1\n\n[ops]\nmax_concurrent_sessions=8\nauto_disconnect_idle=300\nencrypt_all_traffic=1' },
        'hosts': { name: 'hosts', type: 'file', permissions: '-rw-r--r--', owner: 'root', size: 312,
          content: '127.0.0.1   localhost\n127.0.1.1   ghost-null\n\n# Known targets (SIMULATION)\n192.168.100.45  neocorp-research.internal\n10.0.0.88       syndicate-relay.node\n172.16.44.200   oracle-uplink.sat\n203.0.113.77    megacorp-dmz.ext' },
      },
    },
    sys: {
      name: 'sys', type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', size: 0,
      children: {},
    },
  },
};

export function resolvePath(currentDir: string, inputPath: string): string {
  if (!inputPath) return currentDir;
  if (inputPath === '/') return '/';
  if (inputPath === '~') return '/home/ghost';

  let parts: string[];
  if (inputPath.startsWith('/')) {
    parts = inputPath.split('/').filter(Boolean);
  } else {
    parts = [...currentDir.split('/').filter(Boolean), ...inputPath.split('/').filter(Boolean)];
  }

  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '..') {
      resolved.pop();
    } else if (part !== '.') {
      resolved.push(part);
    }
  }
  return '/' + resolved.join('/');
}

export function getNode(path: string): VFSNode | null {
  if (path === '/') return VIRTUAL_FS;
  const parts = path.split('/').filter(Boolean);
  let node: VFSNode = VIRTUAL_FS;
  for (const part of parts) {
    if (!node.children || !(part in node.children)) return null;
    node = node.children[part];
  }
  return node;
}

export function listDir(path: string, showHidden = false): VFSNode[] {
  const node = getNode(path);
  if (!node || node.type !== 'dir' || !node.children) return [];
  return Object.values(node.children).filter(n => showHidden || !n.hidden);
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
  return `${(bytes / 1024 / 1024).toFixed(1)}M`;
}
