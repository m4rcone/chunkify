import database from "infra/database";
import tasks from "./tasks";
import { NotFoundError } from "infra/errors";

export type SubtaskObject = {
  id?: string;
  title?: string;
  is_completed?: boolean;
  created_at?: Date;
  updated_at?: Date;
  task_id?: string;
};

async function create(taskId: string, subtaskInputValues: SubtaskObject) {
  await tasks.findOneById(taskId);
  const newSubtask = await runInsertQuery();

  return newSubtask;

  async function runInsertQuery() {
    const result = await database.query({
      text: `
        INSERT INTO
          subtasks (title, task_id)
        VALUES
          ($1, $2)
        RETURNING
          *
      `,
      values: [subtaskInputValues.title, taskId],
    });

    return result.rows[0];
  }
}

async function update(subtaskId: string, subtaskInputValues: SubtaskObject) {
  const subtaskFound = await findOneById(subtaskId);
  const subtaskWithNewValues = { ...subtaskFound, ...subtaskInputValues };
  const updatedSubtask = await runUpdateQuery();

  return updatedSubtask;

  async function runUpdateQuery() {
    const result = await database.query({
      text: `
        UPDATE
          subtasks
        SET
          title = $1,
          is_completed = $2,
          updated_at = timezone('UTC', now())
        WHERE
          id = $3
        RETURNING
          *
      `,
      values: [
        subtaskWithNewValues.title,
        subtaskWithNewValues.is_completed,
        subtaskId,
      ],
    });

    return result.rows[0];
  }
}

async function deleteSubtask(subtaskId: string) {
  await findOneById(subtaskId);
  await runDeleteQuery();

  async function runDeleteQuery() {
    await database.query({
      text: `
        DELETE FROM
          subtasks
        WHERE
          id = $1
      `,
      values: [subtaskId],
    });
  }
}

async function getSubtasksByTaskId(taskId: string) {
  await tasks.findOneById(taskId);
  const subtasksFound = await runSelectQuery();

  return subtasksFound;

  async function runSelectQuery() {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          subtasks
        WHERE
          task_id = $1
        ORDER BY
          created_at
      `,
      values: [taskId],
    });

    return result.rows;
  }
}

async function findOneById(subtaskId: string) {
  const subtaskFound = await runSelectQuery();

  return subtaskFound;

  async function runSelectQuery() {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          subtasks
        WHERE
          id = $1
        LIMIT
          1
      `,
      values: [subtaskId],
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

const subtasks = {
  create,
  update,
  deleteSubtask,
  getSubtasksByTaskId,
  findOneById,
};

export default subtasks;
