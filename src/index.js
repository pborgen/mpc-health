#!/usr/bin/env node

import { startServer } from "./server.js";

startServer().catch((err) => {
  console.error("MCP server failed:", err);
  process.exit(1);
});
