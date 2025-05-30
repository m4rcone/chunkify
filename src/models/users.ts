import database from "infra/database";
import { ValidationError } from "infra/errors";
import password from "./password";

type UserInputValues = {
  username: string;
  email: string;
  password: string;
};

async function create(userInputValues: UserInputValues) {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const createdUser = await runInsertQuery();

  return createdUser;

  async function runInsertQuery() {
    const result = await database.query({
      text: `
        INSERT INTO
          users (username, email, password)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      `,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return result.rows[0];
  }
}

// async function findOneByUsername(username: string) {
//   const userFound = await runSelectQuery(username);

//   return userFound;

//   async function runSelectQuery(username: string) {
//     const result = await database.query({
//       text: `
//         SELECT
//           *
//         FROM
//           users
//         WHERE
//           username = $1
//         LIMIT
//           1
//       `,
//       values: [username],
//     });

//     if (result.rowCount < 0) {
//       throw new NotFoundError({
//         message: "O username informado não foi encontrado no sistema.",
//         action: "Verifique o username informado e tente novamente.",
//       });
//     }

//     return result.rows[0];
//   }
// }

async function validateUniqueUsername(username: string) {
  const result = await database.query({
    text: `
        SELECT
          *
        FROM
          users
        WHERE
          username = $1
        LIMIT
          1
      `,
    values: [username],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O username informado já está sendo utilizado",
      action: "Utilize outro username para realizar a operação",
    });
  }
}

async function validateUniqueEmail(email: string) {
  const result = await database.query({
    text: `
        SELECT
          *
        FROM
          users
        WHERE
          email = $1
        LIMIT
          1
      `,
    values: [email],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado",
      action: "Utilize outro email para realizar a operação",
    });
  }
}

async function hashPasswordInObject(userInputValues: UserInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const users = {
  create,
};

export default users;
