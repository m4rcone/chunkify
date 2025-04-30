import database from "infra/database";
import boards from "./boards";
import { NotFoundError } from "infra/errors";

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

async function update(idColumn: string, boardInputValues: { name: string }) {
  await findOneById(idColumn);
  const columnUpdated = await runUpdateQuery(idColumn, boardInputValues);

  return columnUpdated;

  async function runUpdateQuery(
    idColumn: string,
    boardInputValues: { name: string },
  ) {
    const updatedAt = new Date().toISOString();
    const result = await database.query({
      text: `
        UPDATE
          columns
        SET
          name = $1, updated_at = $2
        WHERE
          id = $3
        RETURNING
          *
      `,
      values: [boardInputValues.name, updatedAt, idColumn],
    });

    return result.rows[0];
  }
}

async function deleteColumn(idColumn: string) {
  await findOneById(idColumn);
  await runDeleteQuery(idColumn);

  async function runDeleteQuery(idColumn: string) {
    const result = await database.query({
      text: `
        DELETE FROM
          columns
        WHERE
          id = $1
      `,
      values: [idColumn],
    });

    if (result.rowCount !== 1) {
      throw new NotFoundError({
        message: "O id informado não foi encontrado no sistema.",
        action: "Verifique o id informado e tente novamente.",
      });
    }
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

async function findOneById(columnId: string) {
  const columnFound = await runSelectQuery(columnId);

  return columnFound;

  async function runSelectQuery(columnId: string) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          columns
        WHERE
          id = $1
        LIMIT
          1;
      `,
      values: [columnId],
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

const columns = {
  create,
  update,
  deleteColumn,
  getColumnsByBoardId,
  findOneById,
};

export default columns;
