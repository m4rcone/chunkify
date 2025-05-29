// eslint-disable-next-line @typescript-eslint/no-require-imports
const { exec } = require("node:child_process");

process.stdout.write("\n🔴 Aguardando o postgres aceitar conexões.");

checkPostgres();

function checkPostgres() {
  exec(
    "docker exec postgres-dev pg_isready --host localhost",
    (error, stdout) => {
      if (stdout.includes("accepting connections")) {
        console.log("\nPostgres pronto e aceitando conexões!\n");

        return;
      }

      process.stdout.write(".");

      checkPostgres();
    },
  );
}
