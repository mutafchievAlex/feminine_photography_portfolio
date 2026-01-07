import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsFetching } from '@tanstack/react-query';

export default function Preloader({ minVisibleMs = 1000, onExitStart = () => {}, onComplete = () => {} }) {
  const isFetching = useIsFetching();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const navEntry = typeof performance !== 'undefined' && performance.getEntriesByType
    ? performance.getEntriesByType('navigation')[0]
    : null;
  const legacyNavType = typeof performance !== 'undefined' && performance.navigation ? performance.navigation.type : 0;
  const isReload = (navEntry && navEntry.type === 'reload') || legacyNavType === 1;
  const isHomePath = path === '/' || path === '/homepage';
  const isFullOverlay = isHomePath && isReload;
  const intervalRef = useRef(null);
  const exitTimeoutRef = useRef(null);
  const mountedAtRef = useRef(typeof performance !== 'undefined' ? performance.now() : Date.now());
  const fullText = 'WELCOME';

  // Increment progress towards 90% while loading
  useEffect(() => {
    if (!visible) return;

    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const target = 90;
        if (p >= target) return p;
        const step = Math.max(1, Math.floor((target - p) / 8));
        return Math.min(target, p + step);
      });
    }, 120);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible]);

  // Trigger exit once data is ready and min time passed
  useEffect(() => {
    if (!visible) return;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsed = now - mountedAtRef.current;
    const remaining = Math.max(0, minVisibleMs - elapsed);

    const ready = isFetching === 0;
    if (ready) {
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);

      exitTimeoutRef.current = setTimeout(() => {
        setProgress(100);
        onExitStart();
        setIsExiting(true);
        setTimeout(() => {
          setVisible(false);
          onComplete();
        }, 600);
      }, remaining);
    }

    return () => {
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, [visible, minVisibleMs, onComplete, isFetching]);

  // Force exit after absolute maximum time (8 seconds)
  useEffect(() => {
    if (!visible) return;

    const forceExitTimeout = setTimeout(() => {
      setProgress(100);
      onExitStart();
      setIsExiting(true);
      setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 600);
    }, 8000);

    return () => clearTimeout(forceExitTimeout);
  }, [visible, onComplete]);

  // Disable body scroll while preloader is visible
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (visible && isFullOverlay) {
      body.style.overflow = 'hidden';
      body.classList.add('overflow-hidden');
    } else {
      body.style.overflow = '';
      body.classList.remove('overflow-hidden');
    }
    return () => {
      body.style.overflow = '';
      body.classList.remove('overflow-hidden');
    };
  }, [visible, isFullOverlay]);

  if (!visible) return null;

  // Letter fall and roll-out variants
  const letterVariants = {
    hidden: { y: isFullOverlay ? -120 : -60, opacity: 0, rotate: isFullOverlay ? 0 : -6 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        delay: i * (isFullOverlay ? 0.08 : 0.05),
        duration: isFullOverlay ? 0.8 : 0.6,
        ease: [0.34, 1.56, 0.64, 1], // Spring-like easing
      },
    }),
    rollAway: (i) => ({
      y: isFullOverlay ? -80 : -40,
      opacity: 0,
      rotate: isFullOverlay ? 40 + i * 8 : 8 + i * 4,
      transition: { duration: isFullOverlay ? 0.55 : 0.4, ease: 'easeIn' },
    }),
  };

  // Container fade-out on exit (no slide)
  const containerVariants = {
    initial: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: { duration: isFullOverlay ? 0.8 : 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          variants={containerVariants}
          initial="initial"
          animate={isExiting ? 'exit' : 'initial'}
          exit="exit"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            width: '100vw',
            height: '100vh',
            backgroundColor: isFullOverlay ? 'black' : 'rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            pointerEvents: isFullOverlay ? 'auto' : 'none',
          }}
          aria-live="polite"
          aria-busy="true"
        >
          <div style={{ textAlign: 'center' }}>
            {/* Falling letters */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: isFullOverlay ? '8px' : '6px', marginBottom: isFullOverlay ? '32px' : '16px' }}>
              {fullText.split('').map((letter, i) => (
                <motion.div
                  key={`letter-${i}`}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate={isExiting ? 'rollAway' : 'visible'}
                  style={{
                    color: 'white',
                    fontWeight: 900,
                    letterSpacing: isFullOverlay ? '0.08em' : '0.06em',
                    fontSize: isFullOverlay ? 'clamp(5rem, 16vw, 9rem)' : 'clamp(3.5rem, 12vw, 6rem)',
                    display: 'inline-block',
                  }}
                >
                  {letter}
                </motion.div>
              ))}
            </div>

            {/* Progress indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                color: 'white',
                fontSize: isFullOverlay ? 'clamp(1rem, 3vw, 1.5rem)' : 'clamp(0.9rem, 2.5vw, 1.25rem)',
                fontWeight: 300,
                letterSpacing: '0.05em',
              }}
            >
              Loading {progress}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
