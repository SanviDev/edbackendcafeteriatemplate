import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";

dotenv.config({ path: "./src/.env" });

const app = express();
const port = process.env.PORT || 4040;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/api/reservas', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM reservas');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/reservas', express.json(), async (req, res) => {
    const { nombre, email, telefono, fecha, hora, personas } = req.body;
    try {
        const [result] = await db.query('INSERT INTO reservas (nombre, email, telefono, fecha, hora, invitados) VALUES (?, ?, ?, ?, ?, ?)', [nombre, email, telefono, fecha, hora, personas]);
        res.status(201).json({ id: result.insertId, nombre, email, telefono, fecha, hora, personas });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

