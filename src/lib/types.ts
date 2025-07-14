export type Player = {
  id: string;
  name: string;
  score: number;
};

export type GamePhase = 'setup' | 'playing' | 'finished';

export type GameCardContent = {
  type: 'truth' | 'dare';
  text: string;
};

export type GameState = {
  phase: GamePhase;
  players: Player[];
  totalTurns: number;
  currentTurn: number;
  currentPlayerIndex: number;
  truths: string[];
  dares: string[];
  currentCard: GameCardContent | null;
  isProcessing: boolean;
};

export type GameAction =
  | { type: 'START_GAME'; payload: { players: Player[]; totalTurns: number } }
  | { type: 'COMPLETE_TASK' }
  | { type: 'SKIP_TASK' }
  | { type: 'ADD_ITEM'; payload: { type: 'truth' | 'dare'; text: string } }
  | { type: 'DELETE_ITEM'; payload: { type: 'truth' | 'dare'; index: number } }
  | { type: 'RESET_GAME' }
  | { type: 'SET_PROCESSING', payload: boolean };
