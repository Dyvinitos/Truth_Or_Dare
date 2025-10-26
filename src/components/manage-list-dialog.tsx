"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { List, Trash2, PlusCircle } from "lucide-react";

export default function ManageListDialog() {
  const [truths, setTruths] = useState<{ id: number; content: string }[]>([]);
  const [dares, setDares] = useState<{ id: number; content: string }[]>([]);
  const [newTruth, setNewTruth] = useState("");
  const [newDare, setNewDare] = useState("");

  // Charger les données depuis la DB
  useEffect(() => {
    Promise.all([
      fetch("/api/truths").then((res) => res.json()),
      fetch("/api/dares").then((res) => res.json()),
    ]).then(([truths, dares]) => {
      setTruths(truths);
      setDares(dares);
    });
  }, []);

  // Ajouter un truth/dare
  const handleAdd = async (type: "truth" | "dare") => {
    const content = type === "truth" ? newTruth.trim() : newDare.trim();
    if (!content) return;

    const res = await fetch(`/api/${type === "truth" ? "truths" : "dares"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) return;

    const newItem = await res.json();
    if (type === "truth") {
      setTruths([newItem, ...truths]);
      setNewTruth("");
    } else {
      setDares([newItem, ...dares]);
      setNewDare("");
    }
  };

  // Supprimer un truth/dare
  const handleDelete = async (type: "truth" | "dare", id: number) => {
    const res = await fetch(`/api/${type === "truth" ? "truths" : "dares"}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      if (type === "truth") setTruths(truths.filter((t) => t.id !== id));
      else setDares(dares.filter((d) => d.id !== id));
    }
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
          <DialogDescription>Add, view and remove truths or dares.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="truths" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="truths">Truths ({truths.length})</TabsTrigger>
            <TabsTrigger value="dares">Dares ({dares.length})</TabsTrigger>
          </TabsList>

          {/* Truths */}
          <TabsContent value="truths">
            <div className="flex items-center gap-2 mt-4">
              <Input
                placeholder="Add a truth..."
                value={newTruth}
                onChange={(e) => setNewTruth(e.target.value)}
              />
              <Button onClick={() => handleAdd("truth")} size="icon">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="h-72 mt-4 pr-4">
              <ul className="space-y-2">
                {truths.map((t) => (
                  <li key={t.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50 group">
                    <span className="text-sm">{t.content}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={() => handleDelete("truth", t.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </TabsContent>

          {/* Dares */}
          <TabsContent value="dares">
            <div className="flex items-center gap-2 mt-4">
              <Input
                placeholder="Add a dare..."
                value={newDare}
                onChange={(e) => setNewDare(e.target.value)}
              />
              <Button onClick={() => handleAdd("dare")} size="icon">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="h-72 mt-4 pr-4">
              <ul className="space-y-2">
                {dares.map((d) => (
                  <li key={d.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50 group">
                    <span className="text-sm">{d.content}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={() => handleDelete("dare", d.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
