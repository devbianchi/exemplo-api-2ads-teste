import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const dbPath = path.resolve(__dirname, "../../database.db");

// Inicialização nativa e síncrona
export const db = new DatabaseSync(dbPath);

// Ativando foreign keys na API nativa
db.exec("PRAGMA foreign_keys = ON;");
