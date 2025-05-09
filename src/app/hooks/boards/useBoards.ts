import {
  createBoard,
  BoardObject,
  fetchAllBoards,
  fetchBoardById,
  fetchColumnsByBoardId,
  updateBoard,
  deleteBoard,
} from "app/services/boardService";
import useSWR, { mutate } from "swr";

const API_URL = "/api/v1/boards";

export function useBoards() {
  const { data, isLoading, error } = useSWR(API_URL, fetchAllBoards, {
    shouldRetryOnError: false,
  });

  return {
    boards: data,
    isLoading,
    error,
  };
}

export function useBoard(boardId: string) {
  const { data, isLoading, error } = useSWR(
    `${API_URL}/${boardId}`,
    fetchBoardById,
    {
      shouldRetryOnError: false,
    },
  );

  return {
    board: data,
    isLoading,
    error,
  };
}

export function useColumns(boardId: string) {
  const { data, isLoading, error } = useSWR(
    `${API_URL}/${boardId}/columns`,
    fetchColumnsByBoardId,
    {
      shouldRetryOnError: false,
    },
  );

  return {
    columns: data,
    isLoading,
    error,
  };
}

export function useBoardActions() {
  async function handleCreateBoard(boardObject: BoardObject) {
    const createdBoardId = await createBoard(boardObject);

    mutate(API_URL);

    return createdBoardId;
  }

  async function handleUpdateBoard(boardObject: BoardObject) {
    const updatedBoardId = await updateBoard(boardObject);

    mutate(API_URL);
    mutate(`${API_URL}/${updatedBoardId}`);
    mutate(`${API_URL}/${updatedBoardId}/columns`);

    return updatedBoardId;
  }

  async function handleDeleteBoard(boardId: string) {
    await deleteBoard(boardId);

    mutate(API_URL);
  }

  return {
    handleCreateBoard,
    handleUpdateBoard,
    handleDeleteBoard,
  };
}
