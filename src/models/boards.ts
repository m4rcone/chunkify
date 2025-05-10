import database from "infra/database";
import { NotFoundError } from "infra/errors";

export type BoardObject = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
};

async function create(boardInputValues: { name: string }) {
  const newBoard = await runInsertQuery(boardInputValues);

  return newBoard;

  async function runInsertQuery(boardInputValues: { name: string }) {
    const result = await database.query({
      text: `
      INSERT INTO
        boards (name)
      VALUES
       ($1)
      RETURNING
       *
      `,
      values: [boardInputValues.name],
    });

    return result.rows[0];
  }
}

async function update(boardId: string, boardInputValues: { name: string }) {
  const boardFound = await findOneById(boardId);
  const boardWithNewValues = { ...boardFound, ...boardInputValues };
  const updatedBoard = await runUpdateQuery(boardWithNewValues);

  return updatedBoard;

  async function runUpdateQuery(boardWithNewValues: {
    id: string;
    name: string;
  }) {
    const result = await database.query({
      text: `
        UPDATE
          boards
        SET
          name = $1, 
          updated_at = timezone('UTC', now())
        WHERE
          id = $2
        RETURNING
          *
      `,
      values: [boardWithNewValues.name, boardWithNewValues.id],
    });

    return result.rows[0];
  }
}

async function deleteBoard(boardId: string) {
  await findOneById(boardId);
  await runDeleteQuery(boardId);

  async function runDeleteQuery(boardId: string) {
    await database.query({
      text: `
        DELETE FROM
          boards
        WHERE
          id = $1
      `,
      values: [boardId],
    });
  }
}

async function getAll() {
  const boardsFound = await runSelectQuery();

  return boardsFound;

  async function runSelectQuery() {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          boards
        ORDER BY
          created_at
      `,
    });

    return result.rows;
  }
}

async function findOneById(boardId: string) {
  const boardFound = await runSelectQuery(boardId);

  return boardFound;

  async function runSelectQuery(boardId: string) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          boards
        WHERE
          id = $1
        LIMIT
          1
      `,
      values: [boardId],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O id informado não foi encontrado no sistema.",
        action: "Verifique o id informado e tente novamente.",
      });
    }

    return result.rows[0];
  }
}

const boards = {
  create,
  update,
  deleteBoard,
  getAll,
  findOneById,
};

export default boards;
