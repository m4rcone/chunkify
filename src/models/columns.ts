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

const columns = {
  create,
};

export default columns;
