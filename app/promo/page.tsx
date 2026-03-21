'use client'

import { useEffect, useState } from 'react'

export default function PromoPage() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    // Phase 0: black screen (already)
    // Phase 1: logo fades in
    const t1 = setTimeout(() => setPhase(1), 400)
    // Phase 2: logo pulses, title starts typing
    const t2 = setTimeout(() => setPhase(2), 1600)
    // Phase 3: full glow, scanlines visible
    const t3 = setTimeout(() => setPhase(3), 2800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div className="fixed inset-0 bg-sol-dark flex items-center justify-center overflow-hidden">
      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.15) 2px,
            rgba(0, 0, 0, 0.15) 4px
          )`,
        }}
      />

      {/* Ambient glow behind logo */}
      <div
        className="absolute transition-opacity duration-[2000ms]"
        style={{
          opacity: phase >= 2 ? 0.3 : 0,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(20, 241, 149, 0.4) 0%, rgba(20, 241, 149, 0.1) 30%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Secondary purple ambient glow */}
      <div
        className="absolute transition-opacity duration-[2500ms]"
        style={{
          opacity: phase >= 3 ? 0.2 : 0,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(153, 69, 255, 0.3) 0%, transparent 60%)',
          filter: 'blur(60px)',
          transform: 'translateY(60px)',
        }}
      />

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center">
        {/* Solana logo */}
        <div
          className="transition-all duration-[1200ms] ease-out"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
          }}
        >
          <div
            className={`text-8xl ${phase >= 2 ? 'animate-bounce-slow' : ''}`}
            style={{
              filter: phase >= 2 ? 'drop-shadow(0 0 20px rgba(20, 241, 149, 0.5))' : 'none',
              transition: 'filter 1s ease-in-out',
            }}
          >
            ◎
          </div>
        </div>

        {/* Title */}
        <div
          className="mt-8 transition-all duration-[1000ms] ease-out"
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <h1
            className="font-pixel text-3xl leading-relaxed tracking-wider"
            style={{
              color: '#14F195',
              textShadow: phase >= 3
                ? '0 0 10px rgba(20, 241, 149, 0.6), 0 0 30px rgba(20, 241, 149, 0.3), 0 0 60px rgba(20, 241, 149, 0.15)'
                : '0 0 10px rgba(20, 241, 149, 0.3)',
              transition: 'text-shadow 1.5s ease-in-out',
            }}
          >
            SOLANA
            <br />
            TRAIL
          </h1>
        </div>

        {/* Subtle tagline */}
        <div
          className="mt-6 transition-all duration-[1200ms] ease-out"
          style={{
            opacity: phase >= 3 ? 0.5 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          <p className="font-pixel text-[8px] text-sol-muted tracking-[0.3em] uppercase">
            Navigate the blockchain wilderness
          </p>
        </div>
      </div>

      {/* Floating particles */}
      {phase >= 3 && (
        <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                backgroundColor: i % 2 === 0 ? 'rgba(20, 241, 149, 0.3)' : 'rgba(153, 69, 255, 0.3)',
                left: `${15 + i * 14}%`,
                animation: `float-particle ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(40vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(35vh) scale(1);
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-40vh) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
