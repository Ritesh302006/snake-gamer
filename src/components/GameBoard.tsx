import React from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE } from '../constants';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GameBoardProps {
  snake: Point[];
  food: Point;
  direction: Direction;
  isAIMode: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ snake, food, direction, isAIMode }) => {
  // Create a 2D grid array for easier rendering
  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => 0)
  );

  return (
    <div className="relative aspect-square w-full max-w-md mx-auto bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      {grid.map((row, y) => (
        <div key={y} className="flex h-[5%]">
          {row.map((_, x) => {
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={`${x}-${y}`}
                className={twMerge(
                  "w-[5%] h-full border-[0.5px] border-white/5",
                  isHead && "bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] z-10 rounded-sm relative",
                  isSnake && !isHead && "bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.4)] rounded-sm",
                  isFood && "bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)] rounded-full animate-pulse",
                )}
              >
                {/* Eyes for the snake head */}
                {isHead && (
                  <div className={clsx(
                    "absolute w-full h-full flex justify-between p-1 opacity-80",
                    direction === Direction.UP && "flex-row top-0",
                    direction === Direction.DOWN && "flex-row bottom-0 items-end",
                    direction === Direction.LEFT && "flex-col left-0",
                    direction === Direction.RIGHT && "flex-col right-0 items-end"
                  )}>
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      
      {/* AI overlay indicator */}
      {isAIMode && (
        <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-green-500/30">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-mono text-green-400 font-bold tracking-widest">AI ACTIVE</span>
        </div>
      )}
    </div>
  );
};
