import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/columns/:id", () => {
  test("With existent 'id'", async () => {
    const responseCreateBoard = await fetch(
      "http://localhost:3000/api/v1/boards",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Board Name",
        }),
      },
    );

    expect(responseCreateBoard.status).toBe(201);

    const responseCreateBoardBody = await responseCreateBoard.json();
    const boardId = responseCreateBoardBody.id;

    const responseCreateColumn = await fetch(
      `http://localhost:3000/api/v1/boards/${boardId}/columns`,
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

    expect(responseCreateColumn.status).toBe(201);

    const responseCreateColumnBody = await responseCreateColumn.json();
    const columnId = responseCreateColumnBody.id;

    const responseGET = await fetch(
      `http://localhost:3000/api/v1/columns/${columnId}`,
    );

    expect(responseGET.status).toBe(200);

    const responseGETBody = await responseGET.json();

    expect(responseGETBody).toEqual({
      id: columnId,
      name: responseCreateColumnBody.name,
      created_at: responseCreateColumnBody.created_at,
      updated_at: responseCreateColumnBody.updated_at,
      board_id: boardId,
    });
  });

  test("With non-existent 'id'", async () => {
    const responseGET = await fetch(
      "http://localhost:3000/api/v1/columns/39cd9896-50cf-4cb2-b317-3565dd36d2c4",
    );

    expect(responseGET.status).toBe(404);

    const responseGETBody = await responseGET.json();

    expect(responseGETBody).toEqual({
      name: "NotFoundError",
      message: "O id informado não foi encontrado no sistema.",
      action: "Verifique o id informado e tente novamente.",
      status_code: 404,
    });
  });
});
