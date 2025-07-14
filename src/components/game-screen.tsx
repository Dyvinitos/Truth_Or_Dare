"use client";

import { useGame } from "./game-provider";
import ScoreSheet from "./scoresheet";
import GameCard from "./game-card";
import EndGameDialog from "./endgame-dialog";
import AddEntryDialog from "./add-entry-dialog";
import ManageListDialog from "./manage-list-dialog";

function Header() {
  return (
    <header className="w-full flex justify-between items-center mb-4 md:mb-6">
      <h1 className="font-headline text-3xl md:text-4xl text-primary">Daredevil Truths</h1>
      <div className="flex items-center gap-2">
        <AddEntryDialog />
        <ManageListDialog />
      </div>
    </header>
  );
}

export default function GameScreen() {
  const { gameState } = useGame();

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <ScoreSheet />
        </div>
        <div className="md:col-span-3">
          <GameCard />
        </div>
      </div>
      {gameState.phase === 'finished' && <EndGameDialog />}
    </div>
  );
}
