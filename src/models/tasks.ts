import database from "infra/database";
import columns from "./columns";
import { NotFoundError } from "infra/errors";

export type TaskObject = {
  id?: string;
  title?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
  column_id?: string;
};

async function create(columnId: string, taskInputValues: TaskObject) {
  await columns.findOneById(columnId);
  const newTask = await runInsertQuery();

  return newTask;

  async function runInsertQuery() {
    const result = await database.query({
      text: `
      INSERT INTO
        tasks (title, description, column_id)
      VALUES
        ($1, $2, $3)
      RETURNING
        *
      `,
      values: [taskInputValues.title, taskInputValues.description, columnId],
    });

    return result.rows[0];
  }
}

async function update(taskId: string, taskInputValues: TaskObject) {
  const taskFound: TaskObject = await findOneById(taskId);
  const taskWithNewValues = { ...taskFound, ...taskInputValues };
  const updatedTask = await runUpdateQuery();

  return updatedTask;

  async function runUpdateQuery() {
    const result = await database.query({
      text: `
        UPDATE
          tasks
        SET
          title = $1,
          description = $2,
          column_id = $3,
          updated_at = timezone('UTC', now())
        WHERE
          id = $4
        RETURNING
          *
      `,
      values: [
        taskWithNewValues.title,
        taskWithNewValues.description,
        taskWithNewValues.column_id,
        taskId,
      ],
    });

    return result.rows[0];
  }
}

async function deleteTask(taskId) {
  await findOneById(taskId);
  await runDeleteQuery();

  async function runDeleteQuery() {
    await database.query({
      text: `
        DELETE FROM
          tasks
        WHERE
          id = $1
      `,
      values: [taskId],
    });
  }
}

async function getTasksByColumnId(columnId: string) {
  await columns.findOneById(columnId);
  const tasksFound = await runSelectQuery();

  return tasksFound;

  async function runSelectQuery() {
    const result = await database.query({
      text: `
        SELECT 
          *
        FROM
          tasks
        WHERE
          column_id = $1
        ORDER BY
          updated_at
      `,
      values: [columnId],
    });

    return result.rows;
  }
}

async function findOneById(taskId: string) {
  const taskFound = await runSelectQuery();

  return taskFound;

  async function runSelectQuery() {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          tasks
        WHERE
          id = $1
        LIMIT
          1
      `,
      values: [taskId],
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

const tasks = {
  create,
  update,
  deleteTask,
  getTasksByColumnId,
  findOneById,
};

export default tasks;
