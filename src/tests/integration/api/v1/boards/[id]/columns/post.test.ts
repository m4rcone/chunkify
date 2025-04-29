import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/boards/:id/columns", () => {
  test("With valid board 'id' and data", async () => {
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

    expect(responseCreateColumnBody).toEqual({
      id: responseCreateColumnBody.id,
      name: "Column Name",
      created_at: responseCreateColumnBody.created_at,
      updated_at: responseCreateColumnBody.updated_at,
      board_id: boardId,
    });
  });

  test("With invalid board 'id'", async () => {
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

    const responseCreateColumn = await fetch(
      "http://localhost:3000/api/v1/boards/39cd9896-50cf-4cb2-b317-3565dd36d2c4/columns",
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

    expect(responseCreateColumn.status).toBe(404);
  });
});
