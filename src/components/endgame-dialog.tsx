"use client";

import { useGame } from './game-provider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trophy, Award } from 'lucide-react';

export default function EndGameDialog() {
  const { gameState, dispatch } = useGame();
  const { players } = gameState;

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const highScore = sortedPlayers.length > 0 ? sortedPlayers[0].score : 0;
  const winners = sortedPlayers.filter(p => p.score === highScore && highScore > 0);

  return (
    <Dialog open={gameState.phase === 'finished'}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center text-center gap-2 font-headline text-3xl">
            <Trophy className="h-12 w-12 text-yellow-400" />
            Game Over!
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Here are the final scores.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <ul className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <li key={player.id} className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  {winners.some(w => w.id === player.id) ? (
                     <Award className="h-6 w-6 text-yellow-500" />
                  ) : (
                    <span className="w-6 text-center font-bold text-muted-foreground">{index + 1}</span>
                  )}
                  <span className="font-bold text-lg">{player.name}</span>
                </div>
                <span className="font-bold text-xl text-primary">{player.score}</span>
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter>
          <Button onClick={handlePlayAgain} size="lg" className="w-full bg-accent hover:bg-accent/90">Play Again</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
