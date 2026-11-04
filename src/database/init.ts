import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const dbPath = path.resolve(__dirname, "../../database.db");
const schemaPath = path.resolve(__dirname, "schema.sql");

try {
  // Lendo o arquivo do schema de forma síncrona
  const schema = fs.readFileSync(schemaPath, "utf-8");

  // Inicializando o banco de dados nativo do Node.js
  const db = new DatabaseSync(dbPath);

  // Executa o schema SQL diretamente (criação de tabelas, etc.)
  db.exec(schema);

  console.log("Banco inicializado com sucesso em", dbPath);

  // O DatabaseSync gerencia a conexão nativamente,
  // mas caso queira liberar o arquivo explicitamente, você pode usar:
  db.close();

} catch (err) {
  console.error("Erro ao inicializar o banco de dados:", err);
  process.exit(1);
}
