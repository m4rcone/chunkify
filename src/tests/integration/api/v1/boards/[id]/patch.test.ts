import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/boards/:id", () => {
  test("With existent 'id' and valid data", async () => {
    const responsePOST = await fetch("http://localhost:3000/api/v1/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "BoardName",
      }),
    });

    expect(responsePOST.status).toBe(201);

    const responsePOSTBody = await responsePOST.json();
    const boardId = responsePOSTBody.id;

    const responsePATCH = await fetch(
      `http://localhost:3000/api/v1/boards/${boardId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "BoardNewName",
        }),
      },
    );

    expect(responsePATCH.status).toBe(200);

    const responsePATCHBody = await responsePATCH.json();

    expect(responsePATCHBody).toEqual({
      id: responsePATCHBody.id,
      name: "BoardNewName",
      created_at: responsePATCHBody.created_at,
      updated_at: responsePATCHBody.updated_at,
    });
  });
});
