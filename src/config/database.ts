import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const dbPath = path.resolve(__dirname, "../../database.db");

let db: DatabaseSync;

try {
  db = new DatabaseSync(dbPath);
  db.exec("PRAGMA foreign_keys = ON;");
} catch (err) {
  console.error("Erro ao conectar ao banco:", err);
  process.exit(1);
}

export { db };
