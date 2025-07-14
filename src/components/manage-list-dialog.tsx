"use client";

import { useGame } from "./game-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { List, Trash2 } from "lucide-react";

export default function ManageListDialog() {
  const { gameState, dispatch } = useGame();
  const { truths, dares } = gameState;

  const handleDelete = (type: 'truth' | 'dare', index: number) => {
    dispatch({ type: 'DELETE_ITEM', payload: { type, index } });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <List className="h-5 w-5" />
          <span className="sr-only">Manage List</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Manage Truths & Dares</DialogTitle>
          <DialogDescription>
            View and remove any truths or dares from the list.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="truths" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="truths">Truths ({truths.length})</TabsTrigger>
            <TabsTrigger value="dares">Dares ({dares.length})</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-72 mt-4 pr-4">
            <TabsContent value="truths">
              <ul className="space-y-2">
                {truths.map((truth, index) => (
                  <li key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50 group">
                    <span className="text-sm">{truth}</span>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => handleDelete('truth', index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="dares">
              <ul className="space-y-2">
                {dares.map((dare, index) => (
                  <li key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50 group">
                    <span className="text-sm">{dare}</span>
                     <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => handleDelete('dare', index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
