import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/boards/:id", () => {
  test("With existent 'id'", async () => {
    const createdBoard = await orchestrator.createBoard({
      name: "Board Name",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/boards/${createdBoard.id}`,
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);

    expect(responseBody).toEqual({
      id: createdBoard.id,
      name: "Board Name",
      created_at: createdBoard.created_at.toISOString(),
      updated_at: createdBoard.updated_at.toISOString(),
    });
  });

  test("With non-existent 'id'", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/boards/39cd9896-50cf-4cb2-b317-3565dd36d2c4",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(404);

    expect(responseBody).toEqual({
      name: "NotFoundError",
      message: "O id informado não foi encontrado no sistema.",
      action: "Verifique o id informado e tente novamente.",
      status_code: 404,
    });
  });
});
