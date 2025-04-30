import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/columns/:id", () => {
  test("With existent 'id' and valid data", async () => {
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

    const responseUpdateColumn = await fetch(
      `http://localhost:3000/api/v1/columns/${columnId}`,
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

    expect(responseUpdateColumn.status).toBe(200);

    const responseUpdateColumnBody = await responseUpdateColumn.json();

    expect(responseUpdateColumnBody.id).toBe(columnId);
    expect(responseUpdateColumnBody.name).toBe("Column Name Updated");
    expect(responseUpdateColumnBody.created_at).toBe(
      responseCreateColumnBody.created_at,
    );
    expect(
      new Date(responseUpdateColumnBody.updated_at).getTime(),
    ).toBeGreaterThan(new Date(responseCreateColumnBody.updated_at).getTime());
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
