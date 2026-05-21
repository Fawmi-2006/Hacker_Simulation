'use client';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'green' | 'cyan' | 'red' | 'purple' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function NeonButton({
  children, color = 'green', size = 'md', loading, icon, className, ...props
}: NeonButtonProps) {
  const colorClass = {
    green:  'border-neon-green  text-neon-green  hover:bg-neon-green/10  hover:shadow-[0_0_15px_rgba(0,255,65,0.4)]',
    cyan:   'border-neon-cyan   text-neon-cyan   hover:bg-neon-cyan/10   hover:shadow-[0_0_15px_rgba(0,245,255,0.4)]',
    red:    'border-neon-red    text-neon-red    hover:bg-neon-red/10    hover:shadow-[0_0_15px_rgba(255,0,64,0.4)]',
    purple: 'border-neon-purple text-neon-purple hover:bg-neon-purple/10 hover:shadow-[0_0_15px_rgba(191,0,255,0.4)]',
    orange: 'border-neon-orange text-neon-orange hover:bg-neon-orange/10 hover:shadow-[0_0_15px_rgba(255,140,0,0.4)]',
  }[color];

  const sizeClass = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2',
    lg: 'text-base px-7 py-3',
  }[size];

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className={clsx(
        'neon-btn border font-mono uppercase tracking-widest transition-all duration-200',
        'flex items-center gap-2',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        colorClass, sizeClass, className
      )}
      disabled={loading || props.disabled}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {loading ? (
        <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </motion.button>
  );
}
