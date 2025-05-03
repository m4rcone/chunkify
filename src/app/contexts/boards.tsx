"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface Boards {
  id: string;
  name: string;
}

interface BoardsContextType {
  boards: Boards[];
  isLoading: boolean;
  error: string;
  refreshBoards: () => void;
}

const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

export function BoardsProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<Boards[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  async function fetchBoards() {
    try {
      setIsLoading(true);
      const response = await fetch("api/v1/boards");

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const responseBody = await response.json();
      setBoards(responseBody);
      setError(null);
    } catch (error) {
      setError("Falha ao carregar os quadros. Por favor, tente novamente.");
      console.log("Falha na busca de quadros: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshBoards() {
    await fetchBoards();
  }

  const value = {
    boards,
    isLoading,
    error,
    refreshBoards,
  };

  return (
    <BoardsContext.Provider value={value}>{children}</BoardsContext.Provider>
  );
}

export function useBoards() {
  const context = useContext(BoardsContext);

  return context;
}
