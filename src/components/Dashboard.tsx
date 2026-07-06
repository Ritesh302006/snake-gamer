import React, { useState, useEffect } from 'react';
import { GameState, Difficulty } from '../types';
import { Trophy, Activity, Zap, Monitor } from 'lucide-react';

interface DashboardProps {
  score: number;
  highScore: number;
  difficulty: Difficulty;
  isAIMode: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ score, highScore, difficulty, isAIMode }) => {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const updateFPS = () => {
      const now = performance.now();
      frameCount++;
      
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(updateFPS);
    };
    
    updateFPS();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-4xl mx-auto mb-6">
      <StatCard 
        icon={<Activity className="w-5 h-5 text-green-400" />} 
        label="SCORE" 
        value={score.toString()} 
      />
      <StatCard 
        icon={<Trophy className="w-5 h-5 text-yellow-400" />} 
        label="HIGH SCORE" 
        value={highScore.toString()} 
      />
      <StatCard 
        icon={<Zap className="w-5 h-5 text-blue-400" />} 
        label="DIFFICULTY" 
        value={difficulty} 
      />
      <StatCard 
        icon={<div className="font-mono text-lg font-bold text-purple-400">AI</div>} 
        label="MODE" 
        value={isAIMode ? 'AUTO' : 'MANUAL'} 
        active={isAIMode}
      />
      <StatCard 
        icon={<Monitor className="w-5 h-5 text-teal-400" />} 
        label="FPS" 
        value={fps.toString()} 
        className="hidden md:flex"
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  active?: boolean;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, active, className = "" }) => (
  <div className={`
    bg-gray-900/40 backdrop-blur-md border rounded-xl p-4 flex items-center gap-4 transition-all duration-300
    ${active ? 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-gray-800/50'}
    ${className}
  `}>
    <div className="p-2 bg-gray-800/50 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-mono text-gray-400 tracking-widest">{label}</p>
      <p className="text-lg font-bold text-white tracking-tight">{value}</p>
    </div>
  </div>
);
