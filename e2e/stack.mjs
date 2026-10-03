// Starts everything the end-to-end tests need, on their own ports, database and Redis index, so a normal `npm run dev` setup
// keeps running untouched:
//   fake AI :8100 · API :4100 · worker · web :3100 · Postgres database `docmind_e2e` · Redis db 1 · files in .e2e-storage
// Playwright runs this as its `webServer` and stops it (SIGTERM) when the tests end.
import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const webDir = fileURLToPath(new URL("../", import.meta.url));
const apiDir = fileURLToPath(
  new URL("../../docmind-api-service/", import.meta.url),
);
const require = createRequire(`${apiDir}package.json`);

const PORTS = { ai: 8100, api: 4100, web: 3100 };
const ADMIN_URL =
  process.env.E2E_ADMIN_DATABASE_URL ??
  "postgres://docmind:docmind@localhost:5432/postgres";
const DATABASE_URL =
  process.env.E2E_DATABASE_URL ??
  "postgres://docmind:docmind@localhost:5432/docmind_e2e";
const REDIS_URL = process.env.E2E_REDIS_URL ?? "redis://localhost:6379/1";
const INTERNAL_API_KEY = "e2e-internal-key-123456";

const children = [];
const log = (message) => console.log(`[e2e] ${message}`);
const stopAll = () => {
  for (const child of children) child.kill("SIGTERM");
  process.exit(0);
};
process.on("SIGTERM", stopAll);
process.on("SIGINT", stopAll);

function run(label, command, args, options) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.status !== 0) {
    console.error(`[e2e] ${label} failed (exit ${result.status})`);
    process.exit(1);
  }
}

function start(label, command, args, options) {
  const child = spawn(command, args, {
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });
  const prefix = (stream) =>
    stream.on("data", (data) =>
      String(data)
        .split("\n")
        .filter(Boolean)
        .forEach((line) => console.log(`[${label}] ${line}`)),
    );
  prefix(child.stdout);
  prefix(child.stderr);
  child.on("exit", (code) => {
    if (code) console.error(`[e2e] ${label} stopped with exit ${code}`);
  });
  children.push(child);
  return child;
}

async function waitFor(label, url) {
  for (let i = 0; i < 120; i++) {
    try {
      if ((await fetch(url)).ok) return log(`${label} is up`);
    } catch {
      // not yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.error(`[e2e] ${label} did not come up at ${url}`);
  process.exit(1);
}

// ---- 1. a clean database and Redis index ----
const { Client } = require("pg");
const admin = new Client({ connectionString: ADMIN_URL });
await admin.connect();
const dbName = new URL(DATABASE_URL).pathname.slice(1);
if (!dbName.endsWith("_e2e"))
  throw new Error(
    `Refusing to use "${dbName}": the end-to-end database name must end in _e2e.`,
  );
if (
  (await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]))
    .rowCount === 0
) {
  await admin.query(`CREATE DATABASE "${dbName}"`);
  log(`created database ${dbName}`);
}
await admin.end();

const apiEnv = {
  ...process.env,
  NODE_ENV: "development",
  API_PORT: String(PORTS.api),
  LOG_LEVEL: "warn",
  WEB_ORIGIN: `http://localhost:${PORTS.web}`,
  DATABASE_URL,
  REDIS_URL,
  JWT_SECRET: "e2e-jwt-secret-e2e-jwt-secret-e2e-jwt-secret",
  INTERNAL_API_KEY,
  STORAGE_DIR: "./.e2e-storage",
  AI_SERVICE_URL: `http://localhost:${PORTS.ai}`,
  RERANK_ENABLED: "false",
};

run("migrations", "npx", ["drizzle-kit", "migrate"], {
  cwd: apiDir,
  env: apiEnv,
});
const db = new Client({ connectionString: DATABASE_URL });
await db.connect();
await db.query("TRUNCATE users CASCADE");
await db.end();
const Redis = require("ioredis");
const redis = new Redis(REDIS_URL);
await redis.flushdb();
await redis.quit();
run("storage cleanup", "rm", ["-rf", ".e2e-storage"], { cwd: apiDir });

// ---- 2. build the API into its own folder (so `nest start --watch` and its dist/ are not disturbed) ----
log("building the API...");
run(
  "API build",
  "npx",
  ["tsc", "-p", "tsconfig.build.json", "--outDir", ".e2e-build"],
  { cwd: apiDir },
);

// ---- 3. the services ----
start("fake-ai", "node", ["e2e/fake-ai.mjs"], {
  cwd: webDir,
  env: { ...process.env, FAKE_AI_PORT: String(PORTS.ai), INTERNAL_API_KEY },
});
await waitFor("fake AI", `http://localhost:${PORTS.ai}/health`);
start("api", "node", [".e2e-build/main.js"], { cwd: apiDir, env: apiEnv });
start("worker", "node", [".e2e-build/worker.js"], { cwd: apiDir, env: apiEnv });
await waitFor("API", `http://localhost:${PORTS.api}/api/v1/health`);

// ---- 4. the web app, built for production against the e2e API ----
const webEnv = {
  ...process.env,
  NEXT_DIST_DIR: ".next-e2e",
  NEXT_PUBLIC_API_URL: `http://localhost:${PORTS.api}/api/v1`,
  NEXT_PUBLIC_SITE_URL: `http://localhost:${PORTS.web}`,
};
log("building the web app...");
run("web build", "npx", ["next", "build"], { cwd: webDir, env: webEnv });
start("web", "npx", ["next", "start", "--port", String(PORTS.web)], {
  cwd: webDir,
  env: webEnv,
});
await waitFor("web", `http://localhost:${PORTS.web}/login`);
log("ready");
