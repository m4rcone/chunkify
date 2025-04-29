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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const boardFound = await findOneById(id);
  const boardUpdated = await runUpdateQuery(id, boardInputValues);

  return boardUpdated;

  async function runUpdateQuery(
    id: string,
    boardInputValues: { name: string },
  ) {
    const result = await database.query({
      text: `
        UPDATE
          boards
        SET
          name = $1
        WHERE
          id = $2
        RETURNING
          *
      `,
      values: [boardInputValues.name, id],
    });

    return result.rows[0];
  }
}

const boards = {
  getAll,
  findOneById,
  create,
  update,
};

export default boards;
