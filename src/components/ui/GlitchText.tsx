'use client';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface GlitchTextProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  color?: string;
}

export default function GlitchText({ text, className, size = 'lg', color }: GlitchTextProps) {
  const sizeClass = {
    sm: 'text-sm', md: 'text-base', lg: 'text-lg',
    xl: 'text-xl', '2xl': 'text-2xl', '4xl': 'text-4xl',
  }[size];

  return (
    <span
      className={clsx('glitch font-cyber font-bold', sizeClass, className)}
      data-text={text}
      style={color ? { color } : undefined}
    >
      {text}
    </span>
  );
}
