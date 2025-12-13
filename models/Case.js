// models/Case.js
const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    fecha: { type: Date, required: true },
    material: { type: String, required: true },
    peso: { type: Number, required: true },
    ubicacion: { type: String, required: true },
    estado: {
      type: String,
      enum: ["Pendiente", "En proceso", "Completado"],
      default: "Pendiente",
    },
    notas: { type: String },
    creadoPor: { type: String }, // nombre o email del usuario (simple)
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Case", caseSchema);
