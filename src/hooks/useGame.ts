import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Difficulty, Direction, Point } from '../types';
import { INITIAL_SNAKE, INITIAL_DIRECTION, DIFFICULTY_SPEEDS, GRID_SIZE } from '../constants';
import { getRandomFoodPosition, checkCollision } from '../lib/utils';
import { getNextAIDirection } from '../lib/ai';

export const useGame = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION as Direction);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [isAIMode, setIsAIMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Use refs for values needed in game loop to avoid dependency issues
  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const isAIModeRef = useRef(isAIMode);
  const gameStateRef = useRef(gameState);
  
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { isAIModeRef.current = isAIMode; }, [isAIMode]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const setDirectionSafe = useCallback((newDir: Direction) => {
    directionRef.current = newDir;
    setDirection(newDir);
  }, []);

  const lastProcessedDirection = useRef(direction);

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION as Direction);
    directionRef.current = INITIAL_DIRECTION as Direction;
    lastProcessedDirection.current = INITIAL_DIRECTION as Direction;
    setScore(0);
    setFood(getRandomFoodPosition(INITIAL_SNAKE));
    setGameState(GameState.PLAYING);
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => prev === GameState.PLAYING ? GameState.PAUSED : GameState.PLAYING);
  }, []);

  const goToMenu = useCallback(() => {
    setGameState(GameState.MENU);
  }, []);

  const playSound = useCallback((frequency: number, type: OscillatorType = 'sine', duration: number = 0.1) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.error('Audio play failed', e);
    }
  }, [soundEnabled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameStateRef.current !== GameState.PLAYING || isAIModeRef.current) return;

      const currentDir = lastProcessedDirection.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== Direction.DOWN) setDirectionSafe(Direction.UP);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== Direction.UP) setDirectionSafe(Direction.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== Direction.RIGHT) setDirectionSafe(Direction.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== Direction.LEFT) setDirectionSafe(Direction.RIGHT);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const gameLoop = useCallback(() => {
    if (gameStateRef.current !== GameState.PLAYING) return;

    let currentDir = directionRef.current;
    
    if (isAIModeRef.current) {
        currentDir = getNextAIDirection(snakeRef.current, foodRef.current, currentDir);
        setDirectionSafe(currentDir);
    }
    lastProcessedDirection.current = currentDir;

    const newSnake = [...snakeRef.current];
    const head = { ...newSnake[0] };

    switch (currentDir) {
      case Direction.UP: head.y -= 1; break;
      case Direction.DOWN: head.y += 1; break;
      case Direction.LEFT: head.x -= 1; break;
      case Direction.RIGHT: head.x += 1; break;
    }

    if (checkCollision(head, newSnake)) {
      setGameState(GameState.GAME_OVER);
      playSound(150, 'sawtooth', 0.5); // Crash sound
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('snakeHighScore', score.toString());
      }
      return;
    }

    newSnake.unshift(head);

    // Check food collision
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(s => s + 10);
      setFood(getRandomFoodPosition(newSnake));
      playSound(600, 'sine', 0.1); // Eat sound
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [highScore, playSound, score]);

  useEffect(() => {
    const speed = DIFFICULTY_SPEEDS[difficulty];
    const interval = setInterval(gameLoop, speed);
    return () => clearInterval(interval);
  }, [gameLoop, difficulty]);

  return {
    snake,
    direction,
    food,
    gameState,
    score,
    highScore,
    difficulty,
    isAIMode,
    soundEnabled,
    setDirection: setDirectionSafe,
    setGameState,
    setDifficulty,
    setIsAIMode,
    setSoundEnabled,
    startGame,
    pauseGame,
    goToMenu,
  };
};
