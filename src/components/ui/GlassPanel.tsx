'use client';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  color?: 'green' | 'cyan' | 'red' | 'purple';
  noPadding?: boolean;
}

export default function GlassPanel({
  children, className, color = 'green', noPadding, ...props
}: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'rounded-sm relative overflow-hidden',
        color === 'green'  && 'glass-panel',
        color === 'cyan'   && 'glass-panel-cyan',
        color === 'red'    && 'bg-red-950/10 border border-neon-red/20',
        color === 'purple' && 'bg-purple-950/10 border border-neon-purple/20',
        !noPadding && 'p-4',
        className
      )}
      {...props}
    >
      {}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-60" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-60" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-60" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-60" />
      {children}
    </motion.div>
  );
}
