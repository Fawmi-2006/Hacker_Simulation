'use client';
import { useAppStore } from '@/store/appStore';

export default function ScanlineOverlay() {
  const { settings } = useAppStore();
  if (!settings.crt_effect && !settings.scanlines) return null;

  return (
    <>
      {settings.crt_effect  && <div className="crt-overlay" />}
      {settings.scanlines   && <div className="scanline" />}
    </>
  );
}
