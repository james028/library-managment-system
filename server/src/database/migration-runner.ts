import 'dotenv/config';
import { Pool } from 'pg';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsPath = path.join(__dirname, 'migrations');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations
        (
            id
            BIGSERIAL
            PRIMARY
            KEY,
            name
            VARCHAR
        (
            255
        ) NOT NULL UNIQUE,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW
        (
        )
            );
    `);

    const files = await readdir(migrationsPath);

    const migrations = files.filter((file) => file.endsWith('.sql')).sort();

    const result = await client.query<{ name: string }>(`
        SELECT name
        FROM schema_migrations
        ORDER BY id;
    `);

    const appliedMigrations = new Set(result.rows.map((row) => row.name));

    for (const migration of migrations) {
      if (appliedMigrations.has(migration)) {
        continue;
      }

      console.log(`Applying migration: ${migration}`);

      const sql = await readFile(path.join(migrationsPath, migration), 'utf-8');

      await client.query('BEGIN');

      try {
        await client.query(sql);

        await client.query(
          `
            INSERT INTO schema_migrations (name)
            VALUES ($1);
        `,
          [migration],
        );

        await client.query('COMMIT');

        console.log(`Migration applied successfully: ${migration}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    console.log('Migrations finished.');
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
