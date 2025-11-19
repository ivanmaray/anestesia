import type { PatientRecord } from '../types/patient';


interface RiskScore {
  patientId?: string | undefined;
  risk: number; // Valor entre 0 y 1
  explanation: string;
  // nueva: predicted boolean (evento) y label categórica: Alto/Medio/Bajo
  predicted?: boolean;
  predictedLabel?: 'Alto' | 'Medio' | 'Bajo';
  // nuevo: tipo de evento predicho (operación/quirófano o REA - UCIRA/REA)
  predictedEventType?: 'QFX' | 'REA';
  details?: { [k: string]: number | string }
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x))
}

const generateRiskScore = (record: PatientRecord): RiskScore => {
  // Baseline and weights - crude but interpretable demo model
  const base = -2.0
  const wAge = 0.02 // age per year increases risk slightly
  const wMeds = 0.25 // each concomitant medication increases risk moderately
  const wEGRF = -0.03 // lower eGFR increases risk => negative weight on eGFR
  const wASTALT = 0.01 // higher AST/ALT slightly increase risk
  const wHgb = -0.05 // higher hemoglobin slightly protective
  const wPlatelets = -0.001 // higher platelets protective but small
  const wPrev = 0.3 // number of prior procedures
  const wMulti = 0.6 // multiresistant colonization is a significant risk factor

  const age = record.age ?? 50
  const medsCount = record.meds ? record.meds.length : 0
  const eGFR = record.eGFR ?? 90
  const ast = record.ast ?? 25
  const alt = record.alt ?? 25
  const hemoglobin = record.hemoglobina_g_dL ?? 13
  const platelets = record.plaquetas ?? 250
  const prev = record.n_prev_procedures ?? 0
  const multi = record.multiresistant ? 1 : 0

  // Weighted linear score
  const scoreRaw = base + (wAge * age) + (wMeds * medsCount) + (wEGRF * eGFR) + (wASTALT * (ast + alt) / 2) + (wHgb * hemoglobin) + (wPlatelets * platelets) + (wPrev * prev) + (wMulti * multi)
  const risk = sigmoid(scoreRaw)

  const explanation = `Modelo demo: basado en edad, comorbilidad meds (${medsCount}), eGFR ${eGFR} ml/min, AST/ALT ${ast}/${alt}, Hgb ${hemoglobin} g/dL, plaquetas ${platelets}, prevProcedures ${prev}${multi ? ', multiresistente' : ''}`
  const pRounded = Math.round(risk * 100)
  const predicted = risk >= 0.5
  const predictedLabel = pRounded >= 60 ? 'Alto' : (pRounded >= 30 ? 'Medio' : 'Bajo')
  // Regla demo para tipo de evento: REA si riesgo >= 70 o edad>75; QFX si riesgo 50-69; sino no pred
  let predictedEventType: 'QFX' | 'REA' | undefined = undefined
  if (predicted) {
    if (pRounded >= 70 || age >= 76) predictedEventType = 'REA'
    else predictedEventType = 'QFX'
  }
  return {
    patientId: record.id,
    risk,
    explanation,
    predicted,
    predictedLabel,
    predictedEventType,
    details: {
      age,
      medsCount,
      eGFR,
      ast,
      alt,
      hemoglobin,
      platelets,
      prev,
      multiresistant: record.multiresistant ? 1 : 0
    }
  }
};

const runPredictiveModel = (
  records: PatientRecord[],
  silentMode: boolean = false
): RiskScore[] => {
  const results = records.map((record) => generateRiskScore(record));
  if (!silentMode) {
    results.forEach((r) => console.log(`Paciente: ${r.patientId} - Riesgo: ${Math.round(r.risk * 100)}% - ${r.explanation}`));
  }
  return results;
};

export { generateRiskScore, runPredictiveModel };

// Modelo metadata (demo) — exportamos métricas inventadas para mostrar en UI
export const modelMetadata = {
  name: 'DemoRisk-v0',
  version: '0.1.0',
  task: 'Predicción de complicación perioperatoria',
  dataset: 'Synthetic preanesthesia sample',
  trainedOn: 2000,
  metrics: {
    accuracy: 0.74,
    precision: 0.71,
    recall: 0.68,
    f1: 0.695,
    auc: 0.81
  },
  note: 'Métricas inventadas (demo), calibrar con datos reales antes de producción.'
}