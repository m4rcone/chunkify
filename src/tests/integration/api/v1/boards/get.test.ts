import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/boards", () => {
  test("Retrieving all boards", async () => {
    const createdBoard1 = await orchestrator.createBoard({
      name: "Board Name 1",
    });

    const response = await fetch("http://localhost:3000/api/v1/boards");
    const responseBody = await response.json();

    expect(response.status).toBe(200);

    expect(responseBody).toEqual([
      {
        id: createdBoard1.id,
        name: createdBoard1.name,
        created_at: createdBoard1.created_at.toISOString(),
        updated_at: createdBoard1.updated_at.toISOString(),
      },
    ]);
  });
});
