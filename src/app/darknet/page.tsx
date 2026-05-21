'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlitchText from '@/components/ui/GlitchText';
import GlassPanel from '@/components/ui/GlassPanel';
import type { DarknetListing, CryptoWallet } from '@/types';

const STATIC_LISTINGS: DarknetListing[] = [
  { id: 1, title: 'Zero-Day Bundle (3x exploits)', description: 'Three unpatched kernel vulnerabilities. Verified against latest firmware. No logs, clean delivery.', price_btc: 2.5, vendor: 'phantom_zero', category: 'zero-days' },
  { id: 2, title: 'Corporate Credential Dump', description: '14,000 verified credentials from Fortune 500 breach. Sorted by access level.', price_btc: 0.8, vendor: 'databroker_9', category: 'credentials' },
  { id: 3, title: 'Anonymous VPN Cluster', description: '6-month access to 120-node rotating VPN. No logs. Kill switch included.', price_btc: 0.12, vendor: 'darknet_infra', category: 'privacy' },
  { id: 4, title: 'Insider - NeoCorp Schematics', description: 'Full neural implant schematics. PCB layouts + firmware source. Leaked by insider.', price_btc: 4.0, vendor: 'insider_x', category: 'intel' },
  { id: 5, title: 'Monero Tumbler Service', description: 'Industrial-grade XMR tumbling. 99.9% chain analysis resistant. 0.5% fee.', price_btc: 0, vendor: 'wash_dao', category: 'finance' },
  { id: 6, title: 'Custom RAT + C2 Setup', description: 'Fully custom remote access trojan with encrypted C2. FUD guaranteed 30 days.', price_btc: 1.2, vendor: 'maldev_uk', category: 'tools' },
];

const STATIC_WALLETS: CryptoWallet[] = [
  { currency: 'BTC', address: '1GhostNullXkT9f7rPqW2Y5vMnBHjD4oXz', balance: 3.14159265 },
  { currency: 'XMR', address: '48ghXzK1r4NvMcWzpFdnTqBjXsGhYm7oLpR3vCaKdP2qWE1nSe', balance: 128.0 },
];

const CATEGORY_COLORS: Record<string, string> = {
  'zero-days':   '#ff0040',
  credentials:   '#ff8c00',
  privacy:       '#00f5ff',
  intel:         '#bf00ff',
  finance:       '#00ff41',
  tools:         '#0080ff',
};

export default function DarknetPage() {
  const [listings] = useState(STATIC_LISTINGS);
  const [wallets]  = useState(STATIC_WALLETS);
  const [filter, setFilter] = useState('all');
  const [btcPrice] = useState((Math.random() * 20000 + 40000).toFixed(2));

  const categories = ['all', ...Array.from(new Set(listings.map(l => l.category)))];
  const filtered   = filter === 'all' ? listings : listings.filter(l => l.category === filter);

  return (
    <div className="space-y-4 max-w-4xl">
      {}
      <div className="flex items-start justify-between">
        <div>
          <GlitchText text="DARKNET MARKET" size="xl" className="text-neon-purple block" />
          <p className="text-gray-600 text-xs font-mono mt-0.5">⚠ SIMULATION ONLY — All listings are fictional</p>
        </div>
        <GlassPanel color="purple" noPadding className="px-3 py-2 text-right">
          <p className="text-neon-purple text-xs font-mono">BTC/USD</p>
          <p className="text-neon-green font-cyber text-sm">${btcPrice}</p>
        </GlassPanel>
      </div>

      {}
      <GlassPanel color="purple">
        <h3 className="text-xs font-cyber tracking-widest text-gray-500 mb-3">CRYPTO WALLETS (FICTIONAL)</h3>
        <div className="space-y-2">
          {wallets.map(w => (
            <div key={w.currency} className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-neon-purple/10 last:border-0">
              <div>
                <span className="text-neon-purple font-bold">{w.currency}</span>
                <span className="text-gray-600 ml-3 text-[10px] truncate max-w-[200px] inline-block align-bottom">{w.address}</span>
              </div>
              <span className="text-neon-green">{w.balance.toFixed(8)}</span>
            </div>
          ))}
        </div>
      </GlassPanel>

      {}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 text-xs font-mono uppercase border transition-all ${
              filter === cat
                ? 'border-neon-purple text-neon-purple bg-neon-purple/10'
                : 'border-gray-700 text-gray-600 hover:border-neon-purple/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((l, i) => (
          <motion.div
            key={l.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel p-4 border border-neon-purple/10 hover:border-neon-purple/30 transition-colors cursor-default"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-neon-green text-sm font-mono font-bold leading-5">{l.title}</h4>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm border flex-shrink-0"
                style={{ color: CATEGORY_COLORS[l.category] || '#00ff41', borderColor: `${CATEGORY_COLORS[l.category]}44` || '#00ff4144' }}
              >
                {l.category}
              </span>
            </div>
            <p className="text-gray-500 text-xs leading-4 mb-3">{l.description}</p>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-600">Vendor: <span className="text-neon-cyan">{l.vendor}</span></span>
              <span className="text-neon-green font-bold">{l.price_btc > 0 ? `₿ ${l.price_btc}` : 'FREE'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-gray-700 text-xs font-mono py-4">
        ⚠ THIS IS A FICTIONAL SIMULATION. No real transactions, products, or services exist here.
      </p>
    </div>
  );
}
