import migrationRunner from "node-pg-migrate";
import { resolve } from "path";
import database from "infra/database";
import { type Client } from "pg";

async function runMigrations(dryRun: boolean) {
  let dbClient: Client | undefined;

  try {
    dbClient = await database.getNewClient();
    const migrationsPath = resolve("src", "infra", "migrations");

    const result = await migrationRunner({
      dbClient,
      dryRun,
      dir: migrationsPath,
      direction: "up",
      log: () => {},
      migrationsTable: "pgmigrations",
    });

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (dbClient) {
      await dbClient?.end();
    }
  }
}

const migrator = {
  runMigrations,
};

export default migrator;
