"use client";

import React, { useState } from 'react';
import { useGame } from './game-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, MinusCircle, Users, Gamepad2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import type { Player } from '@/lib/types';

export default function SetupScreen() {
  const { dispatch } = useGame();
  const [players, setPlayers] = useState<Omit<Player, 'score'>[]>([
    { id: `p${Date.now()}-1`, name: '' },
    { id: `p${Date.now()}-2`, name: '' },
  ]);
  const [totalTurns, setTotalTurns] = useState<number>(20);
  const { toast } = useToast();

  const handlePlayerNameChange = (id: string, name: string) => {
    setPlayers(players.map(p => (p.id === id ? { ...p, name } : p)));
  };

  const addPlayer = () => {
    if (players.length < 8) {
      setPlayers([...players, { id: `p${Date.now()}-${players.length + 1}`, name: '' }]);
    }
  };

  const removePlayer = (id: string) => {
    if (players.length > 2) {
      setPlayers(players.filter(p => p.id !== id));
    }
  };

  const handleStartGame = () => {
    const namedPlayers = players.filter(p => p.name.trim() !== '');
    if (namedPlayers.length < 2) {
      toast({
        variant: "destructive",
        title: "Setup Error",
        description: "Please enter names for at least two players.",
      })
      return;
    }
    const finalPlayers = namedPlayers.map(p => ({ ...p, score: 0 }));
    dispatch({ type: 'START_GAME', payload: { players: finalPlayers, totalTurns } });
  };

  return (
    <Card className="w-full max-w-md animate-fade-in shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-4xl text-primary">Daredevil Truths</h1>
        </div>
        <CardDescription className="font-body">Let's see who is the most daring. Setup your game to begin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-lg font-semibold"><Users className="h-5 w-5"/> Players</Label>
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center gap-2 animate-slide-up" style={{ animationDelay: `${index * 50}ms`}}>
              <Input
                placeholder={`Player ${index + 1}`}
                value={player.name}
                onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
                className="font-body"
              />
              <Button variant="ghost" size="icon" onClick={() => removePlayer(player.id)} disabled={players.length <= 2}>
                <MinusCircle className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addPlayer} className="w-full" disabled={players.length >= 8}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Player
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="turns" className="text-lg font-semibold">Number of Turns</Label>
          <Select onValueChange={(value) => setTotalTurns(Number(value))} defaultValue="20">
            <SelectTrigger id="turns" className="w-full font-body">
              <SelectValue placeholder="Select turns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20 Turns</SelectItem>
              <SelectItem value="50">50 Turns</SelectItem>
              <SelectItem value="70">70 Turns</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartGame} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6">Start Game</Button>
      </CardFooter>
    </Card>
  );
}
