// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Case = require("./models/Case");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 4000;

// ===== Middlewares =====
app.use(cors());            // Permite peticiones desde tu frontend (Live Server)
app.use(express.json());    // Para leer JSON en req.body

// ===== Conexión a MongoDB =====
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err);
  });

// ===== Rutas =====

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API EcoRecicla funcionando" });
});


// -------- USUARIOS --------

// Registro
app.post("/api/users/register", async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // OJO: en un proyecto real se usa bcrypt para encriptar
    const newUser = await User.create({ nombre, email, password, rol });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser._id,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Login
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password }); // sin encriptar, solo demo
    if (!user) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    res.json({
      message: "Login correcto",
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});


// -------- CASOS --------

// Obtener todos los casos
app.get("/api/cases", async (req, res) => {
  try {
    const casos = await Case.find().sort({ createdAt: -1 });
    res.json(casos);
  } catch (error) {
    console.error("Error al obtener casos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Crear nuevo caso
app.post("/api/cases", async (req, res) => {
  try {
    const { fecha, material, peso, ubicacion, estado, notas, creadoPor } = req.body;

    if (!fecha || !material || !peso || !ubicacion) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const nuevoCaso = await Case.create({
      fecha,
      material,
      peso,
      ubicacion,
      estado: estado || "Pendiente",
      notas,
      creadoPor,
    });

    res.status(201).json({
      message: "Caso creado correctamente",
      case: nuevoCaso,
    });
  } catch (error) {
    console.error("Error al crear caso:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});
