export interface Board {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Column {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface BoardObject {
  id?: string;
  name: string;
  columns: {
    id: string;
    name: string;
    id_board?: string;
    created_at?: string;
    updated_at?: string;
  }[];
}

const API_URL = "/api/v1";

export async function fetchAllBoards(key: string): Promise<Board[]> {
  const response = await fetch(key);

  if (!response.ok) {
    throw new Error(`🔴 ${response.status} / Error fetching boards.`);
  }

  const responseBody = await response.json();

  return responseBody;
}

export async function fetchBoardById(key: string): Promise<Board> {
  const response = await fetch(key);

  if (!response.ok) {
    throw new Error(`🔴 ${response.status} / Error fetching board.`);
  }

  const responseBody = await response.json();

  return responseBody;
}

export async function fetchColumnsByBoardId(key: string): Promise<Column[]> {
  const response = await fetch(key);

  if (!response.ok) {
    throw new Error(`🔴 ${response.status} / Error fetching columns.`);
  }

  const responseBody = await response.json();

  return responseBody;
}

export async function createBoard(boardObject: BoardObject) {
  const createdBoardId = await createNewBoard();
  await createNewColumns();

  return createdBoardId;

  async function createNewBoard() {
    const response = await fetch(`${API_URL}/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: boardObject.name,
      }),
    });

    if (!response.ok) {
      throw new Error(`🔴 ${response.status} / Error creating a board.`);
    }

    const responseBody = await response.json();

    return responseBody.id;
  }

  async function createNewColumns() {
    if (boardObject.columns.length === 0) {
      return;
    }

    for (const column of boardObject.columns) {
      await fetch(`${API_URL}/boards/${createdBoardId}/columns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: column.name,
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`🔴 ${response.status} / Error creating a column.`);
        }
      });
    }
  }
}

export async function updateBoard(boardObject: BoardObject) {
  const updatedBoardId = await updateBoardName();
  const currentColumns = await fetchCurrentColumns();
  const columnsToDelete = await identifyColumnsToDelete(currentColumns);
  await deleteIdentifyColumns(columnsToDelete);
  await updateOrCreateColumns();

  return updatedBoardId;

  async function updateBoardName() {
    const response = await fetch(`${API_URL}/boards/${boardObject.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: boardObject.name,
      }),
    });

    if (!response.ok) {
      throw new Error(`🔴 ${response.status} / Error updating a board.`);
    }

    const responseBody = await response.json();

    return responseBody.id;
  }

  async function fetchCurrentColumns() {
    const response = await fetch(`${API_URL}/boards/${boardObject.id}/columns`);

    if (!response.ok) {
      throw new Error(`🔴 ${response.status} / Error fetching columns.`);
    }

    const responseBody = await response.json();

    return responseBody;
  }

  async function identifyColumnsToDelete(currentColumns: Column[]) {
    const columnsWithBoardId = boardObject.columns.filter(
      (column) => "board_id" in column,
    );

    return currentColumns.filter(
      (currentColumn) =>
        !columnsWithBoardId.some(
          (newColumn) => newColumn.id === currentColumn.id,
        ),
    );
  }

  async function deleteIdentifyColumns(columnsToDelete: Column[]) {
    const deletePromises = columnsToDelete.map((columnToDelete) => {
      return fetch(`${API_URL}/columns/${columnToDelete.id}`, {
        method: "DELETE",
      }).then((response) => {
        if (!response.ok)
          throw new Error(`🔴 ${response.status} / Error deleting column.`);
      });
    });

    await Promise.all(deletePromises);
  }

  async function updateOrCreateColumns() {
    if (boardObject.columns.length === 0) {
      return;
    }

    for (const column of boardObject.columns) {
      if ("board_id" in column) {
        await fetch(`${API_URL}/columns/${column.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: column.name,
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`🔴 ${response.status} / Error updating a column.`);
          }
        });
      } else {
        await fetch(`${API_URL}/boards/${boardObject.id}/columns`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: column.name,
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`🔴 ${response.status} / Error creating a column.`);
          }
        });
      }
    }
  }
}

export async function deleteBoard(boardId: string) {
  const response = await fetch(`${API_URL}/boards/${boardId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`🔴 ${response.status} / Error deleting board.`);
  }
}
