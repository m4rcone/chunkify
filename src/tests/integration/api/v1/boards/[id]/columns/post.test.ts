import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/boards/:id/columns", () => {
  test("With valid board 'id' and data", async () => {
    const createdBoard = await orchestrator.createBoard({
      name: "Board Name",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/boards/${createdBoard.id}/columns`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Column Name",
        }),
      },
    );
    const responseBody = await response.json();

    expect(response.status).toBe(201);

    expect(responseBody).toEqual({
      id: responseBody.id,
      name: "Column Name",
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
      board_id: createdBoard.id,
    });
  });

  test("With invalid board 'id'", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/boards/39cd9896-50cf-4cb2-b317-3565dd36d2c4/columns",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Column Name",
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
