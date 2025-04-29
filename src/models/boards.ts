import database from "infra/database";
import { NotFoundError } from "infra/errors";

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
      `,
    });

    return result.rows;
  }
}

async function findOneById(id: string) {
  const boardFound = await runSelectQuery(id);
  return boardFound;

  async function runSelectQuery(id: string) {
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
      values: [id],
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

async function create(boardInputValues: { name: string }) {
  const createdBoard = await runInsertQuery(boardInputValues);

  return createdBoard;

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

async function update(id: string, boardInputValues: { name: string }) {
  await findOneById(id);
  const boardUpdated = await runUpdateQuery(id, boardInputValues);

  return boardUpdated;

  async function runUpdateQuery(
    id: string,
    boardInputValues: { name: string },
  ) {
    const updatedAt = new Date().toISOString();
    const result = await database.query({
      text: `
        UPDATE
          boards
        SET
          name = $1, updated_at = $2
        WHERE
          id = $3
        RETURNING
          *
      `,
      values: [boardInputValues.name, updatedAt, id],
    });

    return result.rows[0];
  }
}

async function deleteBoard(id: string) {
  await findOneById(id);
  await runDeleteQuery(id);

  async function runDeleteQuery(id: string) {
    const result = await database.query({
      text: `
        DELETE FROM
          boards
        WHERE
          id = $1
      `,
      values: [id],
    });

    if (result.rowCount !== 1) {
      throw new NotFoundError({
        message: "O id informado não foi encontrado no sistema.",
        action: "Verifique o id informado e tente novamente.",
      });
    }
  }
}

const boards = {
  getAll,
  findOneById,
  create,
  update,
  deleteBoard,
};

export default boards;
