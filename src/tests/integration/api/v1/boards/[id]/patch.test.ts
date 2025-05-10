import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/boards/:id", () => {
  test("With existent 'id' and valid data", async () => {
    const createdBoard = await orchestrator.createBoard({
      name: "Board Name",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/boards/${createdBoard.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Board Name",
        }),
      },
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);

    expect(responseBody.id).toBe(createdBoard.id);
    expect(responseBody.name).toBe("New Board Name");
    expect(responseBody.created_at).toBe(createdBoard.created_at.toISOString());
    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
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
          name: "New Board Name",
        }),
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
