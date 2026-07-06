import React, { useEffect, useRef } from 'react';
import { useGame } from './hooks/useGame';
import { GameBoard } from './components/GameBoard';
import { Dashboard } from './components/Dashboard';
import { Overlay } from './components/Overlay';
import { MobileControls } from './components/MobileControls';
import { GameState } from './types';
import { Pause, Volume2, VolumeX, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const {
    snake,
    direction,
    food,
    gameState,
    score,
    highScore,
    difficulty,
    isAIMode,
    soundEnabled,
    setDirection,
    setGameState,
    setDifficulty,
    setIsAIMode,
    setSoundEnabled,
    startGame,
    pauseGame,
    goToMenu,
  } = useGame();

  const prevHighScore = useRef(highScore);

  useEffect(() => {
    if (gameState === GameState.GAME_OVER && score > prevHighScore.current && score > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4ade80', '#a855f7', '#3b82f6']
      });
      prevHighScore.current = score;
    }
  }, [gameState, score]);

  // Handle Swipe logic
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isAIMode || gameState !== GameState.PLAYING) return;

    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    const deltaY = e.touches[0].clientY - touchStartRef.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      // Horizontal swipe
      if (deltaX > 0 && direction !== 'LEFT') setDirection('RIGHT' as any);
      else if (deltaX < 0 && direction !== 'RIGHT') setDirection('LEFT' as any);
      touchStartRef.current = null;
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 30) {
      // Vertical swipe
      if (deltaY > 0 && direction !== 'UP') setDirection('DOWN' as any);
      else if (deltaY < 0 && direction !== 'DOWN') setDirection('UP' as any);
      touchStartRef.current = null;
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-950 text-white font-sans selection:bg-green-500/30 overflow-y-auto overflow-x-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 container mx-auto px-4 py-8 h-full flex flex-col items-center justify-center min-h-screen">
        
        {/* Header Controls */}
        <div className="w-full max-w-4xl flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <div className="w-4 h-4 bg-green-400 rounded-sm" />
            </div>
            <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 hidden sm:block">
              SNAKE GAMER
            </h1>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={goToMenu}
              disabled={gameState === GameState.MENU}
              className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Home className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button 
              onClick={pauseGame}
              disabled={gameState !== GameState.PLAYING}
              className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Pause className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Dashboard 
          score={score} 
          highScore={highScore} 
          difficulty={difficulty} 
          isAIMode={isAIMode} 
        />

        <div className="flex flex-col items-center justify-center gap-4 w-full mt-4">
          <div className="relative w-full max-w-md shrink-0">
            <GameBoard 
              snake={snake} 
              food={food} 
              direction={direction} 
              isAIMode={isAIMode}
            />
            <Overlay 
              gameState={gameState} 
              score={score}
              startGame={startGame}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              isAIMode={isAIMode}
              setIsAIMode={setIsAIMode}
              resumeGame={pauseGame}
              goToMenu={goToMenu}
            />
          </div>

          <div className="w-full shrink-0 flex justify-center z-10">
            <MobileControls 
              direction={direction} 
              setDirection={setDirection} 
              isAIMode={isAIMode} 
              gameState={gameState}
            />
          </div>
        </div>

        {/* AdSense Placeholders */}
        <div className="mt-8 text-center text-xs text-gray-600 font-mono">
          {/* <!-- Google AdSense Bottom Banner --> */}
          <div className="w-[320px] h-[50px] border border-dashed border-gray-700/50 mx-auto flex items-center justify-center opacity-30">
            AdSense Placeholder
          </div>
        </div>

      </main>
    </div>
  );
}
