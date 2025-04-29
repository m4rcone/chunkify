import { NextResponse } from "next/server";
import database from "../../../infra/database";

export async function GET() {
  const result = await database.query("SELECT 5 + 5 AS sum;");
  console.log(result.rows[0]);

  return NextResponse.json(
    { teste: "query: SELECT 5 + 5 AS sum", result: result.rows[0] },
    { status: 200 },
  );
}
