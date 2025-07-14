"use client";

import React, { createContext, useContext, useReducer, Dispatch } from 'react';
import type { GameState, GameAction, Player } from '@/lib/types';
import { initialTruths, initialDares } from '@/lib/data';

const GameContext = createContext<{
  gameState: GameState;
  dispatch: Dispatch<GameAction>;
} | undefined>(undefined);

const initialPlayers: Player[] = [
  { id: 'player1', name: '', score: 0 },
  { id: 'player2', name: '', score: 0 },
];

const initialState: GameState = {
  phase: 'setup',
  players: initialPlayers,
  totalTurns: 20,
  currentTurn: 1,
  currentPlayerIndex: 0,
  truths: [...initialTruths],
  dares: [...initialDares],
  currentCard: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const { players, totalTurns } = action.payload;
      const newState = {
        ...state,
        phase: 'playing' as const,
        players: players.map(p => ({ ...p, score: 0 })),
        totalTurns,
        currentTurn: 1,
        currentPlayerIndex: 0,
      };
      return drawNewCard(newState);
    }
    case 'COMPLETE_TASK': {
      if (state.phase !== 'playing') return state;
      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].score += 1;
      
      const nextState = { ...state, players: newPlayers };
      return advanceTurn(nextState);
    }
    case 'SKIP_TASK': {
      if (state.phase !== 'playing') return state;
      return advanceTurn(state);
    }
    case 'ADD_ITEM': {
        if (action.payload.type === 'truth') {
            return { ...state, truths: [...state.truths, action.payload.text] };
        }
        return { ...state, dares: [...state.dares, action.payload.text] };
    }
    case 'DELETE_ITEM': {
        if (action.payload.type === 'truth') {
            const newTruths = state.truths.filter((_, i) => i !== action.payload.index);
            return { ...state, truths: newTruths };
        }
        const newDares = state.dares.filter((_, i) => i !== action.payload.index);
        return { ...state, dares: newDares };
    }
    case 'RESET_GAME': {
      return {
        ...initialState,
        truths: state.truths,
        dares: state.dares,
      };
    }
    default:
      return state;
  }
}

function drawNewCard(state: GameState): GameState {
  if (state.truths.length === 0 && state.dares.length === 0) {
    return { ...state, phase: 'finished' };
  }

  const type = Math.random() > 0.5 ? 'truth' : 'dare';
  
  if (type === 'truth' && state.truths.length > 0) {
    const randomIndex = Math.floor(Math.random() * state.truths.length);
    return { ...state, currentCard: { type: 'truth', text: state.truths[randomIndex] } };
  } else if (state.dares.length > 0) {
    const randomIndex = Math.floor(Math.random() * state.dares.length);
    return { ...state, currentCard: { type: 'dare', text: state.dares[randomIndex] } };
  } else if (state.truths.length > 0) { // Fallback to truth if dare is selected but empty
    const randomIndex = Math.floor(Math.random() * state.truths.length);
    return { ...state, currentCard: { type: 'truth', text: state.truths[randomIndex] } };
  }

  return { ...state, phase: 'finished' }; // No cards left
}

function advanceTurn(state: GameState): GameState {
  if (state.currentTurn >= state.totalTurns) {
    return { ...state, phase: 'finished' };
  }
  
  const isNewRound = state.currentPlayerIndex === state.players.length - 1;
  const nextTurn = isNewRound ? state.currentTurn + 1 : state.currentTurn;
  const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

  const nextState = {
    ...state,
    currentPlayerIndex: nextPlayerIndex,
    currentTurn: state.currentTurn + 1,
  };

  return drawNewCard(nextState);
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ gameState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
