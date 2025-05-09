import database from "infra/database";
import boards from "./boards";
import { NotFoundError } from "infra/errors";

async function create(boardId: string, columnInputValues: { name: string }) {
  await boards.findOneById(boardId);
  const newColumn = await runInsertQuery(boardId, columnInputValues);

  return newColumn;

  async function runInsertQuery(
    boardId: string,
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
      values: [columnInputValues.name, boardId],
    });

    return result.rows[0];
  }
}

async function update(columnId: string, columnInputValues: { name: string }) {
  const columnFound = await findOneById(columnId);
  const columnWithNewValues = { ...columnFound, ...columnInputValues };
  const updatedColumn = await runUpdateQuery(columnWithNewValues);

  return updatedColumn;

  async function runUpdateQuery(columnWithNewValues: {
    id: string;
    name: string;
  }) {
    const result = await database.query({
      text: `
        UPDATE
          columns
        SET
          name = $1, 
          updated_at = timezone('UTC', now())
        WHERE
          id = $2
        RETURNING
          *
      `,
      values: [columnWithNewValues.name, columnWithNewValues.id],
    });

    return result.rows[0];
  }
}

async function deleteColumn(columnId: string) {
  await findOneById(columnId);
  await runDeleteQuery(columnId);

  async function runDeleteQuery(columnId: string) {
    await database.query({
      text: `
        DELETE FROM
          columns
        WHERE
          id = $1
      `,
      values: [columnId],
    });
  }
}

async function getColumnsByBoardId(boardId: string) {
  await boards.findOneById(boardId);
  const columnsFound = await runSelectQuery(boardId);

  return columnsFound;

  async function runSelectQuery(boardId: string) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          columns
        WHERE
          board_id = $1
        ORDER BY
          created_at
      `,
      values: [boardId],
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
