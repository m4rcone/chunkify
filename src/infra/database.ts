import { Client } from "pg";
import { ServiceError } from "./errors";

type QueryObject = {
  text: string;
  values?: string[];
};

async function query(queryObject: QueryObject | string) {
  let client: Client | undefined;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);

    return result;
  } catch (error) {
    throw new ServiceError({
      cause: error,
      message: "Erro na conexão com o Database ou na Query.",
    });
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });

  await client.connect();

  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
