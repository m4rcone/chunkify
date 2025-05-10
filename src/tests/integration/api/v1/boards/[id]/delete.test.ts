import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/boards/:id", () => {
  test("With existent 'id'", async () => {
    const createdBoard = await orchestrator.createBoard({
      name: "Board Name",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/boards/${createdBoard.id}`,
      {
        method: "DELETE",
      },
    );

    expect(response.status).toBe(204);

    const responseGET = await fetch("http://localhost:3000/api/v1/boards");
    const responseGETBody = await responseGET.json();

    expect(responseGETBody).toEqual([]);
  });

  test("With non-existent 'id'", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/boards/39cd9896-50cf-4cb2-b317-3565dd36d2c4",
      {
        method: "DELETE",
      },
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
