"use client";

import React, { useState, useEffect } from 'react';
import { useGame } from "./game-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, HelpCircle, ShieldQuestion, Loader2 } from "lucide-react";
import { cn } from '@/lib/utils';

export default function GameCard() {
  const { gameState, dispatch } = useGame();
  const { players, currentPlayerIndex, currentCard, currentTurn, totalTurns, isProcessing } = gameState;
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (currentCard) {
      setIsFlipping(true);
      const timer = setTimeout(() => setIsFlipping(false), 300); // Corresponds to animation duration
      return () => clearTimeout(timer);
    }
  }, [currentCard?.text]);

  if (!currentCard) {
    return (
      <Card className="flex flex-col items-center justify-center min-h-[300px] text-center shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Getting the next challenge ready!</p>
        </CardContent>
      </Card>
    );
  }

  const currentPlayer = players[currentPlayerIndex];
  const isTruth = currentCard.type === 'truth';

  const handleAction = (action: 'COMPLETE_TASK' | 'SKIP_TASK') => {
    dispatch({ type: action });
  };

  return (
    <div className={cn("perspective-1000", isFlipping ? 'animate-fade-in' : '')}>
      <Card
        className={cn(
          "min-h-[300px] text-center shadow-xl flex flex-col justify-between transition-transform duration-300 transform-style-3d",
          isFlipping ? "rotate-y-180" : "",
          isTruth ? "border-primary" : "border-accent"
        )}
      >
        <CardHeader className="relative">
          <div className="absolute top-2 right-2 text-sm font-bold text-muted-foreground">
            Turn: {currentTurn} / {totalTurns}
          </div>
          <CardDescription className="text-lg">It's your turn,</CardDescription>
          <CardTitle className="font-headline text-4xl text-primary">{currentPlayer.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center px-6 py-8">
            <div className={cn("flex items-center gap-3 mb-4 text-2xl font-bold font-headline", isTruth ? "text-primary" : "text-accent")}>
                {isTruth ? <ShieldQuestion className="h-8 w-8"/> : <HelpCircle className="h-8 w-8"/>}
                {isTruth ? 'Truth' : 'Dare'}
            </div>
            <p className="text-xl md:text-2xl font-body leading-relaxed">{currentCard.text}</p>
        </CardContent>
        <CardFooter className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={() => handleAction('COMPLETE_TASK')} size="lg" className="text-lg py-6 bg-green-500 hover:bg-green-600 text-white" disabled={isProcessing}>
            {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2" />}
            {isProcessing ? 'Processing...' : 'Completed'}
          </Button>
          <Button onClick={() => handleAction('SKIP_TASK')} size="lg" variant="destructive" className="text-lg py-6" disabled={isProcessing}>
             {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <XCircle className="mr-2" />}
             {isProcessing ? 'Processing...' : 'Skip'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
