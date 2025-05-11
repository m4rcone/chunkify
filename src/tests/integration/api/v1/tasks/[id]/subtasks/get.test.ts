import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/tasks/[id]/subtasks", () => {
  test("With valid task 'id' and at least one task", async () => {
    const createdBoard = await orchestrator.createBoard({
      name: "Board Name",
    });

    const createdColumn = await orchestrator.createColumn(createdBoard.id, {
      name: "Column Name",
    });

    const createdTask = await orchestrator.createTask(createdColumn.id, {
      title: "Task title",
      description: "Task description...",
    });

    const createdSubtask = await orchestrator.createSubtask(createdTask.id, {
      title: "Subtask title",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/tasks/${createdTask.id}/subtasks`,
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);

    expect(responseBody).toEqual([
      {
        id: createdSubtask.id,
        title: "Subtask title",
        is_completed: createdSubtask.is_completed,
        created_at: createdSubtask.created_at.toISOString(),
        updated_at: createdSubtask.updated_at.toISOString(),
        task_id: createdTask.id,
      },
    ]);
  });

  test("With valid task 'id' and without subtasks", async () => {
    const createdBoard = await orchestrator.createBoard({
      name: "Board Name",
    });

    const createdColumn = await orchestrator.createColumn(createdBoard.id, {
      name: "Column Name",
    });

    const createdTask = await orchestrator.createTask(createdColumn.id, {
      title: "Task title",
      description: "Task description...",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/tasks/${createdTask.id}/subtasks`,
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);

    expect(responseBody).toEqual([]);
  });

  test("With invalid task 'id'", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/tasks/39cd9896-50cf-4cb2-b317-3565dd36d2c4/subtasks",
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
