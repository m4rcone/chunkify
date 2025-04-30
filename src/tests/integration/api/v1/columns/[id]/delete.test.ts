import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/columns/:id", () => {
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

    const responseDELETE = await fetch(
      `http://localhost:3000/api/v1/columns/${columnId}`,
      {
        method: "DELETE",
      },
    );

    expect(responseDELETE.status).toBe(204);

    const responseGET = await fetch(
      `http://localhost:3000/api/v1/columns/${columnId}`,
    );
    const responseGETBody = await responseGET.json();

    expect(responseGET.status).toBe(404);
    expect(responseGETBody).toEqual({
      name: "NotFoundError",
      message: "O id informado não foi encontrado no sistema.",
      action: "Verifique o id informado e tente novamente.",
      status_code: 404,
    });
  });

  test("With non-existent 'id'", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/columns/39cd9896-50cf-4cb2-b317-3565dd36d2c4",
      {
        method: "DELETE",
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
