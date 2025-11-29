// controllers/predictController.js
const { getModelInfo, predict } = require("../services/tfModelService");
const predictionModel = require("../model/predictionModel");
const predictionService = require('../services/predictionService');

function health(req, res) {
  res.json({
    status: "ok",
    service: "predict"
  });
}

function ready(req, res) {
  const info = getModelInfo();

  if (!info.ready) {
    return res.status(503).json({
      ready: false,
      modelVersion: info.modelVersion,
      message: "Model is still loading"
    });
  }

  res.json({
    ready: true,
    modelVersion: info.modelVersion
  });
}


async function doPredict(req, res) {
  const start = Date.now();

  try {
    const info = getModelInfo();
    if (!info.ready) {
      return res.status(503).json({
        error: "Model not ready",
        ready: false
      });
    }

    const { features, meta } = req.body;

    if (!features) {
      return res.status(400).json({ error: "Missing features" });
    }
    if (!meta || typeof meta !== "object") {
      return res.status(400).json({ error: "Missing meta object" });
    }

    const { featureCount } = meta;

    if (featureCount !== info.inputDim) {
      return res.status(400).json({
        error: `featureCount must be ${info.inputDim}, received ${featureCount}`
      });
    }

    if (!Array.isArray(features) || features.length !== info.inputDim) {
      return res.status(400).json({
        error: `features must be an array of ${info.inputDim} numbers`
      });
    }

    const prediction = await predict(features);
    const latencyMs = Date.now() - start;
    const timestamp = new Date().toISOString();

    const modelVersion = info.modelVersion;
    
    const newPrediction = new PredictionModel({
        features: features, 
        prediction: prediction, 
        ts: timestamp,
        modelVersion: info.modelVersion
    });

    // Guardar el documento en la base de datos
    const predictionStored = await newPrediction.save();

    res.status(201).json({
      predictionId: predictionStored._id,
      prediction,
      timestamp,
      latencyMs
    });
  } catch (err) {
    console.error("Error en /predict:", err);
    res.status(500).json({ error: "Internal error" });
  }
}

// Tarea A: Controlador para el listado (GET /api/predict)
async function getPredictions(req, res) {
    try {
        const listado = await predictionService.obtenerTodasLasPredicciones();
        res.status(200).json({ total: listado.length, predictions: listado }); 
    } catch (err) {
        res.status(500).json({ error: `Error al obtener el listado: ${err.message}` });
    }
}

// Tarea B: Controlador para eliminar (DELETE /api/predict/:id)
async function deletePrediction(req, res) {
    const id = req.params.id;
    try {
        const prediccionEliminada = await predictionService.eliminarPrediccion(id);

        if (!prediccionEliminada) {
            return res.status(404).json({ mensaje: 'No existe predicción con ese ID' });
        }
        
        res.status(200).json({ mensaje: 'Predicción eliminada', id: prediccionEliminada._id });
    } catch (err) {
        res.status(500).json({ error: `Error al eliminar: ${err.message}` });
    }
}

module.exports = {
  health,
  ready,
  doPredict, 
  getPredictions,
  deletePrediction
};
