'use client'

import { useState, useEffect, useRef } from 'react'

export default function DreamCastle() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const heartIdRef = useRef(0)

  useEffect(() => {
    // Initialize audio context for musical notes (simple beep tones)
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio()
    }
  }, [])

  const playDreamTone = () => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Dream-like frequency (A4 = 440Hz, using a softer tone)
      oscillator.frequency.value = 528 // "Love frequency" or "Miracle tone"
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 1.5)
      
      setIsPlaying(true)
      setTimeout(() => setIsPlaying(false), 1500)
    }
  }

  const createHeart = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newHeart = {
      id: heartIdRef.current++,
      x,
      y,
    }
    
    setHearts(prev => [...prev, newHeart])
    
    // Remove heart after animation
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id))
    }, 2000)
  }

  const handleCastleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    playDreamTone()
    createHeart(e)
  }

  return (
    <div className="dream-castle-container">
      <div className="dream-castle" onClick={handleCastleClick}>
        {/* Castle structure */}
        <div className="castle-towers">
          {/* Left tower */}
          <div className="tower tower-left">
            <div className="tower-top">
              <div className="tower-flag">🟣</div>
            </div>
            <div className="tower-body"></div>
          </div>
          
          {/* Center main structure */}
          <div className="castle-main">
            <div className="castle-roof">
              <div className="roof-star">✨</div>
            </div>
            <div className="castle-body">
              <div className="castle-door">
                <div className="door-heart">♥️</div>
              </div>
              <div className="castle-windows">
                <div className="window">🌙</div>
                <div className="window">⭐</div>
              </div>
            </div>
          </div>
          
          {/* Right tower */}
          <div className="tower tower-right">
            <div className="tower-top">
              <div className="tower-flag">❇️</div>
            </div>
            <div className="tower-body"></div>
          </div>
        </div>
        
        {/* Sparkles floating around */}
        <div className="sparkles">
          <span className="sparkle sparkle-1">✨</span>
          <span className="sparkle sparkle-2">⭐</span>
          <span className="sparkle sparkle-3">✨</span>
          <span className="sparkle sparkle-4">💫</span>
          <span className="sparkle sparkle-5">✨</span>
        </div>
        
        {/* Musical notes */}
        {isPlaying && (
          <div className="music-notes">
            <span className="note note-1">🎵</span>
            <span className="note note-2">🎶</span>
            <span className="note note-3">🎵</span>
          </div>
        )}
        
        {/* Floating hearts */}
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="floating-heart"
            style={{ left: heart.x, top: heart.y }}
          >
            😘
          </div>
        ))}
      </div>
      
      <p className="castle-message">
        Klicke auf das Traumschloss für Musik & Liebe 🖖🏻
      </p>

      <style jsx>{`
        .dream-castle-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 20px;
          margin: 20px 0;
        }

        .dream-castle {
          position: relative;
          width: 300px;
          height: 250px;
          cursor: pointer;
          user-select: none;
          transition: transform 0.3s ease;
        }

        .dream-castle:hover {
          transform: scale(1.05);
        }

        .dream-castle:active {
          transform: scale(0.98);
        }

        .castle-towers {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 100%;
          position: relative;
        }

        .tower {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 60px;
        }

        .tower-top {
          width: 60px;
          height: 40px;
          background: linear-gradient(135deg, #9966CC 0%, #7c3aed 100%);
          border-radius: 50% 50% 0 0;
          position: relative;
          box-shadow: 0 0 20px rgba(153, 102, 204, 0.5);
          border: 2px solid rgba(255, 215, 0, 0.3);
        }

        .tower-flag {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 20px;
          animation: flag-wave 2s ease-in-out infinite;
        }

        @keyframes flag-wave {
          0%, 100% { transform: translateX(-50%) rotate(-5deg); }
          50% { transform: translateX(-50%) rotate(5deg); }
        }

        .tower-body {
          width: 50px;
          height: 80px;
          background: linear-gradient(180deg, #9966CC 0%, #7c3aed 100%);
          box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.1);
          border: 2px solid rgba(255, 215, 0, 0.2);
          border-top: none;
        }

        .castle-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          margin: 0 10px;
        }

        .castle-roof {
          width: 120px;
          height: 60px;
          background: linear-gradient(135deg, #FFD700 0%, #9966CC 100%);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          position: relative;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
        }

        .roof-star {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 24px;
          animation: star-twinkle 1.5s ease-in-out infinite;
        }

        @keyframes star-twinkle {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 1; }
          50% { transform: translateX(-50%) scale(1.2); opacity: 0.8; }
        }

        .castle-body {
          width: 120px;
          height: 120px;
          background: linear-gradient(180deg, #9966CC 0%, #7c3aed 100%);
          box-shadow: inset 0 0 30px rgba(255, 215, 0, 0.15),
                      0 0 40px rgba(153, 102, 204, 0.5);
          border: 3px solid rgba(255, 215, 0, 0.3);
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
        }

        .castle-door {
          width: 50px;
          height: 60px;
          background: linear-gradient(180deg, #FFD700 0%, #9966CC 100%);
          border-radius: 8px 8px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .door-heart {
          font-size: 20px;
          animation: heart-beat 1.5s ease-in-out infinite;
        }

        @keyframes heart-beat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.05); }
        }

        .castle-windows {
          display: flex;
          gap: 15px;
        }

        .window {
          width: 30px;
          height: 30px;
          background: rgba(255, 215, 0, 0.3);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .sparkles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .sparkle {
          position: absolute;
          font-size: 20px;
          animation: sparkle-float 3s ease-in-out infinite;
          opacity: 0.8;
        }

        .sparkle-1 { top: 10%; left: 10%; animation-delay: 0s; }
        .sparkle-2 { top: 20%; right: 10%; animation-delay: 0.5s; }
        .sparkle-3 { bottom: 30%; left: 5%; animation-delay: 1s; }
        .sparkle-4 { bottom: 40%; right: 5%; animation-delay: 1.5s; }
        .sparkle-5 { top: 50%; left: 50%; animation-delay: 2s; }

        @keyframes sparkle-float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 1;
          }
        }

        .music-notes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .note {
          position: absolute;
          font-size: 24px;
          animation: note-rise 1.5s ease-out forwards;
        }

        .note-1 { left: 30%; animation-delay: 0s; }
        .note-2 { left: 50%; animation-delay: 0.3s; }
        .note-3 { left: 70%; animation-delay: 0.6s; }

        @keyframes note-rise {
          0% {
            bottom: 50%;
            opacity: 1;
            transform: scale(0.5);
          }
          100% {
            bottom: 100%;
            opacity: 0;
            transform: scale(1.2);
          }
        }

        .floating-heart {
          position: absolute;
          font-size: 30px;
          pointer-events: none;
          animation: heart-float 2s ease-out forwards;
          z-index: 10;
        }

        @keyframes heart-float {
          0% {
            transform: translate(0, 0) scale(0.5) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(0, -100px) scale(1.5) rotate(360deg);
            opacity: 0;
          }
        }

        .castle-message {
          text-align: center;
          font-size: 14px;
          color: var(--text);
          opacity: 0.8;
          margin: 0;
        }

        /* GODDESSMODE+ enhancements */
        body.goddessmode-active .tower-top,
        body.goddessmode-active .tower-body,
        body.goddessmode-active .castle-body {
          background: linear-gradient(135deg, 
            rgba(153, 102, 204, 0.9) 0%, 
            rgba(255, 215, 0, 0.6) 50%,
            rgba(153, 102, 204, 0.9) 100%);
          background-size: 200% 200%;
          animation: goddessmode-castle-gradient 4s ease infinite;
        }

        @keyframes goddessmode-castle-gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        body.goddessmode-active .castle-roof {
          box-shadow: 0 0 50px rgba(255, 215, 0, 0.9),
                      0 0 80px rgba(153, 102, 204, 0.6);
          animation: goddessmode-roof-glow 2s ease-in-out infinite;
        }

        @keyframes goddessmode-roof-glow {
          0%, 100% { 
            filter: brightness(1); 
          }
          50% { 
            filter: brightness(1.3); 
          }
        }

        body.goddessmode-active .sparkle {
          animation: sparkle-float 2s ease-in-out infinite, 
                     goddessmode-sparkle-glow 1s ease-in-out infinite;
        }

        @keyframes goddessmode-sparkle-glow {
          0%, 100% { 
            text-shadow: 0 0 5px #FFD700;
          }
          50% { 
            text-shadow: 0 0 20px #FFD700, 0 0 30px #9966CC;
          }
        }

        body.goddessmode-active .dream-castle:hover {
          transform: scale(1.08);
          filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.8));
        }

        /* Mobile responsiveness */
        @media (max-width: 640px) {
          .dream-castle {
            width: 250px;
            height: 210px;
          }

          .castle-main {
            margin: 0 5px;
          }

          .tower {
            width: 50px;
          }

          .tower-top {
            width: 50px;
            height: 35px;
          }

          .tower-body {
            width: 40px;
            height: 70px;
          }

          .castle-roof {
            width: 100px;
            height: 50px;
          }

          .castle-body {
            width: 100px;
            height: 100px;
          }

          .castle-message {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}
