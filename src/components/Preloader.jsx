import React, { useEffect, useRef, useState } from 'react';
import { useIsFetching } from '@tanstack/react-query';

export default function Preloader({ isActive = true, minVisibleMs = 3500 }) {
  const isFetching = useIsFetching();
  const [progress, setProgress] = useState(0);
  const [windowLoaded, setWindowLoaded] = useState(
    typeof document !== 'undefined' && document.readyState === 'complete'
  );
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const intervalRef = useRef(null);
  const mountedAtRef = useRef(typeof performance !== 'undefined' ? performance.now() : Date.now());
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'WELCOME';
  const textTimerRef = useRef(null);

  // Increment progress towards 90% while loading
  useEffect(() => {
    if (!visible || !isActive) return;

    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const target = 90;
        if (p >= target) return p;
        // Ease: big steps early, smaller later
        const step = Math.max(1, Math.floor((target - p) / 8));
        return Math.min(target, p + step);
      });
    }, 120);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, isActive]);

  // Listen for window load (all static resources loaded)
  useEffect(() => {
    const onLoad = () => setWindowLoaded(true);
    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        setWindowLoaded(true);
      } else {
        window.addEventListener('load', onLoad);
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', onLoad);
      }
    };
  }, []);

  // When fully ready: set to 100% and fade out overlay
  useEffect(() => {
    if (!visible || !isActive) return;
    const instagramLoading = typeof window !== 'undefined' && window.__instagramLoading === true;
    const allReady = windowLoaded && isFetching === 0 && !instagramLoading;
    if (allReady) {
      // Snap to 100 with a quick tick
      setProgress(100);
      // Respect minimum visible time (3.5s default)
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const elapsed = now - mountedAtRef.current;
      const remaining = Math.max(0, minVisibleMs - elapsed);
      const t = setTimeout(() => {
        setFadeOut(true);
        const t2 = setTimeout(() => setVisible(false), 700);
        return () => clearTimeout(t2);
      }, remaining);
      return () => clearTimeout(t);
    }
  }, [windowLoaded, isFetching, visible, isActive, minVisibleMs]);

  // Disable body scroll while preloader is visible
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (visible && isActive) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }
    return () => body.classList.remove('overflow-hidden');
  }, [visible, isActive]);

  // Letter-by-letter animation for the welcome text
  useEffect(() => {
    if (!visible || !isActive) return;
    let i = 0;
    setDisplayedText('');
    const stepMs = Math.ceil(minVisibleMs / Math.max(6, fullText.length));
    textTimerRef.current = setInterval(() => {
      i += 1;
      setDisplayedText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(textTimerRef.current);
      }
    }, stepMs);
    return () => {
      if (textTimerRef.current) clearInterval(textTimerRef.current);
    };
  }, [visible, isActive, minVisibleMs]);

  if (!visible || !isActive) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text-center">
        <div className="text-white font-extrabold tracking-wide text-5xl sm:text-6xl md:text-7xl">
          {displayedText}
        </div>
        <div className="mt-6 text-white text-lg sm:text-xl md:text-2xl">
          Loading {progress}%
        </div>
      </div>
    </div>
  );
}
