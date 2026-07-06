import React from 'react';
import { GameState, Difficulty } from '../types';
import { Button } from './Button';
import { Play, Settings2, RotateCcw, Cpu } from 'lucide-react';

interface OverlayProps {
  gameState: GameState;
  score: number;
  startGame: () => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  isAIMode: boolean;
  setIsAIMode: (m: boolean) => void;
  resumeGame?: () => void;
  goToMenu?: () => void;
}

export const Overlay: React.FC<OverlayProps> = ({
  gameState,
  score,
  startGame,
  difficulty,
  setDifficulty,
  isAIMode,
  setIsAIMode,
  resumeGame,
  goToMenu
}) => {
  if (gameState === GameState.PLAYING) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative bg-gray-900/90 border border-gray-700 p-6 rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] flex flex-col items-center justify-center text-center overflow-y-auto animate-in fade-in zoom-in duration-300" style={{ scrollbarWidth: 'none' }}>
        
        {gameState === GameState.MENU && (
          <>
            <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-green-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 ml-1" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 tracking-tight">SNAKE GAMER</h1>
            <p className="text-gray-400 mb-4 sm:mb-8 font-mono text-xs sm:text-sm tracking-widest">AI SURVIVAL PROTOCOL</p>
            
            <div className="w-full space-y-3 sm:space-y-4 mb-4 sm:mb-8 shrink-0">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono text-gray-500 tracking-widest">DIFFICULTY</span>
                <div className="flex gap-2">
                  {Object.values(Difficulty).map(d => (
                    <Button 
                      key={d} 
                      variant={difficulty === d ? 'primary' : 'secondary'}
                      className="flex-1 py-2 text-xs"
                      onClick={() => setDifficulty(d)}
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono text-gray-500 tracking-widest">CONTROL MODE</span>
                <div className="flex gap-2">
                  <Button 
                    variant={!isAIMode ? 'primary' : 'secondary'}
                    className="flex-1 py-2 text-xs"
                    onClick={() => setIsAIMode(false)}
                  >
                    MANUAL
                  </Button>
                  <Button 
                    variant={isAIMode ? 'primary' : 'secondary'}
                    className="flex-1 py-2 text-xs border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                    onClick={() => setIsAIMode(true)}
                  >
                    <Cpu className="w-4 h-4 mr-1 inline" /> AI AUTO
                  </Button>
                </div>
              </div>
            </div>

            <Button fullWidth onClick={startGame} className="py-4 text-lg">
              PLAY GAME
            </Button>
          </>
        )}

        {gameState === GameState.GAME_OVER && (
          <>
            <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-red-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 tracking-tight">CRITICAL FAILURE</h2>
            <p className="text-gray-400 mb-4 sm:mb-6 font-mono text-xs sm:text-sm tracking-widest">SYSTEM COMPROMISED</p>
            
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-6 sm:mb-8 filter drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
              {score}
            </div>

            <div className="w-full space-y-3 sm:space-y-4 shrink-0">
              <Button fullWidth onClick={startGame} className="py-4 text-lg">
                REBOOT SYSTEM
              </Button>
              <Button fullWidth variant="secondary" onClick={goToMenu} className="py-4">
                MAIN MENU
              </Button>
            </div>
          </>
        )}

        {gameState === GameState.PAUSED && (
          <>
            <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <Settings2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 tracking-tight">SYSTEM PAUSED</h2>
            
            <div className="w-full space-y-3 sm:space-y-4 shrink-0">
              <Button fullWidth onClick={resumeGame} className="py-4 text-lg border-blue-500/50 text-blue-400 hover:bg-blue-500/20">
                RESUME PROTOCOL
              </Button>
              <Button fullWidth variant="secondary" onClick={startGame} className="py-4">
                ABORT & RESTART
              </Button>
              <Button fullWidth variant="ghost" onClick={goToMenu} className="py-4 border border-gray-700/50">
                MAIN MENU
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
