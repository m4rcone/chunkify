import database from "infra/database";

async function getAllBoards() {
  const boardsFounded = await runSelectQuery();

  return boardsFounded;

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

const boards = {
  getAllBoards,
  create,
};

export default boards;
