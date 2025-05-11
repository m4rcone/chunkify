import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/subtasks/[id]", () => {
  test("With existent 'id' and only 'title' info", async () => {
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

    const createdSubtask = await orchestrator.createSubtask(createdTask.id, {
      title: "Subtask Title",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/subtasks/${createdSubtask.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Subtask Title",
        }),
      },
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);

    expect(responseBody).toEqual({
      id: createdSubtask.id,
      title: "New Subtask Title",
      is_completed: createdSubtask.is_completed,
      created_at: createdSubtask.created_at.toISOString(),
      updated_at: responseBody.updated_at,
      task_id: createdTask.id,
    });

    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
  });

  test("With existent 'id' and only 'is_completed' info", async () => {
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

    const createdSubtask = await orchestrator.createSubtask(createdTask.id, {
      title: "Subtask Title",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/subtasks/${createdSubtask.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_completed: true,
        }),
      },
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);

    expect(responseBody).toEqual({
      id: createdSubtask.id,
      title: createdSubtask.title,
      is_completed: true,
      created_at: createdSubtask.created_at.toISOString(),
      updated_at: responseBody.updated_at,
      task_id: createdTask.id,
    });

    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
  });

  test("With non-existent 'id'", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/subtasks/39cd9896-50cf-4cb2-b317-3565dd36d2c4",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Subtask title",
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
