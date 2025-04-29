import database from "infra/database";
import boards from "./boards";

async function create(idBoard: string, columnInputValues: { name: string }) {
  await boards.findOneById(idBoard);

  const newColumn = await runInsertQuery(idBoard, columnInputValues);

  return newColumn;

  async function runInsertQuery(
    idBoard: string,
    columnInputValues: { name: string },
  ) {
    const result = await database.query({
      text: `
        INSERT INTO
          columns (name, board_id)
        VALUES
          ($1, $2)
        RETURNING
          *
      `,
      values: [columnInputValues.name, idBoard],
    });

    return result.rows[0];
  }
}

async function getColumnsByBoardId(idBoard: string) {
  await boards.findOneById(idBoard);

  const columnsFound = await runSelectQuery(idBoard);

  return columnsFound;

  async function runSelectQuery(idBoard: string) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          columns
        WHERE
          board_id = $1
      `,
      values: [idBoard],
    });

    return result.rows;
  }
}

const columns = {
  create,
  getColumnsByBoardId,
};

export default columns;
