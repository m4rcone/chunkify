import bcrypt from "bcryptjs";

async function hash(password: string) {
  const rounds = getNumberOfRounds();

  return await bcrypt.hash(password, rounds);

  function getNumberOfRounds() {
    return process.env.NODE_ENV === "production" ? 14 : 1;
  }
}

async function compare(providedPassword: string, storedPassword: string) {
  return bcrypt.compare(providedPassword, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
