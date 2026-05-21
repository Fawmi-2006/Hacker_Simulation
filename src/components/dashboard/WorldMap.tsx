'use client';
import { useEffect, useRef, useState } from 'react';
import GlassPanel from '@/components/ui/GlassPanel';
import { randomIP } from '@/lib/terminal/simulator';

interface MapNode {
  x: number; y: number;
  ip: string; active: boolean;
}

const BASE_NODES: Omit<MapNode, 'ip' | 'active'>[] = [
  { x: 23, y: 38 }, 
  { x: 19, y: 37 }, 
  { x: 48, y: 33 }, 
  { x: 50, y: 35 }, 
  { x: 52, y: 32 }, 
  { x: 78, y: 36 }, 
  { x: 82, y: 45 }, 
  { x: 76, y: 60 }, 
  { x: 55, y: 55 }, 
  { x: 48, y: 63 }, 
  { x: 63, y: 65 }, 
  { x: 27, y: 55 }, 
];

export default function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes] = useState<MapNode[]>(() =>
    BASE_NODES.map(n => ({ ...n, ip: randomIP(), active: Math.random() > 0.3 }))
  );
  const [connections, setConnections] = useState<[number, number][]>([]);

  useEffect(() => {
    
    const id = setInterval(() => {
      const a = Math.floor(Math.random() * nodes.length);
      const b = Math.floor(Math.random() * nodes.length);
      if (a !== b) setConnections([...Array(3)].map(() => [
        Math.floor(Math.random() * nodes.length),
        Math.floor(Math.random() * nodes.length),
      ] as [number, number]));
    }, 2000);
    return () => clearInterval(id);
  }, [nodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    for (const [a, b] of connections) {
      if (!nodes[a] || !nodes[b]) continue;
      const ax = (nodes[a].x / 100) * W;
      const ay = (nodes[a].y / 100) * H;
      const bx = (nodes[b].x / 100) * W;
      const by = (nodes[b].y / 100) * H;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = 'rgba(0,245,255,0.25)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (const node of nodes) {
      const x = (node.x / 100) * W;
      const y = (node.y / 100) * H;
      const color = node.active ? '#00ff41' : '#333';

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [nodes, connections]);

  return (
    <GlassPanel color="cyan" className="relative overflow-hidden">
      <h3 className="text-xs font-cyber tracking-widest text-gray-500 mb-2">GLOBAL NETWORK</h3>

      {}
      <div className="relative">
        {}
        <svg
          viewBox="0 0 400 200"
          className="w-full opacity-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {}
          <ellipse cx="200" cy="100" rx="198" ry="98" stroke="#00f5ff" strokeWidth="0.5"/>
          {}
          <path d="M 60 50 Q 80 40 100 55 Q 110 70 95 85 Q 80 90 70 80 Z" stroke="#00f5ff" strokeWidth="0.5"/>
          {}
          <path d="M 170 45 Q 200 40 220 50 Q 215 65 200 68 Q 185 65 175 55 Z" stroke="#00f5ff" strokeWidth="0.5"/>
          {}
          <path d="M 230 40 Q 300 35 340 55 Q 345 80 320 90 Q 280 95 240 80 Q 225 65 230 40 Z" stroke="#00f5ff" strokeWidth="0.5"/>
          {}
          <path d="M 185 75 Q 210 70 220 90 Q 220 130 200 140 Q 185 135 180 115 Q 178 90 185 75 Z" stroke="#00f5ff" strokeWidth="0.5"/>
          {}
          <path d="M 95 90 Q 120 85 130 110 Q 128 145 115 155 Q 100 150 92 130 Q 88 110 95 90 Z" stroke="#00f5ff" strokeWidth="0.5"/>
          {}
          <path d="M 295 115 Q 340 110 345 135 Q 340 155 310 155 Q 290 148 292 130 Z" stroke="#00f5ff" strokeWidth="0.5"/>
        </svg>

        {}
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="absolute inset-0 w-full h-full"
        />

        {}
        <div className="absolute bottom-1 right-1 text-[10px] font-mono text-neon-cyan/60">
          {nodes.filter(n => n.active).length} NODES ACTIVE
        </div>
      </div>
    </GlassPanel>
  );
}
