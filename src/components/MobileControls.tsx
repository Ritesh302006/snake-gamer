import React from 'react';
import { Direction, GameState } from '../types';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileControlsProps {
  setDirection: (d: Direction) => void;
  direction: Direction;
  isAIMode: boolean;
  gameState: GameState;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ setDirection, direction, isAIMode, gameState }) => {
  if (isAIMode || gameState !== GameState.PLAYING) return null;

  return (
    <div className="mt-4 grid grid-cols-3 gap-3 w-full max-w-[240px] mx-auto opacity-90 pb-8">
      <div />
      <ControlButton 
        onClick={() => direction !== Direction.DOWN && setDirection(Direction.UP)} 
        icon={<ChevronUp size={36} />} 
      />
      <div />
      <ControlButton 
        onClick={() => direction !== Direction.RIGHT && setDirection(Direction.LEFT)} 
        icon={<ChevronLeft size={36} />} 
      />
      <ControlButton 
        onClick={() => direction !== Direction.UP && setDirection(Direction.DOWN)} 
        icon={<ChevronDown size={36} />} 
      />
      <ControlButton 
        onClick={() => direction !== Direction.LEFT && setDirection(Direction.RIGHT)} 
        icon={<ChevronRight size={36} />} 
      />
    </div>
  );
};

const ControlButton = ({ onClick, icon }: { onClick: () => void, icon: React.ReactNode }) => (
  <button 
    className="bg-gray-800/80 backdrop-blur-md border border-gray-600/50 p-4 sm:p-6 rounded-2xl flex items-center justify-center text-gray-300 active:bg-green-500/40 active:text-white active:border-green-500/50 transition-all transform active:scale-90 shadow-lg"
    onClick={(e) => {
      e.preventDefault(); // Prevent double firing or scrolling
      onClick();
    }}
    onTouchStart={(e) => {
      e.preventDefault();
      onClick();
    }}
  >
    {icon}
  </button>
);
