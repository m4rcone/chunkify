import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/boards/:id/columns", () => {
  test("With valid board 'id' and with columns", async () => {
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

    const responseCreate1Column = await fetch(
      `http://localhost:3000/api/v1/boards/${boardId}/columns`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Column Name 1",
        }),
      },
    );
    const responseCreate1ColumnBody = await responseCreate1Column.json();

    expect(responseCreate1Column.status).toBe(201);

    const responseCreateColumn2 = await fetch(
      `http://localhost:3000/api/v1/boards/${boardId}/columns`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Column Name 2",
        }),
      },
    );
    const responseCreate2ColumnBody = await responseCreateColumn2.json();

    expect(responseCreateColumn2.status).toBe(201);

    const responseGET = await fetch(
      `http://localhost:3000/api/v1/boards/${boardId}/columns`,
    );

    expect(responseGET.status).toBe(200);

    const responseGETBody = await responseGET.json();

    expect(responseGETBody).toEqual([
      {
        id: responseCreate1ColumnBody.id,
        name: "Column Name 1",
        created_at: responseCreate1ColumnBody.created_at,
        updated_at: responseCreate1ColumnBody.updated_at,
        board_id: boardId,
      },
      {
        id: responseCreate2ColumnBody.id,
        name: "Column Name 2",
        created_at: responseCreate2ColumnBody.created_at,
        updated_at: responseCreate2ColumnBody.updated_at,
        board_id: boardId,
      },
    ]);
  });

  test("With valid board 'id' and without columns", async () => {
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

    const responseGET = await fetch(
      `http://localhost:3000/api/v1/boards/${boardId}/columns`,
    );

    expect(responseGET.status).toBe(200);

    const responseGETBody = await responseGET.json();

    expect(responseGETBody).toEqual([]);
  });

  test("With invalid board 'id'", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/boards/39cd9896-50cf-4cb2-b317-3565dd36d2c4/columns",
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
