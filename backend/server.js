require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Rota 'items' e os métodos HTTP feitos para ela

// Registra um novo item.

app.post('/items', async (req, res) => {
    const { nome_item } = req.body;

    if (!nome_item) {
        return res.status(400).send("Nome do item é obrigatório");
    }

    try {
        await db.query(
            "INSERT INTO items (nome_item) VALUES (?)",
            [nome_item]
        );

        return res.status(201).send("Item adicionado com sucesso");

    } catch (err) {
        console.error("Erro ao adicionar item", err);
        return res.status(500).send("Erro interno no servidor");
    }
});

// Busca todos os itens.

app.get('/items', async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM items");

        return res.json(results);

    } catch (err) {
        console.error("Erro ao buscar itens", err);
        return res.status(500).send("Erro interno no servidor");
    }
});

// Busca item pelo ID.

app.get('/items/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await db.query(
            "SELECT * FROM items WHERE id = ?",
            [id]
        );

        if (results.length === 0) {
            return res.status(404).send("Item não encontrado");
        }

        return res.json(results[0]);

    } catch (err) {
        console.error("Erro ao buscar id do item", err);
        return res.status(500).send("Erro interno no servidor");
    }
});

// Atualiza um item pelo ID.

app.put('/items/:id', async (req, res) => {
    const { id } = req.params;
    const { nome_item } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE items SET nome_item = ? WHERE id = ?",
            [nome_item, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send("Item não encontrado");
        }

        return res.status(200).send("Item atualizado com sucesso!");

    } catch (err) {
        console.error("Erro ao atualizar item", err);
        return res.status(500).send("Erro interno no servidor");
    }
});

// Deleta item pelo ID.

app.delete('/items/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            "DELETE FROM items WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send("Item não encontrado");
        }

        return res.status(200).send("Item deletado com sucesso!");

    } catch (err) {
        console.error("Erro ao deletar item", err);
        return res.status(500).send("Erro interno no servidor");
    }
});

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
    console.log(`Servidor Rodando na Porta: ${PORT}`);
});