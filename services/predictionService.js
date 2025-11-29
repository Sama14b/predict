const PredictionModel = require('../model/predictionModel');


// Tarea A: Obtener todos los registros guardados (Read All)
async function obtenerTodasLasPredicciones() {
    try {
        return await PredictionModel.find({}); 
    } catch (err) {
        throw new Error(`Error en servicio: No se pudo obtener el listado de predicciones: ${err}`);
    }
}

// Tarea B: Eliminar una predicción por ID (Delete)
async function eliminarPrediccion(id) {
    try {
        return await PredictionModel.findByIdAndDelete(id); 
    } catch (err) {
        throw new Error(`Error en servicio: No se pudo eliminar la predicción: ${err}`);
    }
}

module.exports = {
    obtenerTodasLasPredicciones,
    eliminarPrediccion
};