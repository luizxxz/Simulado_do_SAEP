const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'kanban-db',
    password: '1234', 
    port: 5432,
});

pool.connect((err) => {
    if (err) console.error('Erro de conexão:', err.message);
    else console.log('conectado ao PostgreSQL');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.post('/api/usuarios', async (req, res) => {
    const { nome, email } = req.body;
    try {
        await pool.query('INSERT INTO usuarios (nome, email) VALUES ($1, $2)', [nome, email]);
        res.status(201).json({ message: 'usuario criado' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios ORDER BY nome');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/tarefas', async (req, res) => {
    const { id_usuario, descricao, setor, prioridade } = req.body;
    try {
        await pool.query('INSERT INTO tarefas (id_usuario, descricao, setor, prioridade, status) VALUES ($1, $2, $3, $4, $5)', 
        [id_usuario, descricao, setor, prioridade, 'a fazer']);
        res.status(201).json({ message: 'Tarefa criada!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/tarefas', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, u.nome as nome_usuario 
            FROM tarefas t 
            JOIN usuarios u ON t.id_usuario = u.id
            ORDER BY t.id ASC
        `);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/tarefas/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE tarefas SET status = $1 WHERE id = $2', [status, id]);
        res.json({ message: 'status atualizado' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/tarefas/:id', async (req, res) => {
    const { id } = req.params;
    const { id_usuario, descricao, setor, prioridade } = req.body;
    try {
        await pool.query(
            'UPDATE tarefas SET id_usuario = $1, descricao = $2, setor = $3, prioridade = $4 WHERE id = $5',
            [id_usuario, descricao, setor, prioridade, id]
        );
        res.json({ message: 'Tarefa atualizada!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/tarefas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tarefas WHERE id = $1', [id]);
        res.json({ message: 'Tarefa excluída!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(3000, () => {
    console.log('Servidor em http://localhost:3000');
});