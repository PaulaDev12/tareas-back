//Importación de archivo de rutas
const db = require('../database');

module.exports = (app) => {

//Obtener todas las tareas existentes
app.get('/api/entries', (req, res) => {
    db.all('SELECT * FROM entries', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Ingresar nueva tarea
app.post('/api/entries', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }
    const sql = 'INSERT INTO entries (title, content, published, completed) VALUES (?, ?, ?, ?)';
    const params = [title, content, new Date().toISOString(), false];
    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, title, content, published: params[2], completed: params[3] });
    });
});

// Editar tarea
app.put('/api/entries/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    const sql = 'UPDATE entries SET title = ?, content = ? WHERE id = ?';
    db.run(sql, [title, content, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.json({ id, title, content });
    });
});

// Eliminar tarea
app.delete('/api/entries/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const sql = 'DELETE FROM entries WHERE id = ?';
    db.run(sql, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.status(204).send();
    });
});

  // Alternar el estado de completado de una tarea
  app.patch('/api/entries/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT * FROM entries WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        const newStatus = !row.completed;
        const sql = 'UPDATE entries SET completed = ? WHERE id = ?';
        db.run(sql, [newStatus, id], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id, completed: newStatus });
        });
    });
});
 
}

