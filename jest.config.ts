import type { Config } from "jest";
import nextJest from "next/jest.js";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.development",
});

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  testTimeout: 60000,
};

export default createJestConfig(config);
