import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "jest-fixed-jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  projects: [
    {
      testPathIgnorePatterns: ["<rootDir>/node_modules/"],
      preset: "ts-jest",
      displayName: "client",
      testMatch: ["<rootDir>/client/src/components/**/**/*.test.tsx", "<rootDir>/client/src/components/**/**/*.spec.tsx"],
    }
  ],
};

export default config;