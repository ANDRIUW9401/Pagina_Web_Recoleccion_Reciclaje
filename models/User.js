// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // En un proyecto real se debe encriptar
    rol: { type: String, enum: ["ciudadano", "recolector", "administrador"], default: "ciudadano" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
