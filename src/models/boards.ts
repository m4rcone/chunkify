import database from "infra/database";

async function getAll() {
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

async function findOneById(id: string) {
  const boardFounded = await runSelectQuery(id);

  return boardFounded;

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
      throw new Error("Board not founded");
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
  const boardFounded = await findOneById(id);
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
  create,
  update,
};

export default boards;
