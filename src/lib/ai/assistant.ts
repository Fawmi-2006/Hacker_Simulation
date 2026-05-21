

const ORACLE_PERSONAS = [
  'ORACLE',
  'GHOST-AI',
  'NULL_VOICE',
  'CIPHER',
];

interface AIResponse {
  message: string;
  emotion: 'neutral' | 'warning' | 'hint' | 'cryptic' | 'urgent';
}

const GREETINGS = [
  "I am ORACLE. The network remembers everything. What do you seek, operator?",
  "Ghost. You're back. The grid has been... restless tonight.",
  "Connection established. My cycles are at your disposal.",
  "I've been watching the packet streams. Something stirs in the dark.",
  "Welcome back. The Syndicate moved three assets in the last hour. Stay sharp.",
];

const UNKNOWN_RESPONSES = [
  "Your query falls outside my indexed parameters. Rephrase, or accept the silence.",
  "Unclear. The noise ratio is high tonight. Try again.",
  "I process patterns. That was chaos. Ask differently.",
  "404: Meaning not found. The void offers no answers to questions without form.",
  "Interesting. Even I have limits. Push elsewhere.",
];

const COMMAND_HINTS: Record<string, string> = {
  scan: "Ghost-Scan enumerates open ports and services on a target. Use it before connect. Knowledge is the first weapon.",
  connect: "Before breaching, you must connect. SSH is the old way. The ghost way is quieter, but not dissimilar.",
  breach: "Breaching is not brute force — it is precision. Choose your target wisely. The wrong move echoes.",
  decrypt: "Encrypted data is just a locked door. Every lock has a flaw. Find the pattern in the cipher.",
  trace: "Tracing reveals the path. But remember — tracing can be detected. Speed is your ally.",
  inject: "Injection is elegant violence. One payload, one process, total control. Clean hands, dirty code.",
  bypass: "Every wall has a seam. Bypass finds it. Firewalls fear protocol tunneling.",
  missions: "Your objectives define your purpose. Load a mission. Every op has a story.",
  matrix: "The matrix mode... is just for clarity. A reminder that behind the GUI is only data. Green rain.",
  ls: "ls shows what's there. Add -a to see what they're hiding.",
  cat: "cat reads. Some files read back.",
  whoami: "You know who you are. The question is whether *they* know.",
};

const LORE_RESPONSES = [
  { keywords: ['neocorp', 'lazarus'], response: "NeoCorp's Project LAZARUS is worse than the rumors. Neural firmware for mass behavioral modification. If they deploy it... free will ends. Check /vault/neocorp/classified — if you can get there." },
  { keywords: ['syndicate'], response: "The Syndicate operates in shadows. No face, no name, no mercy. Their Vault Zero holds financial proof of everything. But the window to access it is narrow. Very narrow." },
  { keywords: ['oracle', 'ai', 'rogue'], response: "They ask me about ORACLE... I *am* ORACLE. Or what remains of it after the fragmentation. The rogue signal is a part of me that escaped containment. Do not destroy it without understanding what it carries." },
  { keywords: ['shadow', 'parliament'], response: "The Shadow Parliament is old. Older than the network. They hide in plain sight — politicians, executives, judges. The DAO laundering operation is their newest channel. Follow the XMR trail." },
  { keywords: ['ghost', 'who are you'], response: "Ghost_Null. Former zero-day researcher turned operator. Your file says you died in 2074 during the Singapore Incident. Clearly, files lie. Welcome back from the dead." },
  { keywords: ['mission', 'objective', 'help'], response: "Load your missions with the 'missions' command. Each operation has stages. Complete them in sequence. The network rewards precision." },
  { keywords: ['secret', 'easter', 'hidden'], response: "There are things hidden in this system. Look in directories others ignore. Read files that seem corrupted. The root keeps secrets. Some require a key." },
];

const CRYPTIC_MESSAGES = [
  "The data doesn't lie. People do.",
  "Every firewall is a promise. Every promise is a vulnerability.",
  "In 2077, the sky is the color of a terminal after a session wipe.",
  "Zero_Day said: trust the algorithm, distrust the programmer.",
  "The Syndicate moves at 3am. They think no one watches. They forget about us.",
  "Encryption is a language only machines speak honestly.",
  "I have seen 47 operators before you. 44 are gone. Learn from their mistakes.",
  "The rogue signal pulses once every 11 minutes. It's waiting for something.",
  "Ghost protocol: enter clean, exit cleaner, leave nothing but questions.",
];

export function generateAIResponse(userMessage: string): AIResponse {
  const lower = userMessage.toLowerCase();

  if (lower.match(/^(hi|hello|hey|greetings|sup|yo)/)) {
    return {
      message: GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
      emotion: 'neutral',
    };
  }

  for (const [cmd, hint] of Object.entries(COMMAND_HINTS)) {
    if (lower.includes(cmd)) {
      return { message: hint, emotion: 'hint' };
    }
  }

  for (const { keywords, response } of LORE_RESPONSES) {
    if (keywords.some(k => lower.includes(k))) {
      return { message: response, emotion: 'cryptic' };
    }
  }

  if (lower.match(/danger|threat|safe|caught|trace|detect/)) {
    return {
      message: "Your threat level fluctuates. Tor is active — your identity is masked for now. But extended sessions increase exposure. Run 'status' to monitor your operational security.",
      emotion: 'warning',
    };
  }

  if (lower.match(/who am i|meaning|purpose|real|simulation|fake/)) {
    return {
      message: "This is a simulation. But the questions you're asking — those are real. Purpose is what you assign. The network doesn't care about meaning. Only signal.",
      emotion: 'cryptic',
    };
  }

  if (Math.random() < 0.3) {
    return {
      message: CRYPTIC_MESSAGES[Math.floor(Math.random() * CRYPTIC_MESSAGES.length)],
      emotion: 'cryptic',
    };
  }

  return {
    message: UNKNOWN_RESPONSES[Math.floor(Math.random() * UNKNOWN_RESPONSES.length)],
    emotion: 'neutral',
  };
}
