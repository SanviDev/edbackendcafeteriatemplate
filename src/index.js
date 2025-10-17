import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";

dotenv.config({ path: "./src/.env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/api/reservas", async (req, res) => {
    console.log("GET /api/reservas recibido");
    try {
        console.log("Intentando consultar la base de datos...");
        const [rows] = await db.query("SELECT * FROM reservas");
        console.log("Consulta exitosa:", rows);
        res.json(rows);
    } catch (err) {

        console.error(err);
        res.status(500).json({ error: err.message });
        console.log("Error al consultar la base de datos:", err);
    }
});

app.post("/api/reservas", express.json(), async (req, res) => {
    const { name, email, phone, date, time, guest } = req.body;
    console.log("POST /api/reservas recibido con datos:", req.body);
    try {
        console.log("Intentando insertar en la base de datos...");
        const [result] = await db.query(
            "INSERT INTO reservas (nombre, email, telefono, fecha, hora, invitados) VALUES (?, ?, ?, ?, ?, ?)",
            [name, email, phone, date, time, guest]
        );
        console.log("Inserción exitosa, ID:", result.insertId);
        res
            .status(201)
            .json({ id: result.insertId, nombre, email, telefono, fecha, hora, invitados });
        console.log("Respuesta enviada al cliente.");
        console.log("Reserva creada con éxito:", { id: result.insertId, name, email, phone, date, time, guest });
        console.log("Datos recibidos:", req.body);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
        console.log("Error al insertar en la base de datos:", err);
    }
});

    
export default app;
