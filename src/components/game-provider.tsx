"use client";

import React, { createContext, useContext, useReducer, Dispatch, useEffect, useState } from 'react';
import type { GameState, GameAction, Player, GameCardContent } from '@/lib/types';
import { initialTruths, initialDares } from '@/lib/data';

const GameContext = createContext<{
  gameState: GameState;
  dispatch: Dispatch<GameAction>;
} | undefined>(undefined);

const initialPlayers: Player[] = [
  { id: 'player1', name: '', score: 0 },
  { id: 'player2', name: '', score: 0 },
];

const getInitialState = (): GameState => {
  let truths = initialTruths;
  let dares = initialDares;

  if (typeof window !== 'undefined') {
    const storedTruths = localStorage.getItem('truths');
    const storedDares = localStorage.getItem('dares');
    if (storedTruths) {
      truths = JSON.parse(storedTruths);
    }
    if (storedDares) {
      dares = JSON.parse(storedDares);
    }
  }

  return {
    phase: 'setup',
    players: initialPlayers,
    totalTurns: 20,
    currentTurn: 1,
    currentPlayerIndex: 0,
    truths: truths,
    dares: dares,
    currentCard: null,
    isProcessing: false,
  };
};

function gameReducer(state: GameState, action: GameAction): GameState {
  
  const drawAndAssignNewCard = (currentState: GameState): GameCardContent | null => {
    const { truths, dares } = currentState;
    if (truths.length === 0 && dares.length === 0) {
      return null;
    }

    const canDrawTruth = truths.length > 0;
    const canDrawDare = dares.length > 0;
    let cardType: 'truth' | 'dare' | null = null;

    if (canDrawTruth && canDrawDare) {
      cardType = Math.random() > 0.5 ? 'truth' : 'dare';
    } else if (canDrawTruth) {
      cardType = 'truth';
    } else if (canDrawDare) {
      cardType = 'dare';
    }

    if (cardType === 'truth') {
      const randomIndex = Math.floor(Math.random() * truths.length);
      return { type: 'truth', text: truths[randomIndex] };
    }
    if (cardType === 'dare') {
      const randomIndex = Math.floor(Math.random() * dares.length);
      return { type: 'dare', text: dares[randomIndex] };
    }
    
    return null;
  }

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
        isProcessing: false,
      };
      const firstCard = drawAndAssignNewCard(newState);
      if (!firstCard) {
        return { ...newState, phase: 'finished' };
      }
      return { ...newState, currentCard: firstCard };
    }
    
    case 'COMPLETE_TASK':
    case 'SKIP_TASK': {
      if (state.phase !== 'playing') return state;

      const isCompletion = action.type === 'COMPLETE_TASK';
      const updatedPlayers = [...state.players];
      if (isCompletion) {
        updatedPlayers[state.currentPlayerIndex].score += 1;
      }

      const isGameOver = state.currentTurn >= state.totalTurns;
      if (isGameOver) {
        return { ...state, players: updatedPlayers, phase: 'finished', isProcessing: false };
      }
      
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      const nextTurn = state.currentTurn + 1;

      const nextCard = drawAndAssignNewCard(state);
      if (!nextCard) {
        return { ...state, players: updatedPlayers, phase: 'finished', isProcessing: false };
      }

      return {
        ...state,
        players: updatedPlayers,
        currentTurn: nextTurn,
        currentPlayerIndex: nextPlayerIndex,
        currentCard: nextCard,
        isProcessing: false,
      };
    }

    case 'SET_PROCESSING': {
      return { ...state, isProcessing: action.payload };
    }
    
    case 'ADD_ITEM': {
        if (action.payload.type === 'truth') {
            const newTruths = [...state.truths, action.payload.text];
            if (typeof window !== 'undefined') {
              localStorage.setItem('truths', JSON.stringify(newTruths));
            }
            return { ...state, truths: newTruths };
        }
        const newDares = [...state.dares, action.payload.text];
        if (typeof window !== 'undefined') {
          localStorage.setItem('dares', JSON.stringify(newDares));
        }
        return { ...state, dares: newDares };
    }
    case 'DELETE_ITEM': {
        if (action.payload.type === 'truth') {
            const newTruths = state.truths.filter((_, i) => i !== action.payload.index);
            if (typeof window !== 'undefined') {
              localStorage.setItem('truths', JSON.stringify(newTruths));
            }
            return { ...state, truths: newTruths };
        }
        const newDares = state.dares.filter((_, i) => i !== action.payload.index);
        if (typeof window !== 'undefined') {
          localStorage.setItem('dares', JSON.stringify(newDares));
        }
        return { ...state, dares: newDares };
    }
    case 'RESET_GAME': {
      let truths = initialTruths;
      let dares = initialDares;
      if (typeof window !== 'undefined') {
        const storedTruths = localStorage.getItem('truths');
        const storedDares = localStorage.getItem('dares');
        if (storedTruths) truths = JSON.parse(storedTruths);
        if (storedDares) dares = JSON.parse(storedDares);
      }
      return {
        ...getInitialState(),
        truths: truths,
        dares: dares,
      };
    }
    default:
      return state;
  }
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialState, setInitialState] = useState(getInitialState());

  useEffect(() => {
    setInitialState(getInitialState());
    setIsInitialized(true);
  }, []);

  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (isInitialized) {
      dispatch({ type: 'RESET_GAME' });
    }
  }, [isInitialized]);

  const enhancedDispatch = (action: GameAction) => {
    if ((action.type === 'COMPLETE_TASK' || action.type === 'SKIP_TASK')) {
      if (gameState.isProcessing) return;
      
      dispatch({ type: 'SET_PROCESSING', payload: true });
      setTimeout(() => {
          dispatch(action);
      }, 500); 
    } else {
        dispatch(action);
    }
  };

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <GameContext.Provider value={{ gameState, dispatch: enhancedDispatch }}>
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
