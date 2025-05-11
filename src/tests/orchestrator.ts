import database from "infra/database";
import boards, { BoardObject } from "models/boards";
import columns, { columnObject } from "models/columns";
import migrator from "models/migrator";
import subtasks, { SubtaskObject } from "models/subtasks";
import tasks, { type TaskObject } from "models/tasks";

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public");
}

async function runPendingMigrations() {
  await migrator.runMigrations(false);
}

async function createBoard(boardObject: {
  name: string;
}): Promise<BoardObject> {
  return await boards.create(boardObject);
}

async function createColumn(
  boardId: string,
  columnObject: { name: string },
): Promise<columnObject> {
  return await columns.create(boardId, columnObject);
}

async function createTask(
  columnId: string,
  taskObject: TaskObject,
): Promise<TaskObject> {
  return await tasks.create(columnId, taskObject);
}

async function createSubtask(
  taskId: string,
  subtaskObject: SubtaskObject,
): Promise<SubtaskObject> {
  return await subtasks.create(taskId, subtaskObject);
}

const orchestrator = {
  clearDatabase,
  runPendingMigrations,
  createBoard,
  createColumn,
  createTask,
  createSubtask,
};

export default orchestrator;
