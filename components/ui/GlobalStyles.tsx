"use client"

export const GlobalStyles = () => (
    <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    
    body {
      font-family: 'Outfit', sans-serif;
      background: radial-gradient(circle at 50% 0%, #7c3aed 0%, #4c1d95 40%, #0f172a 100%);
      background-attachment: fixed;
      background-size: cover;
      color: #f8fafc;
      overflow: hidden; 
    }
    
    h1, h2, h3, h4, .font-display {
      font-family: 'Space Grotesk', sans-serif;
    }
    
    .tilt-card {
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.27), box-shadow 0.4s ease;
      transform-style: preserve-3d;
    }
    .tilt-card:hover {
      transform: perspective(1000px) rotateX(2deg) rotateY(2deg) scale(1.015);
      box-shadow: 0 20px 40px -10px rgba(124, 58, 237, 0.4);
      z-index: 50;
    }

    @keyframes beam-rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .simple-beam-container {
      position: absolute; 
      inset: 0; 
      overflow: hidden; 
      border-radius: inherit; 
      pointer-events: none; 
      z-index: 0;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: xor;
      -webkit-mask-composite: xor;
      padding: 1.5px; 
    }
    .simple-beam {
      position: absolute; 
      top: -50%; 
      left: -50%; 
      width: 200%; 
      height: 200%;
      background: conic-gradient(transparent 0deg, transparent 80deg, #ffffff 100deg, #d8b4fe 140deg, transparent 180deg);
      animation: beam-rotate 4s linear infinite;
      opacity: 0.8; 
    }
    
    .glass-panel {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 
        0 8px 32px 0 rgba(0, 0, 0, 0.3),
        inset 0 0 0 1px rgba(255, 255, 255, 0.05);
    }
    
    .glass-panel-dark {
       background: rgba(2, 6, 23, 0.7);
       backdrop-filter: blur(30px);
       -webkit-backdrop-filter: blur(30px);
       border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.4); }

    @keyframes draw { to { stroke-dashoffset: 0; } }
    @keyframes shimmer { 0% { transform: translateX(-100%) skewX(-12deg); } 100% { transform: translateX(200%) skewX(-12deg); } }
    .animate-draw { animation: draw 0.8s ease-out forwards; }
    .animate-shimmer { animation: shimmer 2s infinite linear; }
    
    input[type=range] { -webkit-appearance: none; background: transparent; }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none; height: 16px; width: 16px; border-radius: 50%;
      background: #c084fc; cursor: pointer; margin-top: -6px;
      box-shadow: 0 0 10px rgba(192,132,252,0.8);
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%; height: 4px; cursor: pointer; background: rgba(255,255,255,0.2); border-radius: 2px;
    }
  `}</style>
)
