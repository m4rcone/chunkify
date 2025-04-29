import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/boards", () => {
  test("With valid data", async () => {
    const response = await fetch("http://localhost:3000/api/v1/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "BoardName Válido",
      }),
    });

    expect(response.status).toBe(201);

    const responseBody = await response.json();
    expect(responseBody).toEqual({
      id: responseBody.id,
      name: "BoardName Válido",
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
  });
});
