import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/columns/:id", () => {
  test("With existent 'id' and valid data", async () => {
    const createdBoard = await orchestrator.createBoard({
      name: "Board Name",
    });

    const createdColumn = await orchestrator.createColumn(createdBoard.id, {
      name: "Column Name",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/columns/${createdColumn.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Column Name",
        }),
      },
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);

    expect(responseBody).toEqual({
      id: createdColumn.id,
      name: "New Column Name",
      created_at: createdColumn.created_at.toISOString(),
      updated_at: responseBody.updated_at,
      board_id: createdBoard.id,
    });

    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
  });

  test("With non-existent 'id'", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/columns/39cd9896-50cf-4cb2-b317-3565dd36d2c4",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Column Name Updated",
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
