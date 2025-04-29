import database from "infra/database";
import migrator from "models/migrator";

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public");
}

async function runPendingMigrations() {
  await migrator.runMigrations(false);
}

const orchestrator = {
  clearDatabase,
  runPendingMigrations,
};

export default orchestrator;
