const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Função para conectar e criar tabela
async function initDB() {
    try {
        const connection = await pool.getConnection();

        console.log('MySQL Conectado! Banco integrado com sucesso!');

        connection.release();

        const createTableSql = `
            CREATE TABLE IF NOT EXISTS items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome_item VARCHAR(255) NOT NULL
            );
        `;

        await pool.query(createTableSql);

        console.log("Tabela 'items' verificada/criada. Tudo pronto para guardar seus dados!");

    } catch (err) {
        console.error('Erro ao conectar ou criar tabela:', err);
    }
}

// Inicializa o banco
initDB();

module.exports = pool;