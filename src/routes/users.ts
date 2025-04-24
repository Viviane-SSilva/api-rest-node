import { Router, Request, Response } from 'express';
import db from '../db/database';

const router = Router();

// Create

router.post('/', (req: Request, res: Response) => {
    const { name, email } = req.body;

    db.run(
        'INSERT INTO users (NAME, EMAIL) values (?, ?)', [name, email],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.status(201).json ({ id: this.lastID, name, email });

        });
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
    const {name, email} = req.body;
    db.run(
        'UPDATE users SET name = ?, email = ? WHERER id = ?',
        [name, email, req.params.id],
        function(err) {
            if (err) return res.status(400).json({error: err.message});
            res.json({ update: this.changes });  
        }   
    );
});

//Delete

router.delete('/id', (req: Request, res: Response) => {
    db.run('DELETE FROM users WHERE id= ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({error: err.message});
        res.json({ deleted: this.changes });    
    });
});

export default router;