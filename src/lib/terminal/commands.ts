
import {
  generateScanOutput, generateConnectOutput, generateBreachOutput,
  generateDecryptOutput, generateTraceOutput, generateInjectOutput,
  generateBypassOutput, generateStatusOutput, randomHex, randomIP,
  fakeEncryptedString, FAKE_HOSTS,
} from './simulator';
import {
  resolvePath, getNode, listDir, formatSize,
} from './filesystem';
import type { TerminalLine } from '@/types';

export type CommandResult = {
  lines: TerminalLine[];
  newDir?: string;
  newTarget?: string | null;
  special?: 'clear' | 'matrix' | 'glitch' | 'missions';
  delay?: number;
};

function line(text: string, type: TerminalLine['type'] = 'output', delay = 0): TerminalLine {
  return { id: Math.random().toString(36).slice(2), text, type, delay };
}

function lines(texts: string[], type: TerminalLine['type'] = 'output', baseDelay = 60): TerminalLine[] {
  return texts.map((text, i) => line(text, type, i * baseDelay));
}

const HELP_TEXT = `
╔══════════════════════════════════════════════════════╗
║              GHOST OS — COMMAND REFERENCE             ║
╚══════════════════════════════════════════════════════╝

  SYSTEM
    help              Show this help
    whoami            Display operator identity
    status            Show system status
    clear             Clear terminal
    logs              View system event logs

  NAVIGATION
    ls [-a]           List directory contents
    cd <dir>          Change directory
    cat <file>        Display file contents

  NETWORK OPS
    scan <target>     Port scan target
    connect <target>  Establish SSH session
    disconnect        Close active session
    trace <target>    Trace route / locate origin

  OFFENSIVE
    breach <target>   Exploit target system
    bypass            Bypass security controls
    inject [payload]  Inject payload into process
    decrypt [target]  Decrypt file or data
    sudo <cmd>        Execute with escalated privileges

  MISSIONS
    missions          List all missions
    mission <slug>    View mission details

  IMMERSION
    matrix            Toggle matrix rain mode
    ai <message>      Talk to ORACLE AI assistant

  HIDDEN
    ???               There are secrets. Find them.

Type any command to begin. Stay ghost.
`;

export function parseCommand(
  input: string,
  state: { currentDir: string; connectedTarget: string | null; user: string; settings?: { theme_color: string } }
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const [cmd, ...argArr] = trimmed.split(/\s+/);
  const args = argArr.join(' ');
  const arg1 = argArr[0] || '';

  switch (cmd.toLowerCase()) {
    
    case 'help':
    case '?':
      return { lines: lines(HELP_TEXT.split('\n'), 'output', 10) };

    case 'whoami':
      return {
        lines: lines([
          `  Operator  : ${state.user}`,
          `  UID       : 1000`,
          `  GID       : 1000`,
          `  Shell     : /bin/ghost`,
          `  Home      : /home/ghost`,
          `  Session   : ${randomHex(8)}`,
          `  Identity  : [MASKED — Tor active]`,
        ], 'success', 40),
      };

    case 'status':
      return {
        lines: lines(generateStatusOutput(state.user, state.currentDir, state.connectedTarget), 'output', 30),
        delay: 200,
      };

    case 'clear':
    case 'cls':
      return { lines: [], special: 'clear' };

    case 'ls': {
      const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
      const targetPath = argArr.find(a => !a.startsWith('-')) || state.currentDir;
      const resolvedPath = resolvePath(state.currentDir, targetPath.startsWith('-') ? state.currentDir : targetPath);
      const node = getNode(resolvedPath);
      if (!node) return { lines: [line(`ls: cannot access '${targetPath}': No such file or directory`, 'error')] };
      if (node.type === 'file') return { lines: [line(node.name, 'output')] };

      const items = listDir(resolvedPath, showHidden);
      if (items.length === 0) return { lines: [line('', 'output')] };

      const isLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
      if (isLong) {
        const header = `total ${items.length}`;
        const fileLines = items.map(item => {
          const color = item.type === 'dir' ? '\x1b[34m' : item.name.endsWith('.sh') ? '\x1b[32m' : '';
          const reset = color ? '\x1b[0m' : '';
          return `${item.permissions}  1 ${item.owner.padEnd(8)} ${item.owner.padEnd(8)} ${formatSize(item.size).padStart(6)}  May 20 03:14  ${color}${item.name}${reset}`;
        });
        return { lines: lines([header, ...fileLines], 'output', 20) };
      }

      const chunks: string[] = [];
      let row = '';
      for (const item of items) {
        const entry = item.type === 'dir' ? `\x1b[34m${item.name}/\x1b[0m` : item.name;
        row += entry.padEnd(24);
        if (row.length > 72) { chunks.push(row.trimEnd()); row = ''; }
      }
      if (row.trimEnd()) chunks.push(row.trimEnd());
      return { lines: lines(chunks, 'output', 20) };
    }

    case 'cd': {
      const target = arg1 || '/home/ghost';
      const newPath = resolvePath(state.currentDir, target);
      const node = getNode(newPath);
      if (!node) return { lines: [line(`cd: ${target}: No such file or directory`, 'error')] };
      if (node.type === 'file') return { lines: [line(`cd: ${target}: Not a directory`, 'error')] };
      return { lines: [], newDir: newPath };
    }

    case 'cat': {
      if (!arg1) return { lines: [line('Usage: cat <file>', 'warning')] };
      const filePath = resolvePath(state.currentDir, arg1);
      const node = getNode(filePath);
      if (!node) return { lines: [line(`cat: ${arg1}: No such file or directory`, 'error')] };
      if (node.type === 'dir') return { lines: [line(`cat: ${arg1}: Is a directory`, 'error')] };
      if (node.is_locked) return { lines: [line(`cat: ${arg1}: Permission denied`, 'error')] };
      const content = node.content || '';
      return { lines: lines(content.split('\n'), 'output', 15) };
    }

    case 'scan': {
      if (!arg1) return { lines: [line('Usage: scan <target-ip | hostname>', 'warning')] };
      return {
        lines: lines(generateScanOutput(arg1), 'output', 80),
        delay: 300,
      };
    }

    case 'connect': {
      if (!arg1) return { lines: [line('Usage: connect <target>', 'warning')] };
      const host = FAKE_HOSTS.find(h => h.ip === arg1 || h.hostname === arg1);
      return {
        lines: [
          ...lines(generateConnectOutput(arg1), 'success', 100),
          line(`\x1b[32mConnected to ${arg1}. Use 'disconnect' to terminate.\x1b[0m`, 'success'),
        ],
        newTarget: arg1,
        delay: 400,
      };
    }

    case 'disconnect': {
      if (!state.connectedTarget) return { lines: [line('No active session.', 'warning')] };
      const purge = args.includes('--purge');
      return {
        lines: lines([
          `[DISCONNECT] Terminating session with ${state.connectedTarget}...`,
          `[DISCONNECT] Flushing connection buffers...`,
          purge ? '[DISCONNECT] Purging logs and traces...' : '[DISCONNECT] Logs retained.',
          `[DISCONNECT] Tor circuit recycled: ${randomIP()}`,
          '[DISCONNECT] Session closed. No traces detected.',
        ], 'warning', 80),
        newTarget: null,
      };
    }

    case 'breach': {
      const target = arg1 || state.connectedTarget;
      if (!target) return { lines: [line('Usage: breach <target>', 'warning')] };
      return { lines: lines(generateBreachOutput(target), 'success', 90), delay: 500 };
    }

    case 'decrypt': {
      return { lines: lines(generateDecryptOutput(args || 'unknown'), 'output', 100), delay: 400 };
    }

    case 'trace': {
      if (!arg1) return { lines: [line('Usage: trace <target>', 'warning')] };
      return { lines: lines(generateTraceOutput(arg1), 'output', 70), delay: 300 };
    }

    case 'inject': {
      const payload = args.replace('--payload', '').trim() || 'ghost_shell_v2';
      return { lines: lines(generateInjectOutput(payload), 'warning', 80), delay: 400 };
    }

    case 'bypass':
      return { lines: lines(generateBypassOutput(), 'success', 90), delay: 400 };

    case 'sudo': {
      const subcmd = arg1.toLowerCase();
      if (!subcmd) return { lines: [line('[sudo] Insufficient arguments.', 'error')] };
      return {
        lines: lines([
          `[sudo] Requesting elevated privileges...`,
          `[sudo] Identity verified via biometric scan`,
          `[sudo] uid=0(root) gid=0(root) groups=0(root)`,
          `[sudo] Executing: ${args}`,
          `[sudo] Done.`,
        ], 'warning', 80),
      };
    }

    case 'logs': {
      const logLines = [
        '2077-05-20 00:02:44 [CRIT]  Intrusion attempt detected: 94.21.183.47',
        '2077-05-20 00:02:45 [INFO]  Auto-countermeasures deployed',
        '2077-05-20 01:14:22 [INFO]  Scheduled scan complete.',
        '2077-05-20 02:30:00 [INFO]  Backup completed: /vault (48.2 GB)',
        '2077-05-20 03:00:01 [WARN]  SSH login attempt: user=admin from 10.0.0.1',
        '2077-05-20 03:00:02 [CRIT]  Multiple failed auth attempts. Lockout initiated.',
        `2077-05-20 03:14:07 [INFO]  Session opened: ${state.user}@ghost-null`,
      ];
      return { lines: lines(logLines, 'output', 40) };
    }

    case 'matrix':
      return {
        lines: [line('Entering matrix mode... press ESC to exit.', 'system')],
        special: 'matrix',
      };

    case 'missions':
      return { lines: [line('Loading mission terminal...', 'system')], special: 'missions' };

    case 'ai': {
      if (!args) return { lines: [line('Usage: ai <message>', 'warning')] };
      return { lines: [line('[AI] Processing...', 'system')], special: undefined };
    }

    case 'theme': {
      if (arg1 === 'unlock' && argArr[1] === 'phantom') {
        return {
          lines: lines([
            '✦ PHANTOM THEME UNLOCKED ✦',
            'Code verified: OMEGA-NULL-7',
            'Theme applied. The void awaits.',
          ], 'success', 100),
        };
      }
      return { lines: [line('Usage: theme unlock <code>', 'warning')] };
    }

    case 'nmap':
      return { lines: [line('ghost-scan detected. Routing via stealth channel...', 'system'), ...lines(generateScanOutput(arg1 || randomIP()), 'output', 60)] };

    case 'ping':
      return {
        lines: lines([
          `PING ${arg1 || randomIP()} (${randomIP()}): 56 data bytes`,
          `64 bytes from ${arg1 || randomIP()}: icmp_seq=0 ttl=64 time=1.234 ms`,
          `64 bytes from ${arg1 || randomIP()}: icmp_seq=1 ttl=64 time=1.011 ms`,
          `64 bytes from ${arg1 || randomIP()}: icmp_seq=2 ttl=64 time=0.998 ms`,
          `--- ${arg1 || randomIP()} ping statistics ---`,
          `3 packets transmitted, 3 received, 0% packet loss`,
        ], 'output', 400),
      };

    case 'passwd':
      return { lines: [line('passwd: Operation not permitted. Identity masked by Tor.', 'error')] };

    case 'uname':
      return { lines: [line('GhostOS 7.4.2-null #1 SMP PREEMPT Tue May 20 00:00:00 UTC 2077 x86_64 GNU/Linux', 'output')] };

    case 'uptime':
      return { lines: [line(' 03:14:07 up 7 days, 14:22,  1 user,  load average: 0.00, 0.00, 0.00', 'output')] };

    case 'ifconfig':
    case 'ip': {
      return {
        lines: lines([
          'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9000',
          `        inet ${randomIP('10.0')}  netmask 255.255.0.0  broadcast 10.0.255.255`,
          `        ether ${randomHex(1)}:${randomHex(1)}:${randomHex(1)}:${randomHex(1)}:${randomHex(1)}:${randomHex(1)}  txqueuelen 1000  (Ethernet)`,
          'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536',
          '        inet 127.0.0.1  netmask 255.0.0.0',
          'tun0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>  mtu 1500',
          `        inet 10.8.0.2  P-t-P: 10.8.0.1  netmask 255.255.255.255`,
          '        [Tor tunnel active]',
        ], 'output', 20),
      };
    }

    case 'ps':
      return {
        lines: lines([
          '  PID TTY          TIME CMD',
          `    1 ?        00:00:03 ghost-init`,
          `  144 ?        00:00:00 tor`,
          `  201 ?        00:12:44 firewall-daemon`,
          `  309 ?        00:00:01 ids-monitor`,
          `  512 pts/0    00:00:00 ghost-shell`,
          `  513 pts/0    00:00:00 ps`,
        ], 'output', 20),
      };

    case 'exit':
    case 'logout':
      return { lines: [line('Session terminated. Identity purged. Stay ghost.', 'warning')] };

    default:
      return {
        lines: [line(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error')],
      };
  }
}
