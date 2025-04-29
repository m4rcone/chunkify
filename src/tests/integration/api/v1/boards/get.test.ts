import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/boards", () => {
  test("Retrieving all boards", async () => {
    const responsePost1 = await fetch("http://localhost:3000/api/v1/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "BoardName1",
      }),
    });
    const responsePost1Body = await responsePost1.json();

    expect(responsePost1.status).toBe(201);

    const responsePost2 = await fetch("http://localhost:3000/api/v1/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "BoardName2",
      }),
    });
    const responsePost2Body = await responsePost2.json();

    expect(responsePost2.status).toBe(201);

    const response = await fetch("http://localhost:3000/api/v1/boards");
    expect(response.status).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toEqual([
      {
        id: responsePost1Body.id,
        name: responsePost1Body.name,
        created_at: responsePost1Body.created_at,
        updated_at: responsePost1Body.updated_at,
      },
      {
        id: responsePost2Body.id,
        name: responsePost2Body.name,
        created_at: responsePost2Body.created_at,
        updated_at: responsePost2Body.updated_at,
      },
    ]);
  });
});
