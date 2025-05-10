import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/columns/[id]/tasks", () => {
  test("With valid column 'id' and data", async () => {
    const createdBoard = await orchestrator.createBoard({
      name: "Board Name",
    });

    const createdColumn = await orchestrator.createColumn(createdBoard.id, {
      name: "Column Name",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/columns/${createdColumn.id}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Task Title",
          description: "Task description...",
        }),
      },
    );
    const responseBody = await response.json();

    expect(response.status).toBe(201);

    expect(responseBody).toEqual({
      id: responseBody.id,
      title: "Task Title",
      description: "Task description...",
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
      column_id: createdColumn.id,
    });
  });

  test("With invalid column 'id'", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/columns/39cd9896-50cf-4cb2-b317-3565dd36d2c4/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Task Title",
          description: "Task description...",
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
