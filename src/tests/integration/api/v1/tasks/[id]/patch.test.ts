import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/tasks/[id]", () => {
  test("With existent 'id' and only 'title'", async () => {
    const createdBoard = await orchestrator.createBoard({
      name: "Board Name",
    });

    const createdColumn = await orchestrator.createColumn(createdBoard.id, {
      name: "Column Name",
    });

    const createdTask = await orchestrator.createTask(createdColumn.id, {
      title: "Task Title",
      description: "Task description...",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/tasks/${createdTask.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Task Title",
        }),
      },
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);

    expect(responseBody).toEqual({
      id: createdTask.id,
      title: "New Task Title",
      description: createdTask.description,
      created_at: createdTask.created_at.toISOString(),
      updated_at: responseBody.updated_at,
      column_id: createdColumn.id,
    });

    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
  });

  test("With existent 'id' and only 'description'", async () => {
    const createdBoard = await orchestrator.createBoard({
      name: "Board Name",
    });

    const createdColumn = await orchestrator.createColumn(createdBoard.id, {
      name: "Column Name",
    });

    const createdTask = await orchestrator.createTask(createdColumn.id, {
      title: "Task Title",
      description: "Task description...",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/tasks/${createdTask.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: "New task description...",
        }),
      },
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);

    expect(responseBody).toEqual({
      id: createdTask.id,
      title: createdTask.title,
      description: "New task description...",
      created_at: createdTask.created_at.toISOString(),
      updated_at: responseBody.updated_at,
      column_id: createdColumn.id,
    });

    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
  });

  test("With existent 'id' and only 'column_id'", async () => {
    const createdBoard = await orchestrator.createBoard({
      name: "Board Name",
    });

    const createdColumn1 = await orchestrator.createColumn(createdBoard.id, {
      name: "Column Name",
    });

    const createdColumn2 = await orchestrator.createColumn(createdBoard.id, {
      name: "Column Name",
    });

    const createdTask = await orchestrator.createTask(createdColumn1.id, {
      title: "Task Title",
      description: "Task description...",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/tasks/${createdTask.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          column_id: createdColumn2.id,
        }),
      },
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);

    expect(responseBody).toEqual({
      id: createdTask.id,
      title: createdTask.title,
      description: createdTask.description,
      created_at: createdTask.created_at.toISOString(),
      updated_at: responseBody.updated_at,
      column_id: createdColumn2.id,
    });

    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
  });

  test("With existent 'id' and valid data", async () => {
    const createdBoard = await orchestrator.createBoard({
      name: "Board Name",
    });

    const createdColumn = await orchestrator.createColumn(createdBoard.id, {
      name: "Column Name",
    });

    const createdTask = await orchestrator.createTask(createdColumn.id, {
      title: "Task Title",
      description: "Task description...",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/tasks/${createdTask.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Task Title",
          description: "New task description...",
        }),
      },
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);

    expect(responseBody).toEqual({
      id: createdTask.id,
      title: "New Task Title",
      description: "New task description...",
      created_at: createdTask.created_at.toISOString(),
      updated_at: responseBody.updated_at,
      column_id: createdColumn.id,
    });

    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
  });

  test("With non-existent 'id'", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/tasks/39cd9896-50cf-4cb2-b317-3565dd36d2c4",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Task Title",
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
