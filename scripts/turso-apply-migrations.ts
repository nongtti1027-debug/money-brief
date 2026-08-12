/**
 * Applies each prisma/migrations/<dir>/migration.sql directly to a remote
 * libSQL (Turso) database via @libsql/client, bypassing `prisma migrate deploy`.
 *
 * Why: Prisma 7's SQLite migration engine only accepts `file:` URLs for the
 * `sqlite` provider — it rejects `libsql://` with P1013, even though the
 * `@prisma/adapter-libsql` driver adapter (used at runtime by the app) works
 * fine against Turso. This script is the workaround for applying schema
 * changes to Turso; re-run it whenever a new migration is added.
 *
 * Usage: npx tsx scripts/turso-apply-migrations.ts
 * Requires DATABASE_URL in .env to be the libsql:// Turso URL.
 */
import "dotenv/config";
import { readFileSync, readdirSync } from "fs";
import path from "path";
import { createClient } from "@libsql/client";

const MIGRATIONS_DIR = path.join(process.cwd(), "prisma", "migrations");

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.startsWith("libsql://")) {
    throw new Error(
      "DATABASE_URL must be a libsql:// Turso URL (with ?authToken=...) to use this script."
    );
  }

  const client = createClient({ url });

  const migrationDirs = readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const dir of migrationDirs) {
    const sqlPath = path.join(MIGRATIONS_DIR, dir, "migration.sql");
    const sql = readFileSync(sqlPath, "utf-8");
    console.log(`Applying ${dir}...`);
    await client.executeMultiple(sql);
  }

  console.log(`Done. Applied ${migrationDirs.length} migration(s) to ${new URL(url).host}.`);
  client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
