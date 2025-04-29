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
    const originalUpdatedAt = responsePOSTBody.updated_at;

    expect(responsePATCHBody.id).toBe(responsePOSTBody.id);
    expect(responsePATCHBody.name).toBe("BoardNewName");
    expect(responsePATCHBody.created_at).toBe(responsePOSTBody.created_at);
    expect(new Date(responsePATCHBody.updated_at).getTime()).toBeGreaterThan(
      new Date(originalUpdatedAt).getTime(),
    );
  });

  test("With non-existent 'id'", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/boards/39cd9896-50cf-4cb2-b317-3565dd36d2c4",
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

    expect(response.status).toBe(404);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "NotFoundError",
      message: "O id informado não foi encontrado no sistema.",
      action: "Verifique o id informado e tente novamente.",
      status_code: 404,
    });
  });
});
