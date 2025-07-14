"use client";

import { useGame } from "@/components/game-provider";
import SetupScreen from "@/components/setup-screen";
import GameScreen from "@/components/game-screen";

export default function Home() {
  const { gameState } = useGame();

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      {gameState.phase === 'setup' && <SetupScreen />}
      {(gameState.phase === 'playing' || gameState.phase === 'finished') && <GameScreen />}
    </main>
  );
}
