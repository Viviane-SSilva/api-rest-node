import { Router, Request, Response } from 'express';
import db from '../db/database';
import bcrypt from 'bcrypt';


const router = Router();

// Create

router.post('/', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    //Validação simples de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Preencha todos os campos.' });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'E-mail inválido.' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        db.run(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword],
            function (err) {
                if (err) return res.status(400).json({ error: err.message });
                res.status(201).json({ id: this.lastID, name, email });
            }
        );
    } catch (err) {

        return res.status(500).json({ error: 'Erro ao criar usuário.' });
    }

});

// Read

router.get('/', (_req: Request, res: Response) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

//Update

router.put('/:id', (req: Request, res: Response) => {
    const { name, email } = req.body;
    db.run(
        'UPDATE users SET name = ?, email = ? WHERER id = ?',
        [name, email, req.params.id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ update: this.changes });
        }
    );
});

//Delete

router.delete('/id', (req: Request, res: Response) => {
    db.run('DELETE FROM users WHERE id= ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});


export default router;
