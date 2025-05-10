import database from "infra/database";
import boards, { BoardObject } from "models/boards";
import columns, { columnObject } from "models/columns";
import migrator from "models/migrator";

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

const orchestrator = {
  clearDatabase,
  runPendingMigrations,
  createBoard,
  createColumn,
};

export default orchestrator;
