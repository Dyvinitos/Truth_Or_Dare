"use client";

import { useGame } from "./game-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScoreSheet() {
  const { gameState } = useGame();
  const { players, currentPlayerIndex } = gameState;

  return (
    <Card className="shadow-lg animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
          <Users className="h-6 w-6 text-primary" />
          Scores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {players.map((player, index) => (
            <li
              key={player.id}
              className={cn(
                "flex justify-between items-center p-3 rounded-lg transition-all duration-300",
                index === currentPlayerIndex
                  ? "bg-accent/20 border-l-4 border-accent"
                  : "bg-muted/50"
              )}
            >
              <span className={cn(
                "font-bold text-lg",
                index === currentPlayerIndex ? "text-accent-foreground" : ""
              )}>
                {player.name}
              </span>
              <span className="flex items-center gap-2 font-bold text-xl text-primary">
                <Trophy className="h-5 w-5" />
                {player.score > 0 ? player.score / 2 : 0}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
