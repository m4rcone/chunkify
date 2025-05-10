describe("PATCH /api/v1/boards", () => {
  test("Retrieving method not allowed error handling", async () => {
    const response = await fetch("http://localhost:3000/api/v1/boards", {
      method: "PATCH",
    });
    const respondeBody = await response.json();

    expect(response.status).toBe(405);

    expect(respondeBody).toEqual({
      name: "MethodNotAllowedError",
      message: "Método não permitido para este endpoint.",
      action: "Verifique se o método HTTP enviado é válido para este endpoint.",
      status_code: 405,
    });
  });
});
