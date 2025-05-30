import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Username",
          email: "username@email.com",
          password: "senhasegura",
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(201);

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "Username",
        email: "username@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With duplicated `username`", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "UsernameDuplicado",
          email: "usernameduplicado@email.com",
          password: "senhasegura",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "UsernameDuplicado",
          email: "usernameduplicado2@email.com",
          password: "senhasegura",
        }),
      });

      const response2Body = await response2.json();

      expect(response2.status).toBe(400);

      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado",
        action: "Utilize outro username para realizar a operação",
        status_code: 400,
      });
    });

    test("With duplicated `email`", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Username1",
          email: "emailduplicado@email.com",
          password: "senhasegura",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Username2",
          email: "emailduplicado@email.com",
          password: "senhasegura",
        }),
      });

      const response2Body = await response2.json();

      expect(response2.status).toBe(400);

      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado",
        action: "Utilize outro email para realizar a operação",
        status_code: 400,
      });
    });
  });
});
