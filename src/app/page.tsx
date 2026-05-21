'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import ParticleBackground from '@/components/ui/ParticleBackground';
import GlitchText from '@/components/ui/GlitchText';
import NeonButton from '@/components/ui/NeonButton';
import { Lock, Eye, EyeOff, UserPlus, LogIn, AtSign, User } from 'lucide-react';

const BOOT_MESSAGES = [
  'Initializing Ghost OS v7.4.2...',
  'Loading cryptographic modules...',
  'Establishing Tor circuit...',
  'Spoofing network identity...',
  'Firewall activated [2847 rules]',
  'IDS evasion protocols loaded...',
  'System ready. Authenticate.',
];

const REGISTER_SEQUENCE = [
  { text: 'Initializing identity matrix...', delay: 0 },
  { text: 'Generating cryptographic keypair...', delay: 600 },
  { text: 'Registering node on mesh network...', delay: 1200 },
  { text: 'Encrypting credentials [AES-256]...', delay: 1900 },
  { text: 'Allocating virtual filesystem...', delay: 2500 },
  { text: 'Assigning operator handle...', delay: 3000 },
  { text: 'ACCESS GRANTED — Welcome to the grid.', delay: 3600 },
];

function CyberInput({
  label, icon, value, onChange, type = 'text',
  placeholder, fieldError, autoFocus, rightSlot,
}: {
  label: string; icon: React.ReactNode; value: string;
  onChange: (v: string) => void; type?: string; placeholder?: string;
  fieldError?: boolean; autoFocus?: boolean; rightSlot?: React.ReactNode;
}) {
  const borderCls = fieldError
    ? 'border-neon-red focus:border-neon-red'
    : 'border-neon-green/30 focus:border-neon-green';
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs text-gray-600 mb-1 tracking-widest uppercase">
        <span className="text-neon-green/50">{icon}</span> {label}
      </label>
      <div className="relative">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          className={`w-full bg-transparent border ${borderCls} text-neon-green font-mono text-sm px-3 py-2 ${rightSlot ? 'pr-10' : ''} focus:outline-none transition-colors placeholder:text-gray-700`}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {fieldError && (
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          className="h-px bg-neon-red mt-0.5"
          style={{ boxShadow: '0 0 4px #ff0040' }}
        />
      )}
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const score = (() => {
    let s = 0;
    if (password.length >= 8)          s++;
    if (password.length >= 12)         s++;
    if (/[A-Z]/.test(password))        s++;
    if (/[0-9]/.test(password))        s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return Math.min(s, 5);
  })();
  const labels = ['WEAK', 'WEAK', 'MODERATE', 'STRONG', 'STRONG', 'HARDENED'];
  const colors = ['#ff0040', '#ff0040', '#ff8c00', '#00f5ff', '#00f5ff', '#00ff41'];
  const widths = ['20%', '30%', '50%', '70%', '85%', '100%'];
  return (
    <div className="space-y-1">
      <div className="h-0.5 bg-gray-800 overflow-hidden">
        <motion.div
          animate={{ width: widths[score] }}
          transition={{ duration: 0.3 }}
          className="h-full"
          style={{ backgroundColor: colors[score], boxShadow: `0 0 4px ${colors[score]}` }}
        />
      </div>
      <p className="text-[10px] font-mono text-right" style={{ color: colors[score] }}>
        {labels[score]}
      </p>
    </div>
  );
}

function RegistrationSequence({ username, onDone }: { username: string; onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = REGISTER_SEQUENCE.map((item, i) =>
      setTimeout(() => {
        setStep(i + 1);
        if (i === REGISTER_SEQUENCE.length - 1) {
          setTimeout(onDone, 1200);
        }
      }, item.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-panel rounded-sm p-6 space-y-1 font-mono text-xs"
    >
      <p className="text-neon-cyan text-sm font-cyber tracking-widest mb-4">
        NEW OPERATOR: <span className="text-neon-green">{username.toUpperCase()}</span>
      </p>
      {REGISTER_SEQUENCE.slice(0, step).map((item, i) => {
        const isLast = i === REGISTER_SEQUENCE.length - 1;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-2 ${isLast ? 'text-neon-green font-bold' : 'text-gray-400'}`}
          >
            <span className="text-neon-cyan/60">[OK]</span>
            <span>{item.text}</span>
            {isLast && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="text-neon-green"
              >
                ▌
              </motion.span>
            )}
          </motion.div>
        );
      })}
      <div className="pt-3">
        <div className="h-0.5 bg-neon-green/10 overflow-hidden">
          <motion.div
            className="h-full bg-neon-green"
            style={{ boxShadow: '0 0 6px #00ff41' }}
            initial={{ width: '0%' }}
            animate={{ width: `${(step / REGISTER_SEQUENCE.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const { setUser } = useAppStore();
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [unlocking, setUnlocking] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError('CREDENTIALS REQUIRED'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'AUTH FAILED'); setLoading(false); return; }
      setUnlocking(true);
      setTimeout(() => { setUser(data.user, data.token); router.push('/dashboard'); }, 1200);
    } catch {
      setError('CONNECTION ERROR');
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3 }}
      className={`glass-panel rounded-sm p-8 ${unlocking ? 'animate-pulse-neon' : ''}`}
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border border-neon-green/30 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Lock size={24} className="text-neon-green" style={{ filter: 'drop-shadow(0 0 6px #00ff41)' }} />
        </motion.div>
        <GlitchText text="GHOST OS" size="2xl" className="block mb-1" />
        <p className="text-gray-600 text-xs tracking-widest">SECURE TERMINAL v7.4.2</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <CyberInput label="Operator ID" icon={<User size={10} />}
          value={username} onChange={setUsername} placeholder="ghost" autoFocus />

        <CyberInput label="Access Key" icon={<Lock size={10} />}
          value={password} onChange={setPassword}
          type={showPass ? 'text' : 'password'} placeholder="••••••••"
          rightSlot={
            <button type="button" onClick={() => setShowPass(p => !p)}
              className="text-gray-600 hover:text-neon-green transition-colors">
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          }
        />

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-neon-red text-xs font-mono text-center py-1"
              style={{ textShadow: '0 0 8px #ff0040' }}>
              ⚠ {error}
            </motion.p>
          )}
        </AnimatePresence>

        {unlocking && (
          <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }}
            className="h-0.5 bg-neon-green" style={{ boxShadow: '0 0 8px #00ff41' }} />
        )}

        <NeonButton type="submit" loading={loading || unlocking}
          className="w-full justify-center" icon={<LogIn size={14} />}>
          {unlocking ? 'UNLOCKING...' : 'AUTHENTICATE'}
        </NeonButton>
      </form>

      <div className="mt-5 pt-4 border-t border-neon-green/10 text-center">
        <p className="text-gray-600 text-xs font-mono mb-2">No operator profile?</p>
        <button onClick={onSwitch}
          className="text-neon-cyan text-xs font-mono hover:text-neon-green transition-colors flex items-center gap-1.5 mx-auto">
          <UserPlus size={12} /> Register new identity
        </button>
      </div>
      <p className="text-center text-gray-700 text-xs mt-3 font-mono">Default: ghost / ghost2077</p>
    </motion.div>
  );
}

function SignupForm({ onSwitch, onSuccess }: {
  onSwitch: () => void;
  onSuccess: (username: string, user: unknown, token: string) => void;
}) {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [fe, setFe]             = useState<Record<string, boolean>>({});

  const clearFe = (key: string) => setFe(p => ({ ...p, [key]: false }));

  const validate = (): string | null => {
    const next: Record<string, boolean> = {};
    if (!username || username.length < 3 || !/^[a-zA-Z0-9_\-]+$/.test(username)) next.username = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))  next.email    = true;
    if (!password || password.length < 8)                       next.password = true;
    if (password !== confirm)                                   next.confirm  = true;
    setFe(next);
    if (next.username) return 'Username: 3–32 chars, letters/numbers/_ only';
    if (next.email)    return 'Valid email required';
    if (next.password) return 'Password must be at least 8 characters';
    if (next.confirm)  return 'Passwords do not match';
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const validErr = validate();
    if (validErr) { setError(validErr); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.field) setFe(p => ({ ...p, [data.field]: true }));
        setError(data.error || 'REGISTRATION FAILED');
        setLoading(false);
        return;
      }
      onSuccess(username, data.user, data.token);
    } catch {
      setError('CONNECTION ERROR');
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-sm p-8"
    >
      <div className="text-center mb-6">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-14 h-14 border border-neon-cyan/40 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ boxShadow: '0 0 20px rgba(0,245,255,0.15)' }}
        >
          <UserPlus size={22} className="text-neon-cyan" style={{ filter: 'drop-shadow(0 0 6px #00f5ff)' }} />
        </motion.div>
        <GlitchText text="NEW IDENTITY" size="xl" className="block mb-1 text-neon-cyan" />
        <p className="text-gray-600 text-xs tracking-widest">CREATE OPERATOR PROFILE</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-3">
        <CyberInput label="Operator ID" icon={<User size={10} />}
          value={username} onChange={v => { setUsername(v); clearFe('username'); }}
          placeholder="ghost_runner" fieldError={fe.username} autoFocus />

        <CyberInput label="Signal Address" icon={<AtSign size={10} />}
          value={email} onChange={v => { setEmail(v); clearFe('email'); }}
          type="email" placeholder="null@dark.net" fieldError={fe.email} />

        <CyberInput label="Access Key" icon={<Lock size={10} />}
          value={password} onChange={v => { setPassword(v); clearFe('password'); }}
          type={showPass ? 'text' : 'password'} placeholder="min. 8 characters"
          fieldError={fe.password}
          rightSlot={
            <button type="button" onClick={() => setShowPass(p => !p)}
              className="text-gray-600 hover:text-neon-green transition-colors">
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          }
        />

        {password.length > 0 && <PasswordStrength password={password} />}

        <CyberInput label="Confirm Key" icon={<Lock size={10} />}
          value={confirm} onChange={v => { setConfirm(v); clearFe('confirm'); }}
          type={showPass ? 'text' : 'password'} placeholder="••••••••"
          fieldError={fe.confirm} />

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-neon-red text-xs font-mono text-center py-1"
              style={{ textShadow: '0 0 8px #ff0040' }}>
              ⚠ {error}
            </motion.p>
          )}
        </AnimatePresence>

        <NeonButton type="submit" color="cyan" loading={loading}
          className="w-full justify-center" icon={<UserPlus size={14} />}>
          REGISTER IDENTITY
        </NeonButton>
      </form>

      <div className="mt-5 pt-4 border-t border-neon-cyan/10 text-center">
        <p className="text-gray-600 text-xs font-mono mb-2">Already have a profile?</p>
        <button onClick={onSwitch}
          className="text-neon-green text-xs font-mono hover:text-neon-cyan transition-colors flex items-center gap-1.5 mx-auto">
          <LogIn size={12} /> Sign in instead
        </button>
      </div>
    </motion.div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { setUser, isAuthenticated } = useAppStore();

  const [mode, setMode]         = useState<'login' | 'signup'>('login');
  const [bootIdx, setBootIdx]   = useState(0);
  const [bootDone, setBootDone] = useState(false);
  const [registering, setRegistering]     = useState(false);
  const [registerUsername, setRegisterUsername] = useState('');
  const [pendingAuth, setPendingAuth]     = useState<{ user: unknown; token: string } | null>(null);

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (bootIdx < BOOT_MESSAGES.length) {
      const t = setTimeout(() => setBootIdx(i => i + 1), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBootDone(true), 300);
    return () => clearTimeout(t);
  }, [bootIdx]);

  const handleSignupSuccess = (username: string, user: unknown, token: string) => {
    setRegisterUsername(username);
    setPendingAuth({ user, token });
    setRegistering(true);
  };

  const handleRegistrationDone = () => {
    if (pendingAuth) {
      setUser(pendingAuth.user as Parameters<typeof setUser>[0], pendingAuth.token);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="scanline" />
      <div className="crt-overlay" />

      <div className="relative z-10 w-full max-w-md px-4">
        <AnimatePresence>
          {!bootDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel rounded-sm p-4 mb-6 font-mono text-xs text-neon-green/60 space-y-1"
            >
              {BOOT_MESSAGES.slice(0, bootIdx).map((msg, i) => (
                <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2">
                  <span className="text-neon-cyan">[OK]</span> {msg}
                </motion.p>
              ))}
              <span className="cursor-blink" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {bootDone && !registering && mode === 'login' && (
            <LoginForm key="login" onSwitch={() => setMode('signup')} />
          )}
          {bootDone && !registering && mode === 'signup' && (
            <SignupForm key="signup" onSwitch={() => setMode('login')} onSuccess={handleSignupSuccess} />
          )}
          {bootDone && registering && (
            <RegistrationSequence key="registering" username={registerUsername} onDone={handleRegistrationDone} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

