import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/boards/:id", () => {
  test("With existent 'id'", async () => {
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

    const responseGET = await fetch(
      `http://localhost:3000/api/v1/boards/${boardId}`,
    );

    expect(responseGET.status).toBe(200);

    const responseGETBody = await responseGET.json();

    expect(responseGETBody).toEqual({
      id: responsePOSTBody.id,
      name: "BoardName",
      created_at: responsePOSTBody.created_at,
      updated_at: responsePOSTBody.updated_at,
    });
  });

  test("With non-existent 'id'", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/boards/39cd9896-50cf-4cb2-b317-3565dd36d2c4",
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
