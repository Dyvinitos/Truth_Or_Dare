"use client";

import React, { useState } from 'react';
import { useGame } from './game-provider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from "@/hooks/use-toast"
import { Plus } from 'lucide-react';

export default function AddEntryDialog() {
  const { dispatch } = useGame();
  const [type, setType] = useState<'truth' | 'dare'>('truth');
  const [text, setText] = useState('');
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === '') {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Please enter some text for your truth or dare.",
      })
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: { type, text } });
    toast({
      title: "Success!",
      description: `Your ${type} has been added to the list.`,
    })
    setText('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon">
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add New Truth or Dare</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Add a New Truth or Dare</DialogTitle>
          <DialogDescription>
            Contribute your own fun and exciting challenges to the game.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="font-semibold">Type</Label>
            <RadioGroup defaultValue="truth" onValueChange={(value: 'truth' | 'dare') => setType(value)} className="flex gap-4 mt-2">
              <div>
                <RadioGroupItem value="truth" id="truth" />
                <Label htmlFor="truth" className="ml-2">Truth</Label>
              </div>
              <div>
                <RadioGroupItem value="dare" id="dare" />
                <Label htmlFor="dare" className="ml-2">Dare</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="text" className="font-semibold">Content</Label>
            <Textarea
              id="text"
              placeholder={`Enter your ${type}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-2 min-h-[100px]"
            />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90">Add to Game</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
