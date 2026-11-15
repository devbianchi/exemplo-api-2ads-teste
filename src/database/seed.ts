import { db } from "../config/database";

try {
  // Inicia uma transação para garantir que tudo rode junto ou nada seja salvo em caso de erro
  db.exec("BEGIN TRANSACTION;");

  // Limpa as tabelas (exec substitui o run para comandos simples sem parâmetros)
  db.exec(`
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM products;
    DELETE FROM customers;
  `);

  // Prepara e executa os inserts de clientes
  const insertCustomer = db.prepare(
    "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)"
  );
  insertCustomer.run("Maria Silva", "maria@email.com", "11999990001");
  insertCustomer.run("João Pereira", "joao@email.com", "11999990002");

  // Prepara e executa os inserts de produtos
  const insertProduct = db.prepare(
    "INSERT INTO products (name, description, price) VALUES (?, ?, ?)"
  );
  insertProduct.run("Arroz 5kg", "Arroz branco tipo 1", 28.90);
  insertProduct.run("Feijão 1kg", "Feijão carioca", 9.50);
  insertProduct.run("Óleo de Soja 900ml", null, 7.20);

  db.exec("COMMIT;");
  console.log("Seed executado com sucesso.");
} catch (error) {
  db.exec("ROLLBACK;");
  console.error("Erro ao executar o seed:", error);
}
