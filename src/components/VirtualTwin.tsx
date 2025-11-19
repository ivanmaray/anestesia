import React, { useState } from 'react'

interface PatientData {
  // Demographics
  age: number
  weight: number
  height: number
  gender: 'M' | 'F'
  asa: number
  smoking: boolean
  // Clinical
  comorbidities: string[]
  cardiacHistory: string[]
  respiratoryHistory: string[]
  currentMedications: string[]
  allergies: string[]
  // Labs
  labs: { test: string; value: number; unit: string }[]
  // PGx
  pgx: { gene: string; genotype: string }[]
}

interface MedicationSimulation {
  drug: string
  dose: number
  unit: string
  route: string
}

interface SimulationResult {
  hemodynamic: { bp: string; hr: string; spo2: string }
  sedation: string
  respiration: string
  sideEffects: string[]
  warnings: string[]
  // Enhanced PK/PD
  pkpd: {
    onsetTime: string
    peakTime: string
    duration: string
    contextSensitiveHalfTime: string
  }
  // Enhanced respiratory
  ventilation: {
    tidalVolume: number // mL
    etco2: number // mmHg
    pattern: string
  }
  // Drug interactions
  interactions: string[]
  // Airway risk
  airwayRisk: {
    level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
    factors: string[]
    mallampati: number
  }
  // PGx alerts
  pgxAlerts: string[]
}

const VirtualTwin: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    age: 65,
    weight: 70,
    height: 170,
    gender: 'M',
    asa: 2,
    smoking: false,
    comorbidities: ['HTA', 'Diabetes'],
    cardiacHistory: [],
    respiratoryHistory: [],
    currentMedications: ['Enalapril', 'Metformina'],
    allergies: ['Penicilina'],
    labs: [
      { test: 'Creatinina', value: 1.2, unit: 'mg/dL' },
      { test: 'Hemoglobina', value: 12, unit: 'g/dL' },
      { test: 'Plaquetas', value: 250000, unit: '/mm³' },
      { test: 'AST', value: 25, unit: 'U/L' },
      { test: 'ALT', value: 30, unit: 'U/L' },
      { test: 'Bilirrubina', value: 0.8, unit: 'mg/dL' },
      { test: 'Sodio', value: 140, unit: 'mEq/L' },
      { test: 'Potasio', value: 4.2, unit: 'mEq/L' }
    ],
    pgx: [
      { gene: 'CYP2D6', genotype: 'NM' },
      { gene: 'CYP2C19', genotype: 'NM' },
      { gene: 'CYP3A4', genotype: 'NM' },
      { gene: 'CYP3A5', genotype: 'NM' },
      { gene: 'COMT', genotype: 'Val/Val' },
      { gene: 'OPRM1', genotype: 'AA' },
      { gene: 'RYR1', genotype: 'NN' },
      { gene: 'CACNA1S', genotype: 'NN' },
      { gene: 'UGT1A1', genotype: '6/6' }
    ]
  })

  const [medication, setMedication] = useState<MedicationSimulation>({
    drug: 'Propofol',
    dose: 2,
    unit: 'mg/kg',
    route: 'IV'
  })

  const [result, setResult] = useState<SimulationResult | null>(null)

  // Rescue interventions
  const [rescueInterventions, setRescueInterventions] = useState<{
    vasopressor?: 'phenylephrine' | 'norepinephrine'
    ventilation?: boolean
    cpr?: boolean
  }>({})

  const drugs = [
    'Propofol', 'Remifentanil', 'Fentanyl', 'Rocuronio', 'Succinilcolina', 'Midazolam'
  ]

  // Predefined options for clinical data
  const comorbidityOptions = ['HTA', 'Diabetes', 'Insuficiencia cardíaca', 'EPOC', 'Asma', 'Insuficiencia renal', 'Hepatopatía', 'Obesidad', 'SAHS', 'Artrosis cervical', 'Espondilitis']
  const cardiacHistoryOptions = ['IAM previo', 'FA', 'Bloqueo AV', 'Estenosis aórtica', 'Insuficiencia mitral']
  const respiratoryHistoryOptions = ['EPOC', 'Asma severa', 'Bronquiectasias', 'Fibrosis pulmonar']
  const medicationOptions = ['Enalapril', 'Metformina', 'Aspirina', 'Atorvastatina', 'Insulina', 'Salbutamol', 'Furosemida', 'Digoxina']
  const allergyOptions = ['Penicilina', 'AINES', 'Látex', 'Yodo', 'Sulfamidas', 'Anestésicos locales']

  // PGx genotype options
  const pgxOptions: { [key: string]: string[] } = {
    'CYP2D6': ['PM', 'IM', 'EM', 'UM'],
    'CYP2C19': ['PM', 'IM', 'EM', 'RM'],
    'CYP3A4': ['PM', 'IM', 'EM'],
    'CYP3A5': ['*1/*1', '*1/*3', '*3/*3'],
    'COMT': ['Val/Val', 'Val/Met', 'Met/Met'],
    'OPRM1': ['AA', 'AG', 'GG'],
    'RYR1': ['NN', 'NC', 'CC'],
    'CACNA1S': ['NN', 'NT', 'TT'],
    'UGT1A1': ['6/6', '6/7', '7/7', '7/8']
  }

  const simulate = () => {
    // Reset rescue interventions for each new simulation
    setRescueInterventions({})

    // Enhanced simulation logic based on patient data
    let baseBP = 120
    let baseHR = 70
    let sedation = 'Sin sedación'
    let respiration = 'Normal'
    const sideEffects: string[] = []
    const warnings: string[] = []

    // Demographics adjustments
    if (patientData.age > 65) {
      baseBP -= 10
      baseHR += 5
    }
    if (patientData.gender === 'F') {
      baseBP -= 5 // Women tend to have slightly lower BP
    }
    if (patientData.smoking) {
      baseHR += 10
      warnings.push('Fumador: mayor riesgo cardiovascular')
    }

    // ASA adjustments
    if (patientData.asa >= 3) {
      baseBP -= 15
      baseHR += 10
    }

    // Clinical history
    if (patientData.comorbidities.includes('HTA')) {
      baseBP += 20
    }
    if (patientData.comorbidities.includes('Diabetes')) {
      sideEffects.push('Hipoglucemia riesgo')
    }
    if (patientData.cardiacHistory.includes('IAM') || patientData.cardiacHistory.includes('FA')) {
      warnings.push('Historia cardíaca: monitorizar estrechamente')
      baseHR += 5
    }
    if (patientData.respiratoryHistory.includes('EPOC') || patientData.respiratoryHistory.includes('Asma')) {
      warnings.push('Historia respiratoria: riesgo depresión respiratoria')
    }

    // Current medications
    if (patientData.currentMedications.some(m => m.toLowerCase().includes('beta'))) {
      baseHR -= 10
      warnings.push('Betabloqueante: posible bradicardia')
    }
    if (patientData.currentMedications.some(m => m.toLowerCase().includes('ace'))) {
      baseBP -= 5
      warnings.push('IECAs: posible hipotensión')
    }

    // Labs
    const creatinine = patientData.labs.find(l => l.test === 'Creatinina')?.value || 1
    if (creatinine > 1.5) {
      warnings.push('Insuficiencia renal: ajustar dosis')
    }
    const hemoglobin = patientData.labs.find(l => l.test === 'Hemoglobina')?.value || 12
    if (hemoglobin < 10) {
      warnings.push('Anemia: mayor riesgo hipoxia')
    }
    const platelets = patientData.labs.find(l => l.test === 'Plaquetas')?.value || 250000
    if (platelets < 100000) {
      warnings.push('Trombocitopenia: riesgo hemorrágico')
    }
    const ast = patientData.labs.find(l => l.test === 'AST')?.value || 25
    const alt = patientData.labs.find(l => l.test === 'ALT')?.value || 30
    if (ast > 40 || alt > 40) {
      warnings.push('Hepatopatía: ajustar dosis fármacos hepatometabolizados')
    }
    const bilirubin = patientData.labs.find(l => l.test === 'Bilirrubina')?.value || 0.8
    if (bilirubin > 1.5) {
      warnings.push('Hiperbilirrubinemia: evaluar función hepática')
    }
    const sodium = patientData.labs.find(l => l.test === 'Sodio')?.value || 140
    if (sodium < 135 || sodium > 145) {
      warnings.push('Alteración sodio: riesgo arritmias')
    }
    const potassium = patientData.labs.find(l => l.test === 'Potasio')?.value || 4.2
    if (potassium < 3.5 || potassium > 5.5) {
      warnings.push('Alteración potasio: riesgo arritmias')
    }    // PGx
    const cyp2d6 = patientData.pgx.find(p => p.gene === 'CYP2D6')?.genotype
    const cyp2c19 = patientData.pgx.find(p => p.gene === 'CYP2C19')?.genotype
    const cyp3a4 = patientData.pgx.find(p => p.gene === 'CYP3A4')?.genotype
    const cyp3a5 = patientData.pgx.find(p => p.gene === 'CYP3A5')?.genotype
    const comt = patientData.pgx.find(p => p.gene === 'COMT')?.genotype
    const oprm1 = patientData.pgx.find(p => p.gene === 'OPRM1')?.genotype
    const ryr1 = patientData.pgx.find(p => p.gene === 'RYR1')?.genotype
    const cacna1s = patientData.pgx.find(p => p.gene === 'CACNA1S')?.genotype
    const ugt1a1 = patientData.pgx.find(p => p.gene === 'UGT1A1')?.genotype

    // UGT1A1 affects bilirubin metabolism
    if (ugt1a1 === '7/7' || ugt1a1 === '7/8') {
      if (bilirubin > 1.0) {
        warnings.push('UGT1A1 variante: mayor riesgo hiperbilirrubinemia')
      }
    }

    // Calculate airway risk
    const airwayRiskFactors: string[] = []
    let mallampatiScore = 1 // Default good airway

    if (patientData.weight > 100) {
      airwayRiskFactors.push('Obesidad')
      mallampatiScore = Math.max(mallampatiScore, 3)
    }
    if (patientData.comorbidities.includes('SAHS') || patientData.comorbidities.includes('Apnea del sueño')) {
      airwayRiskFactors.push('SAHS')
      mallampatiScore = Math.max(mallampatiScore, 4)
    }
    if (patientData.respiratoryHistory.includes('EPOC') || patientData.respiratoryHistory.includes('Asma severa')) {
      airwayRiskFactors.push('Enfermedad respiratoria')
      mallampatiScore = Math.max(mallampatiScore, 3)
    }
    if (patientData.comorbidities.includes('Artrosis cervical') || patientData.comorbidities.includes('Espondilitis')) {
      airwayRiskFactors.push('Limitación cervical')
      mallampatiScore = Math.max(mallampatiScore, 3)
    }
    if (patientData.age > 65) {
      airwayRiskFactors.push('Edad avanzada')
    }

    let airwayRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW'
    if (airwayRiskFactors.length >= 3 || mallampatiScore >= 4) {
      airwayRiskLevel = 'CRITICAL'
    } else if (airwayRiskFactors.length >= 2 || mallampatiScore >= 3) {
      airwayRiskLevel = 'HIGH'
    } else if (airwayRiskFactors.length >= 1) {
      airwayRiskLevel = 'MODERATE'
    }

    // PGx alerts
    const pgxAlerts: string[] = []
    if (cyp2d6 === 'PM') {
      pgxAlerts.push('CYP2D6 PM: mayor depresión con morfina/tramadol')
    }
    if (cyp2c19 === 'PM') {
      pgxAlerts.push('CYP2C19 PM: sedación más profunda con midazolam')
    }
    if ((ryr1 === 'CC' || ryr1 === 'CT') || (cacna1s === 'TT' || cacna1s === 'CT')) {
      pgxAlerts.push('🚨 RYR1/CACNA1S: RIESGO HIPERTERMIA MALIGNA')
    }
    if (comt === 'Met/Met') {
      pgxAlerts.push('COMT Met/Met: mayor sensibilidad a catecolaminas')
    }
    if (oprm1 === 'GG') {
      pgxAlerts.push('OPRM1 GG: menor respuesta a opioides')
    }

    // Age-specific responses
    if (patientData.age < 2) {
      warnings.push('Edad <2 años: respuesta variable a succinilcolina')
    }
    if (patientData.age >= 65) {
      warnings.push('Edad ≥65 años: sensibilidad ×1.4 a propofol')
    }
    if (patientData.age >= 80) {
      warnings.push('Edad ≥80 años: caída de TA ×2 con anestésicos')
    }

    // Initialize enhanced parameters
    let onsetTime = 'Inmediato'
    let peakTime = 'Inmediato'
    let duration = 'Corto'
    let contextSensitiveHalfTime = 'N/A'
    let tidalVolume = 500 // mL
    let etco2 = 35 // mmHg
    let respiratoryPattern = 'Normal'
    const interactions: string[] = []

    // Drug-specific effects
    switch (medication.drug) {
      case 'Propofol':
        const propofolDoseMgKg = medication.dose // assuming dose is in mg/kg

        // Hypotension: dose-dependent, more severe with higher doses
        let bpReduction = propofolDoseMgKg * 12 // 12 mmHg reduction per mg/kg
        if (bpReduction > 40) {
          warnings.push('Dosis alta: riesgo hipotensión severa')
        }

        // Age adjustment: elderly more sensitive
        if (patientData.age >= 65) {
          bpReduction *= 1.4 // 1.4x sensitivity
        }
        if (patientData.age >= 80) {
          bpReduction *= 1.5 // Additional sensitivity
        }

        baseBP -= bpReduction
        baseHR -= Math.min(30, propofolDoseMgKg * 4) // HR reduction up to 30 bpm

        // Sedation levels
        if (propofolDoseMgKg < 1.5) {
          sedation = 'Sedación ligera'
        } else if (propofolDoseMgKg < 2.5) {
          sedation = 'Sedación moderada'
        } else if (propofolDoseMgKg < 4) {
          sedation = 'Sedación profunda'
        } else {
          sedation = 'Anestesia general'
          respiration = 'Apnea'
          warnings.push('Dosis anestésica: soporte ventilatorio requerido')
        }

        // PK/PD parameters for propofol
        onsetTime = '30-45 segundos'
        peakTime = '1-2 minutos'
        duration = propofolDoseMgKg < 2 ? '10-15 min' : '20-30 min'
        contextSensitiveHalfTime = '3-5 min'

        // Respiratory effects
        if (propofolDoseMgKg > 2.5) {
          tidalVolume = Math.max(100, 500 - (propofolDoseMgKg - 2.5) * 150)
          etco2 = Math.min(60, 35 + (propofolDoseMgKg - 2.5) * 8)
          respiratoryPattern = 'Hipoventilación'
        } else if (propofolDoseMgKg > 3.5) {
          respiratoryPattern = 'Apnea'
          tidalVolume = 0
          etco2 = 70
        }

        // PGx effects
        if (cyp2c19 === 'PM') {
          bpReduction *= 1.2
          warnings.push('CYP2C19 PM: mayor efecto hipotensor')
        }
        if (cyp3a4 === 'PM') {
          bpReduction *= 1.15
          warnings.push('CYP3A4 PM: efecto prolongado de propofol')
        }
        // Malignant hyperthermia risk with volatile anesthetics, but propofol is IV
        if ((ryr1 === 'CC' || ryr1 === 'CT') || (cacna1s === 'TT' || cacna1s === 'CT')) {
          warnings.push('Riesgo hipertermia maligna: evitar anestésicos inhalatorios')
        }
        break

      case 'Remifentanil':
        const remiDoseMcgKgMin = medication.dose // assuming mcg/kg/min

        // Dose-dependent effects
        let remiBpReduction = remiDoseMcgKgMin * 50 // 50 mmHg per mcg/kg/min
        let remiHrReduction = remiDoseMcgKgMin * 60 // HR reduction

        baseHR -= remiHrReduction
        baseBP -= remiBpReduction

        if (remiDoseMcgKgMin > 0.2) {
          respiration = 'Depresión respiratoria moderada'
          sedation = 'Analgesia profunda'
          warnings.push('Dosis alta: monitorizar respiración')
        } else if (remiDoseMcgKgMin > 0.5) {
          respiration = 'Apnea'
          sedation = 'Sedación profunda'
          warnings.push('Dosis muy alta: soporte ventilatorio inmediato')
        } else if (remiDoseMcgKgMin > 0.05) {
          respiration = 'Depresión respiratoria leve'
          sedation = 'Analgesia moderada'
        } else {
          respiration = 'Normal'
          sedation = 'Analgesia leve'
        }

        // Age adjustment
        if (patientData.age > 70) {
          respiration = respiration === 'Normal' ? 'Depresión respiratoria leve' : 'Depresión respiratoria severa'
          warnings.push('Edad avanzada: mayor riesgo depresión respiratoria')
        }

        // Comorbidities
        if (patientData.respiratoryHistory.includes('EPOC')) {
          respiration = respiration === 'Normal' ? 'Depresión respiratoria moderada' : 'Apnea'
          warnings.push('EPOC: mayor riesgo insuficiencia respiratoria')
        }

        // PK/PD parameters for remifentanil
        onsetTime = '30-60 segundos'
        peakTime = '1-2 minutos'
        duration = '5-10 min'
        contextSensitiveHalfTime = remiDoseMcgKgMin <= 0.1 ? '3-4 min' : '8-12 min'

        // Respiratory effects
        if (remiDoseMcgKgMin > 0.1) {
          tidalVolume = Math.max(150, 500 - remiDoseMcgKgMin * 2000)
          etco2 = Math.min(55, 35 + remiDoseMcgKgMin * 100)
          respiratoryPattern = remiDoseMcgKgMin > 0.3 ? 'Apnea' : 'Hipoventilación'
        }
        break

      case 'Fentanyl':
        const fentanylDoseMcgKg = medication.dose

        // Dose-dependent effects
        let fentanylBpReduction = fentanylDoseMcgKg * 8 // 8 mmHg per mcg/kg
        let fentanylHrReduction = fentanylDoseMcgKg * 4 // HR reduction

        baseHR -= fentanylHrReduction
        baseBP -= fentanylBpReduction

        if (fentanylDoseMcgKg > 4) {
          respiration = 'Apnea'
          sedation = 'Sedación profunda'
          warnings.push('Dosis muy alta: soporte ventilatorio requerido')
        } else if (fentanylDoseMcgKg > 2) {
          respiration = 'Depresión respiratoria severa'
          sedation = 'Sedación'
          warnings.push('Dosis alta: riesgo apnea')
        } else if (fentanylDoseMcgKg > 1) {
          respiration = 'Depresión respiratoria moderada'
          sedation = 'Analgesia fuerte'
        } else {
          respiration = 'Depresión respiratoria leve'
          sedation = 'Analgesia'
        }

        // PGx
        if (cyp2d6 === 'UM') {
          warnings.push('CYP2D6 UM: efecto reducido, considerar dosis mayor')
          baseHR += 5 // less bradycardia
          baseBP += 5 // less hypotension
        } else if (cyp2d6 === 'PM') {
          warnings.push('CYP2D6 PM: mayor efecto, riesgo sobredosis')
          baseHR -= 5
          baseBP -= 5
        }
        if (cyp3a4 === 'PM') {
          warnings.push('CYP3A4 PM: efecto prolongado de fentanilo')
          baseHR -= 3
          baseBP -= 3
        }
        if (comt === 'Met/Met') {
          warnings.push('COMT Met/Met: mayor sensibilidad a opioides')
          baseHR -= 3
          baseBP -= 3
        }
        if (oprm1 === 'GG') {
          warnings.push('OPRM1 GG: menor respuesta a opioides, considerar dosis mayor')
          baseHR += 5
          baseBP += 5
        }

        // PK/PD parameters for fentanyl
        onsetTime = '1-2 minutos'
        peakTime = '3-5 minutos'
        duration = '30-60 min'
        contextSensitiveHalfTime = '180-300 min'

        // Respiratory effects
        if (fentanylDoseMcgKg > 2) {
          tidalVolume = Math.max(200, 500 - fentanylDoseMcgKg * 100)
          etco2 = Math.min(50, 35 + fentanylDoseMcgKg * 5)
          respiratoryPattern = fentanylDoseMcgKg > 4 ? 'Apnea' : 'Hipoventilación'
        }

        // Age adjustment
        if (patientData.age > 65) {
          respiration = respiration === 'Depresión respiratoria leve' ? 'Depresión respiratoria moderada' : 'Apnea'
        }
        break

      case 'Rocuronio':
        const rocuronioDoseMgKg = medication.dose
        sedation = 'Sin sedación'
        respiration = 'Parálisis neuromuscular (requiere intubación)'
        sideEffects.push('Parálisis neuromuscular', 'Requiere ventilación mecánica')
        warnings.push('🚨 Paciente paralizado: intubar y ventilar inmediatamente')
        sideEffects.push('Parálisis')

        // Dose-dependent duration
        if (rocuronioDoseMgKg >= 0.6) {
          sideEffects.push('Bloqueo neuromuscular completo')
        } else if (rocuronioDoseMgKg >= 0.3) {
          sideEffects.push('Bloqueo neuromuscular moderado')
        } else {
          sideEffects.push('Bloqueo neuromuscular leve')
        }

        // PK/PD parameters for rocuronium
        onsetTime = '1-2 minutos'
        peakTime = '3-5 minutos'
        duration = rocuronioDoseMgKg >= 0.6 ? '30-60 min' : '20-40 min'
        contextSensitiveHalfTime = '60-90 min'

        // Renal impairment affects duration
        if (creatinine > 1.5) {
          warnings.push('Insuficiencia renal: duración prolongada del bloqueo')
          duration = '60-90 min'
        }

        // Respiratory effects for paralysis
        tidalVolume = 0
        etco2 = 70
        respiratoryPattern = 'Apnea por parálisis'
        break

      case 'Succinilcolina':
        const succDoseMgKg = medication.dose
        sedation = 'Sin sedación'
        respiration = 'Parálisis neuromuscular (requiere intubación)'
        sideEffects.push('Parálisis', 'Fasciculaciones', 'Requiere ventilación mecánica')
        warnings.push('🚨 Paciente paralizado: intubar y ventilar inmediatamente')

        // Hyperkalemia risk
        if (patientData.comorbidities.some(c => ['Quemaduras', 'Neuropatía', 'Rabdomiólisis'].includes(c))) {
          warnings.push('Riesgo hiperpotasemia severa')
          sideEffects.push('Hiperpotasemia')
        } else {
          sideEffects.push('Hiperpotasemia leve')
        }

        // Dose-dependent duration (very short acting)
        if (succDoseMgKg > 1.5) {
          warnings.push('Dosis alta: duración prolongada')
        }

        // PK/PD parameters for succinylcholine
        onsetTime = '30-60 segundos'
        peakTime = '1 minuto'
        duration = '5-10 minutos'
        contextSensitiveHalfTime = 'N/A (hidrolizado)'

        // Age-specific response
        if (patientData.age < 2) {
          // Variable response in infants
          const randomFactor = 0.5 + Math.random() * 1.0 // 0.5-1.5x variability
          duration = `${Math.round(5 * randomFactor)}-${Math.round(10 * randomFactor)} minutos`
          warnings.push('Edad <2 años: respuesta variable a succinilcolina')
        }

        // PGx - Malignant hyperthermia risk
        if ((ryr1 === 'CC' || ryr1 === 'CT') || (cacna1s === 'TT' || cacna1s === 'CT')) {
          warnings.push('Riesgo hipertermia maligna: evitar succinilcolina si posible')
          sideEffects.push('Riesgo hipertermia maligna')
        }

        // Respiratory effects for paralysis
        tidalVolume = 0
        etco2 = 70
        respiratoryPattern = 'Apnea por parálisis'
        break

      case 'Midazolam':
        const midazolamDoseMgKg = medication.dose

        // Dose-dependent effects
        let midazolamBpReduction = midazolamDoseMgKg * 100 // 100 mmHg per mg/kg
        baseBP -= midazolamBpReduction

        if (midazolamDoseMgKg > 0.3) {
          sedation = 'Sedación muy profunda'
          respiration = 'Depresión respiratoria severa'
          warnings.push('Dosis muy alta: hipotensión severa, soporte hemodinámico')
        } else if (midazolamDoseMgKg > 0.15) {
          sedation = 'Sedación profunda'
          respiration = 'Depresión respiratoria moderada'
          if (midazolamBpReduction > 10) warnings.push('Dosis moderada-alta: posible hipotensión')
        } else if (midazolamDoseMgKg > 0.05) {
          sedation = 'Sedación moderada'
          respiration = 'Depresión respiratoria leve'
        } else {
          sedation = 'Sedación ansiolítica leve'
          respiration = 'Normal'
        }

        // Age adjustment
        if (patientData.age > 65) {
          sedation = midazolamDoseMgKg > 0.1 ? 'Sedación profunda' : 'Sedación moderada'
          warnings.push('Edad avanzada: mayor efecto sedante')
        }

        // PGx
        if (cyp2c19 === 'PM') {
          warnings.push('CYP2C19 PM: efecto prolongado, mayor sedación')
          if (sedation === 'Sedación moderada') sedation = 'Sedación profunda'
        }
        if (cyp3a4 === 'PM') {
          warnings.push('CYP3A4 PM: efecto prolongado de midazolam')
          if (sedation === 'Sedación moderada') sedation = 'Sedación profunda'
        }
        if (cyp3a5 === 'NN') {
          warnings.push('CYP3A5 NN: menor metabolismo, efecto prolongado')
          if (sedation === 'Sedación moderada') sedation = 'Sedación profunda'
        }

        // Hepatic impairment
        if (ast > 40 || alt > 40) {
          warnings.push('Hepatopatía: efecto prolongado')
          duration = '4-8 horas'
        }

        // PK/PD parameters for midazolam
        onsetTime = '1-5 minutos (IV)'
        peakTime = '5-10 minutos'
        duration = '1-3 horas'
        contextSensitiveHalfTime = '100-200 min'
        break
    }

    // Drug interactions
    const currentMeds = patientData.currentMedications.map(m => m.toLowerCase())

    // Propofol + opioid synergy
    if (medication.drug === 'Propofol' && currentMeds.some(m => m.includes('fentanyl') || m.includes('remifentanil') || m.includes('morfina'))) {
      interactions.push('SYNERGISTIC_RESPIRATORY_DEPRESSION')
      warnings.push('Propofol + opioide: depresión respiratoria 2x mayor')
      tidalVolume = Math.max(100, tidalVolume * 0.5)
      etco2 = Math.min(65, etco2 + 10)
      if (respiratoryPattern === 'Normal') respiratoryPattern = 'Hipoventilación'
    }

    // Opioid + benzodiazepine synergy
    if ((medication.drug === 'Fentanyl' || medication.drug === 'Remifentanil') &&
        currentMeds.some(m => m.includes('midazolam') || m.includes('diazepam'))) {
      interactions.push('SYNERGISTIC_RESPIRATORY_DEPRESSION')
      warnings.push('Opioide + benzodiazepina: riesgo apnea aumentado')
      if (respiratoryPattern === 'Normal') respiratoryPattern = 'Depresión respiratoria moderada'
      if (respiratoryPattern === 'Depresión respiratoria leve') respiratoryPattern = 'Apnea'
    }

    // Rocuronium in hepatic insufficiency
    if (medication.drug === 'Rocuronio' && (ast > 40 || alt > 40)) {
      interactions.push('PROLONGED_PARALYSIS')
      warnings.push('Insuficiencia hepática: duración rocuronio prolongada')
      sideEffects.push('Parálisis prolongada')
    }

    // Succinylcholine + hyperkalemia risk
    if (medication.drug === 'Succinilcolina') {
      if (patientData.comorbidities.some(c => ['Quemaduras', 'Neuropatía', 'Rabdomiólisis', 'Parálisis'].includes(c))) {
        interactions.push('HYPERKALEMIA_RISK')
        warnings.push('Riesgo hiperpotasemia severa con succinilcolina')
        sideEffects.push('Hiperpotasemia crítica')
      }
      // Pseudocholinesterase deficiency
      if (patientData.comorbidities.includes('Deficiencia pseudocolinesterasa')) {
        interactions.push('PROLONGED_PARALYSIS')
        warnings.push('Deficiencia pseudocolinesterasa: parálisis prolongada')
        sideEffects.push('Parálisis >24h')
      }
    }

    // Allergies
    if (patientData.allergies.some(a => medication.drug.toLowerCase().includes(a.toLowerCase()))) {
      warnings.push(`Alérgico a ${medication.drug}`)
    }

    // Apply drug-specific respiratory effects
    if (medication.drug === 'Midazolam') {
      if (respiration === 'Depresión respiratoria moderada') {
        tidalVolume = Math.max(300, tidalVolume * 0.7)
        etco2 = Math.min(50, etco2 + 8)
        respiratoryPattern = 'Hipoventilación'
      } else if (respiration === 'Depresión respiratoria severa') {
        tidalVolume = Math.max(200, tidalVolume * 0.5)
        etco2 = Math.min(60, etco2 + 15)
        respiratoryPattern = 'Hipoventilación severa'
      }
    }
    if (rescueInterventions.vasopressor === 'phenylephrine') {
      baseBP += 15 // +10-15 mmHg MAP
      warnings.push('Fenilefrina administrada: +15 mmHg PAM')
    } else if (rescueInterventions.vasopressor === 'norepinephrine') {
      baseBP += 20 // +HR and +MAP
      baseHR += 10
      warnings.push('Noradrenalina administrada: +20 mmHg PAM, +10 FC')
    }

    if (rescueInterventions.ventilation) {
      respiratoryPattern = 'Ventilación mecánica'
      etco2 = 35 // Normalizes ETCO2
      tidalVolume = 500 // Normal VT
      warnings.push('Paciente intubado y ventilado: SpO2 y ETCO2 normalizados')
    }

    if (rescueInterventions.cpr) {
      baseBP = Math.max(baseBP, 60) // CPR provides minimal circulation
      baseHR = Math.max(baseHR, 40) // Manual compressions
      respiratoryPattern = 'Ventilación con ambú'
      etco2 = Math.min(etco2, 45) // Some CO2 elimination
      warnings.push('🫀 RCP iniciada: circulación mínima restaurada')
    }

    // Check for cardiorespiratory arrest
    if (baseBP < 50 || baseHR < 30) {
      warnings.push('🚨 PARADA CARDIORRESPIRATORIA - Iniciar RCP inmediato')
    }

    const result: SimulationResult = {
      hemodynamic: baseBP < 50 || baseHR < 30 ? {
        bp: 'Parada cardiorrespiratoria',
        hr: '0 bpm',
        spo2: '0%'
      } : {
        bp: `${Math.max(0, baseBP)}/${Math.max(0, baseBP - 40)} mmHg`,
        hr: `${Math.max(0, baseHR)} bpm`,
        spo2: rescueInterventions.ventilation ? '98%' : (respiration.includes('Depresión') || respiratoryPattern === 'Apnea' ? (baseBP < 50 ? '70%' : '92%') : '98%')
      },
      sedation,
      respiration,
      sideEffects,
      warnings,
      pkpd: {
        onsetTime,
        peakTime,
        duration,
        contextSensitiveHalfTime
      },
      ventilation: {
        tidalVolume,
        etco2,
        pattern: respiratoryPattern
      },
      interactions,
      airwayRisk: {
        level: airwayRiskLevel,
        factors: airwayRiskFactors,
        mallampati: mallampatiScore
      },
      pgxAlerts
    }
    setResult(result)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Virtual Twin Anestesia</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_0.4fr_2fr] gap-4">
        {/* Patient Data Panel */}
        <div className="card overflow-y-auto">
          <h4 className="text-lg font-semibold mb-4 text-white">Datos del Paciente</h4>
          <div className="space-y-3">
            <details className="bg-slate-700 rounded p-3">
              <summary className="cursor-pointer text-white font-medium">Demográficos</summary>
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300">Edad</label>
                    <input
                      type="number"
                      value={patientData.age}
                      onChange={(e) => setPatientData({...patientData, age: Number(e.target.value)})}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300">Peso (kg)</label>
                    <input
                      type="number"
                      value={patientData.weight}
                      onChange={(e) => setPatientData({...patientData, weight: Number(e.target.value)})}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300">Altura (cm)</label>
                    <input
                      type="number"
                      value={patientData.height}
                      onChange={(e) => setPatientData({...patientData, height: Number(e.target.value)})}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300">Género</label>
                    <select
                      value={patientData.gender}
                      onChange={(e) => setPatientData({...patientData, gender: e.target.value as 'M' | 'F'})}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300">Fumador</label>
                    <select
                      value={patientData.smoking ? 'yes' : 'no'}
                      onChange={(e) => setPatientData({...patientData, smoking: e.target.value === 'yes'})}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                    >
                      <option value="no">No</option>
                      <option value="yes">Sí</option>
                    </select>
                  </div>
                </div>
              </div>
            </details>

            <details className="bg-slate-700 rounded p-3">
              <summary className="cursor-pointer text-white font-medium">Datos Clínicos</summary>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-sm text-slate-300">ASA</label>
                  <select
                    value={patientData.asa}
                    onChange={(e) => setPatientData({...patientData, asa: Number(e.target.value)})}
                    className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                  >
                    <option value={1}>ASA 1</option>
                    <option value={2}>ASA 2</option>
                    <option value={3}>ASA 3</option>
                    <option value={4}>ASA 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300">Comorbilidades</label>
                  <div className="grid grid-cols-2 gap-2">
                    {comorbidityOptions.map(option => (
                      <label key={option} className="flex items-center text-sm text-slate-300">
                        <input
                          type="checkbox"
                          checked={patientData.comorbidities.includes(option)}
                          onChange={(e) => {
                            const newComorbidities = e.target.checked
                              ? [...patientData.comorbidities, option]
                              : patientData.comorbidities.filter(c => c !== option)
                            setPatientData({...patientData, comorbidities: newComorbidities})
                          }}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-300">Historia cardíaca</label>
                  <div className="grid grid-cols-2 gap-2">
                    {cardiacHistoryOptions.map(option => (
                      <label key={option} className="flex items-center text-sm text-slate-300">
                        <input
                          type="checkbox"
                          checked={patientData.cardiacHistory.includes(option)}
                          onChange={(e) => {
                            const newHistory = e.target.checked
                              ? [...patientData.cardiacHistory, option]
                              : patientData.cardiacHistory.filter(h => h !== option)
                            setPatientData({...patientData, cardiacHistory: newHistory})
                          }}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-300">Historia respiratoria</label>
                  <div className="grid grid-cols-2 gap-2">
                    {respiratoryHistoryOptions.map(option => (
                      <label key={option} className="flex items-center text-sm text-slate-300">
                        <input
                          type="checkbox"
                          checked={patientData.respiratoryHistory.includes(option)}
                          onChange={(e) => {
                            const newHistory = e.target.checked
                              ? [...patientData.respiratoryHistory, option]
                              : patientData.respiratoryHistory.filter(h => h !== option)
                            setPatientData({...patientData, respiratoryHistory: newHistory})
                          }}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-300">Medicación actual</label>
                  <select
                    multiple
                    value={patientData.currentMedications}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value)
                      setPatientData({...patientData, currentMedications: selected})
                    }}
                    className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded h-24"
                  >
                    {medicationOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300">Alérgicas</label>
                  <select
                    multiple
                    value={patientData.allergies}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value)
                      setPatientData({...patientData, allergies: selected})
                    }}
                    className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded h-24"
                  >
                    {allergyOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </details>

            <details className="bg-slate-700 rounded p-3">
              <summary className="cursor-pointer text-white font-medium">Analíticas</summary>
              <div className="mt-3 space-y-1">
                {patientData.labs.map((l, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={l.test}
                      onChange={(e) => {
                        const newLabs = [...patientData.labs]
                        newLabs[i].test = e.target.value
                        setPatientData({...patientData, labs: newLabs})
                      }}
                      className="flex-1 bg-slate-700 border border-slate-600 text-white p-1 rounded text-sm"
                      placeholder="Test"
                    />
                    <input
                      type="number"
                      value={l.value}
                      onChange={(e) => {
                        const newLabs = [...patientData.labs]
                        newLabs[i].value = Number(e.target.value)
                        setPatientData({...patientData, labs: newLabs})
                      }}
                      className="flex-1 bg-slate-700 border border-slate-600 text-white p-1 rounded text-sm"
                      placeholder="Valor"
                    />
                    <input
                      value={l.unit}
                      onChange={(e) => {
                        const newLabs = [...patientData.labs]
                        newLabs[i].unit = e.target.value
                        setPatientData({...patientData, labs: newLabs})
                      }}
                      className="flex-1 bg-slate-700 border border-slate-600 text-white p-1 rounded text-sm"
                      placeholder="Unidad"
                    />
                  </div>
                ))}
              </div>
            </details>

            <details className="bg-slate-700 rounded p-3">
              <summary className="cursor-pointer text-white font-medium">Farmacogenética</summary>
              <div className="mt-3 space-y-1">
                {patientData.pgx.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={p.gene}
                      onChange={(e) => {
                        const newPgx = [...patientData.pgx]
                        newPgx[i].gene = e.target.value
                        setPatientData({...patientData, pgx: newPgx})
                      }}
                      className="flex-1 bg-slate-700 border border-slate-600 text-white p-1 rounded text-sm"
                      placeholder="Gen"
                    />
                    <select
                      value={p.genotype}
                      onChange={(e) => {
                        const newPgx = [...patientData.pgx]
                        newPgx[i].genotype = e.target.value
                        setPatientData({...patientData, pgx: newPgx})
                      }}
                      className="flex-1 bg-slate-700 border border-slate-600 text-white p-1 rounded text-sm"
                    >
                      {(pgxOptions[p.gene] || []).map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>

          {/* Virtual Twin Video */}
          <div className="flex items-center justify-center max-h-[300px]">
            <img
              src="/twin.gif"
              alt="Virtual Twin Animation"
              className="max-w-full max-h-full object-contain"
              style={{ aspectRatio: '2/3', borderRadius: 0 }}
            />
          </div>        <div className="space-y-6">
        <div className="card">
          <h4 className="text-base font-semibold mb-2 text-white">💊 Simulación de Medicamento</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Medicamento</label>
              <select
                value={medication.drug}
                onChange={(e) => setMedication({...medication, drug: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 text-white p-1 rounded text-sm"
              >
                {drugs.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Dosis</label>
              <input
                type="number"
                value={medication.dose}
                onChange={(e) => setMedication({...medication, dose: Number(e.target.value)})}
                className="w-full bg-slate-700 border border-slate-600 text-white p-1 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Unidad</label>
              <select
                value={medication.unit}
                onChange={(e) => setMedication({...medication, unit: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 text-white p-1 rounded text-sm"
              >
                <option value="mg/kg">mg/kg</option>
                <option value="mcg/kg">mcg/kg</option>
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Vía</label>
              <select
                value={medication.route}
                onChange={(e) => setMedication({...medication, route: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 text-white p-1 rounded text-sm"
              >
                <option value="IV">IV</option>
                <option value="IM">IM</option>
                <option value="Oral">Oral</option>
                <option value="Inhalatoria">Inhalatoria</option>
              </select>
            </div>
            <div>
              <button
                onClick={simulate}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-3 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 transform hover:scale-105"
              >
                🚀 Simular
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className="card overflow-y-auto">
            <h4 className="text-lg font-semibold mb-3 text-white">Resultados de Simulación</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-700 p-3 rounded">
                <h5 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                  ❤️ Hemodinámica
                </h5>
                <div className="text-white space-y-1">
                  <div className={`${
                    result.hemodynamic.bp.includes('Parada') ? 'text-red-400 font-bold' :
                    parseInt(result.hemodynamic.bp.split('/')[0]) < 90 ? 'text-red-400' :
                    parseInt(result.hemodynamic.bp.split('/')[0]) < 100 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    TA: {result.hemodynamic.bp}
                  </div>
                  <div className={`${
                    result.hemodynamic.hr === '0 bpm' ? 'text-red-400 font-bold' :
                    parseInt(result.hemodynamic.hr) < 50 || parseInt(result.hemodynamic.hr) > 120 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    FC: {result.hemodynamic.hr}
                  </div>
                  <div className={`${
                    result.hemodynamic.spo2 === '0%' ? 'text-red-400 font-bold' :
                    parseInt(result.hemodynamic.spo2) < 95 ? 'text-red-400' :
                    parseInt(result.hemodynamic.spo2) < 98 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    SpO2: {result.hemodynamic.spo2}
                  </div>
                </div>
              </div>
              <div className="bg-slate-700 p-3 rounded">
                <h5 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                  😴 Sedación
                </h5>
                <div className="text-white">{result.sedation}</div>
              </div>
              <div className="bg-slate-700 p-3 rounded">
                <h5 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                  🫁 Respiración
                </h5>
                <div className="text-white">
                  <div>{result.respiration}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    VT: {result.ventilation.tidalVolume} mL<br/>
                    ETCO2: {result.ventilation.etco2} mmHg<br/>
                    Patrón: {result.ventilation.pattern}
                  </div>
                </div>
              </div>
              <div className="bg-slate-700 p-3 rounded">
                <h5 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                  🧬 Farmacocinética
                </h5>
                <div className="text-white text-xs">
                  <div>Inicio: {result.pkpd.onsetTime}</div>
                  <div>Pico: {result.pkpd.peakTime}</div>
                  <div>Duración: {result.pkpd.duration}</div>
                  <div>CSHT: {result.pkpd.contextSensitiveHalfTime}</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-slate-700 p-3 rounded">
                <h5 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                  ⚕️ Efectos Adversos
                </h5>
                <div className="text-white">
                  {result.sideEffects.length > 0 ? (
                    <div className="space-y-2">
                      {result.sideEffects.map((effect, index) => {
                        const isSevere = effect.includes('crítica') || effect.includes('Parálisis >24h') || effect.includes('Riesgo hipertermia maligna')
                        const isModerate = effect.includes('moderado') || effect.includes('Hiperpotasemia') || effect.includes('Parálisis prolongada')
                        const colorClass = isSevere ? 'text-red-400' : isModerate ? 'text-yellow-400' : 'text-orange-300'
                        const icon = isSevere ? '🚨' : isModerate ? '⚠️' : 'ℹ️'
                        return (
                          <div key={index} className={`flex items-center space-x-2 ${colorClass}`}>
                            <span>{icon}</span>
                            <span className="text-sm">{effect}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-green-400 flex items-center space-x-2">
                      <span>✅</span>
                      <span>Ninguno</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-slate-700 p-3 rounded">
                <h5 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                  🔄 Interacciones
                </h5>
                <div className="text-white">
                  {result.interactions.length > 0 ? (
                    <div className="space-y-2">
                      {result.interactions.map((interaction, index) => {
                        const descriptions: { [key: string]: string } = {
                          'SYNERGISTIC_RESPIRATORY_DEPRESSION': 'Depresión respiratoria sinérgica',
                          'PROLONGED_PARALYSIS': 'Parálisis neuromuscular prolongada',
                          'HYPERKALEMIA_RISK': 'Riesgo de hiperpotasemia'
                        }
                        const description = descriptions[interaction] || interaction
                        return (
                          <div key={index} className="flex items-center space-x-2 text-yellow-400">
                            <span>⚠️</span>
                            <span className="text-sm">{description}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-green-400 flex items-center space-x-2">
                      <span>✅</span>
                      <span>Ninguna</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div className="bg-slate-700 p-3 rounded">
                <h5 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                  🫨 Riesgo Vía Aérea
                </h5>
                <div className="text-white">
                  <div className={`font-bold ${
                    result.airwayRisk.level === 'CRITICAL' ? 'text-red-400' :
                    result.airwayRisk.level === 'HIGH' ? 'text-orange-400' :
                    result.airwayRisk.level === 'MODERATE' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {result.airwayRisk.level}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Mallampati: {result.airwayRisk.mallampati}/4
                  </div>
                  {result.airwayRisk.factors.length > 0 && (
                    <div className="text-xs text-slate-400 mt-1">
                      Factores: {result.airwayRisk.factors.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-slate-700 p-3 rounded">
                <h5 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                  🧬 Alertas PGx
                </h5>
                <div className="text-white">
                  {result.pgxAlerts.length > 0 ? (
                    <ul className="text-xs space-y-1">
                      {result.pgxAlerts.map((alert, i) => (
                        <li key={i} className={alert.includes('🚨') ? 'text-red-400 font-bold' : 'text-yellow-400'}>
                          • {alert}
                        </li>
                      ))}
                    </ul>
                  ) : 'Sin alertas'}
                </div>
              </div>
              <div className="bg-slate-700 p-3 rounded">
                <h5 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                  🚑 Intervenciones de Rescate
                </h5>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setRescueInterventions({...rescueInterventions, vasopressor: 'phenylephrine'})
                        // Re-run simulation with intervention
                        setTimeout(() => simulate(), 100)
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-md transition-all duration-200 transform hover:scale-105"
                    >
                      💉 Fenilefrina 100mcg
                    </button>
                    <button
                      onClick={() => {
                        setRescueInterventions({...rescueInterventions, vasopressor: 'norepinephrine'})
                        setTimeout(() => simulate(), 100)
                      }}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-md transition-all duration-200 transform hover:scale-105"
                    >
                      💚 Noradrenalina
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setRescueInterventions({...rescueInterventions, ventilation: true})
                      setTimeout(() => simulate(), 100)
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-md transition-all duration-200 transform hover:scale-105"
                  >
                    🫁 Intubar y Ventilar
                  </button>
                  <button
                    onClick={() => {
                      setRescueInterventions({...rescueInterventions, cpr: true})
                      setTimeout(() => simulate(), 100)
                    }}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-md transition-all duration-200 transform hover:scale-105"
                  >
                    🫀 Iniciar RCP
                  </button>
                  <button
                    onClick={() => {
                      setRescueInterventions({})
                      setTimeout(() => simulate(), 100)
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Resetear Intervenciones
                  </button>
                </div>
              </div>
            </div>
            {result.warnings.length > 0 && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-600 rounded">
                <h5 className="text-red-300 font-semibold">⚠️ Advertencias</h5>
                <ul className="text-red-200 mt-2">
                  {result.warnings.map((w, i) => <li key={i}>• {w}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        </div>
      </div>
      </div>

    </div>
  )
}

export default VirtualTwin