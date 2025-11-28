// models/prediction.model.js
'use strict';

// Importamos la librería Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// =========================================================
// Definición del Esquema: PredictionSchema
// Representa la estructura del documento que se guardará 
// en la colección 'predictions' de MongoDB.
// =========================================================
const PredictionSchema = new Schema({
    // Las 7 características de entrada (features) usadas para la predicción
    features: { 
        type: [Number], // Esperamos un array de números
        required: true 
    },
    // El valor de consumo eléctrico predicho por el modelo ML
    prediction: { 
        type: Number,   
        required: true 
    },
    // La marca de tiempo de la creación del registro (opcional, pero útil)
    ts: { 
        type: Date,     
        default: Date.now // Asigna la fecha y hora actual por defecto
    },
    // Referencia opcional a la versión del modelo ML que generó la predicción
    modelVersion: {
        type: String
    }
});

// Exportamos el modelo para poder usarlo en otras partes del código (ej. controladores)
module.exports = mongoose.model('Prediction', PredictionSchema);