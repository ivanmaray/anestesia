import React, { useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// INTERFACES
interface PatientData {
  age: number
  weight: number
  height: number
  gender: 'M' | 'F'
  asa: number
  smoking: boolean
  comorbidities: string[]
  cardiacHistory: string[]
  respiratoryHistory: string[]
  currentMedications: string[]
  allergies: string[]
  labs: { name: string; value: number; unit: string }[]
  pgx: { gene: string; genotype: string }[]
}

interface VitalSigns {
  sbp: number
  dbp: number
  hr: number
  spo2: number
  rr: number
  etco2: number
  temp: number
}

interface OrganFunction {
  brain: number
  heart: number
  lungs: number
  kidneys: number
}

interface SedationScore {
  ramsay: 1 | 2 | 3 | 4 | 5 | 6
  rass: -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4
  description: string
}

interface Pharmacokinetics {
  effectSiteConcentration: number
  metabolismRate: number
  clearanceRate: number
}

interface SimulationState {
  vitals: VitalSigns
  organFunction: OrganFunction
  consciousness: 'awake' | 'sedated' | 'unconscious' | 'anesthetized'
  hemodynamics: 'stable' | 'hypotensive' | 'hypertensive' | 'shock'
  ventilation: 'spontaneous' | 'mechanical' | 'apneic'
  intubated: boolean
  sedationScore: SedationScore
  pharmacokinetics: Pharmacokinetics
  warnings: { severity: 'critical' | 'high' | 'medium' | 'info'; message: string }[]
  timeline: { time: number; sbp: number; hr: number; spo2: number; rr: number; temp: number }[]
  adverseEvents: AdverseEvent[]
  medicationTimeline: MedicationEvent[]
  cumulativeDose: { [key: string]: number }
  ventilationMode: 'spontaneous' | 'CMV' | 'AC' | 'PSV'
  pipPeep: { pip: number; peep: number; compliance: number }
  ecgStatus: 'normal' | 'bradycardia' | 'tachycardia' | 'arrhythmia'
  riskScores: { asp: number; stopBang: number; intubationDifficulty: string }
  bloodGas: BloodGasAnalysis
  sofaScores: SOFAScores
  complications: Complication[]
  glasgow: Glasgow
  urineOutput: UrineOutput
  painScore: PainScore
  ardsStaging: 'none' | 'mild' | 'moderate' | 'severe'
}

interface DrugData {
  name: string
  onset: number
  peak: number
  duration: number
  metabolism: string
  color: string
  effectMagnitude: number
  ryrRisk: number
  hyperkaliemia: boolean
}

interface DrugInteraction {
  drugs: string[]
  effect: string
  depthIncrease: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

interface AdverseEvent {
  type: 'bradycardia' | 'tachycardia' | 'hypoxia' | 'hypercapnia' | 'malignantHyperthermia' | 'hyperkalemia' | 'cardiovascularCollapse' | 'apnea'
  severity: 'warning' | 'critical'
  triggered: boolean
}

interface MedicationEvent {
  time: number
  drug: string
  dose: number
  unit: string
}

interface BloodGasAnalysis {
  ph: number
  pco2: number
  po2: number
  hco3: number
  be: number
  lac: number
}

interface SOFAScores {
  respiratory: number
  coagulation: number
  liver: number
  cardiovascular: number
  cns: number
  renal: number
  total: number
}

interface Complication {
  type: 'pulmonaryEdema' | 'aspiration' | 'malignantHyperthermia' | 'disseminated' | 'rhabdo' | 'sepsis' | 'dvi' | 'ards' | 'aspirationPneumonitis'
  onset: number
  severity: 'mild' | 'moderate' | 'severe' | 'critical'
  active: boolean
}

interface Glasgow {
  eye: 1 | 2 | 3 | 4
  verbal: 1 | 2 | 3 | 4 | 5
  motor: 1 | 2 | 3 | 4 | 5 | 6
  total: number
  category: 'severo' | 'moderado' | 'leve' | 'normal'
}

interface UrineOutput {
  hourly: number
  total: number
  category: 'normal' | 'oligurica' | 'anurica'
}

interface PainScore {
  numeric: number // 0-10
  facial: number
  behavioral: number
  total: number
}

// DRUG DATABASE
const drugDatabase: { [key: string]: DrugData } = {
  'Propofol': {
    name: 'Propofol',
    onset: 30,
    peak: 120,
    duration: 600,
    metabolism: 'Hepático (CYP2D6)',
    color: 'from-blue-600 to-blue-700',
    effectMagnitude: 0.8,
    ryrRisk: 0.05,
    hyperkaliemia: false
  },
  'Fentanyl': {
    name: 'Fentanyl',
    onset: 60,
    peak: 300,
    duration: 1800,
    metabolism: 'Hepático (CYP3A4)',
    color: 'from-green-600 to-green-700',
    effectMagnitude: 0.7,
    ryrRisk: 0.02,
    hyperkaliemia: false
  },
  'Remifentanil': {
    name: 'Remifentanil',
    onset: 45,
    peak: 150,
    duration: 300,
    metabolism: 'Esterasas plasmáticas',
    color: 'from-emerald-600 to-emerald-700',
    effectMagnitude: 0.9,
    ryrRisk: 0.02,
    hyperkaliemia: false
  },
  'Midazolam': {
    name: 'Midazolam',
    onset: 60,
    peak: 180,
    duration: 900,
    metabolism: 'Hepático (CYP3A4, CYP2C19)',
    color: 'from-purple-600 to-purple-700',
    effectMagnitude: 0.6,
    ryrRisk: 0.02,
    hyperkaliemia: false
  },
  'Rocuronio': {
    name: 'Rocuronio',
    onset: 90,
    peak: 120,
    duration: 1800,
    metabolism: 'Orgánico (Hofmann)',
    color: 'from-orange-600 to-orange-700',
    effectMagnitude: 1.0,
    ryrRisk: 0.3,
    hyperkaliemia: true
  },
  'Succinilcolina': {
    name: 'Succinilcolina',
    onset: 30,
    peak: 60,
    duration: 300,
    metabolism: 'Plasmático',
    color: 'from-red-600 to-red-700',
    effectMagnitude: 1.0,
    ryrRisk: 0.8,
    hyperkaliemia: true
  }
}

// DRUG INTERACTIONS DATABASE
const drugInteractions: DrugInteraction[] = [
  {
    drugs: ['Propofol', 'Fentanyl'],
    effect: 'Sinergia profunda: depresión respiratoria severa',
    depthIncrease: 0.3,
    riskLevel: 'high'
  },
  {
    drugs: ['Propofol', 'Remifentanil'],
    effect: 'Sinergia crítica: depresión máxima',
    depthIncrease: 0.4,
    riskLevel: 'critical'
  },
  {
    drugs: ['Midazolam', 'Fentanyl'],
    effect: 'Aumento de sedación: riesgo de hipoxia',
    depthIncrease: 0.2,
    riskLevel: 'medium'
  },
  {
    drugs: ['Rocuronio', 'Succinilcolina'],
    effect: 'Bloqueo dual: parálisis prolongada',
    depthIncrease: 0.2,
    riskLevel: 'high'
  }
]

const VirtualTwin: React.FC = () => {
  // STATE
  const [patient, setPatient] = useState<PatientData>({
    age: 65,
    weight: 70,
    height: 170,
    gender: 'M',
    asa: 2,
    smoking: false,
    comorbidities: ['HTA'],
    cardiacHistory: [],
    respiratoryHistory: [],
    currentMedications: ['Enalapril'],
    allergies: [],
    labs: [
      { name: 'Creatinina', value: 1.2, unit: 'mg/dL' },
      { name: 'AST', value: 35, unit: 'U/L' },
      { name: 'ALT', value: 38, unit: 'U/L' }
    ],
    pgx: [
      { gene: 'CYP2D6', genotype: 'EM' },
      { gene: 'CYP2C19', genotype: 'EM' },
      { gene: 'RYR1', genotype: 'NN' }
    ]
  })

  const [simulation, setSimulation] = useState({
    drug: 'Propofol',
    dose: 2.0,
    unit: 'mg/kg',
    route: 'IV'
  })

  const [state, setState] = useState<SimulationState>({
    vitals: {
      sbp: 120,
      dbp: 80,
      hr: 75,
      spo2: 98,
      rr: 16,
      etco2: 38,
      temp: 36.5
    },
    organFunction: {
      brain: 90,
      heart: 85,
      lungs: 95,
      kidneys: 90
    },
    consciousness: 'awake',
    hemodynamics: 'stable',
    ventilation: 'spontaneous',
    intubated: false,
    sedationScore: {
      ramsay: 1,
      rass: 0,
      description: 'Despierto y tranquilo'
    },
    pharmacokinetics: {
      effectSiteConcentration: 0,
      metabolismRate: 1.0,
      clearanceRate: 0.15
    },
    warnings: [],
    timeline: [],
    adverseEvents: [],
    medicationTimeline: [],
    cumulativeDose: {},
    ventilationMode: 'spontaneous',
    pipPeep: { pip: 20, peep: 0, compliance: 40 },
    ecgStatus: 'normal',
    riskScores: { asp: 2, stopBang: 0, intubationDifficulty: 'Fácil' },
    bloodGas: { ph: 7.40, pco2: 40, po2: 440, hco3: 24, be: 0, lac: 1.5 },
    sofaScores: { respiratory: 0, coagulation: 0, liver: 0, cardiovascular: 0, cns: 0, renal: 0, total: 0 },
    complications: [],
    glasgow: { eye: 4, verbal: 5, motor: 6, total: 15, category: 'normal' },
    urineOutput: { hourly: 30, total: 0, category: 'normal' },
    painScore: { numeric: 0, facial: 0, behavioral: 0, total: 0 },
    ardsStaging: 'none'
  })

  const [isSimulating, setIsSimulating] = useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  // HELPER FUNCTIONS
  const getMetabolismRate = (): number => {
    let rate = 1.0
    const cyp2d6 = patient.pgx.find(g => g.gene === 'CYP2D6')

    if (cyp2d6?.genotype === 'PM') rate *= 0.2
    if (cyp2d6?.genotype === 'IM') rate *= 0.7
    if (cyp2d6?.genotype === 'UM') rate *= 2.5

    if (patient.age > 75) rate *= 0.7
    else if (patient.age > 65) rate *= 0.85

    const ast = patient.labs.find(l => l.name === 'AST')?.value || 0
    const alt = patient.labs.find(l => l.name === 'ALT')?.value || 0
    if (ast > 100 || alt > 100) rate *= 0.8

    return Math.max(0.1, rate)
  }

  const calculateSedationScores = (effectMagnitude: number) => {
    const ramsay = Math.min(6, Math.max(1, Math.ceil(1 + effectMagnitude * 5))) as 1 | 2 | 3 | 4 | 5 | 6
    const rass = Math.round(-effectMagnitude * 5) as -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4
    const descriptions: Record<number, string> = {
      0: 'Alerta y calmado',
      [-1]: 'Somnoliento',
      [-2]: 'Sedación ligera',
      [-3]: 'Sedación moderada',
      [-4]: 'Sedación profunda',
      [-5]: 'No despierta'
    }
    return {
      ramsay,
      rass,
      description: descriptions[rass] || 'Alerta y calmado'
    }
  }

  // Check drug interactions
  const checkDrugInteractions = (drugs: string[]): string => {
    for (const interaction of drugInteractions) {
      if (interaction.drugs.every(d => drugs.includes(d))) {
        return interaction.effect
      }
    }
    return ''
  }

  // Calculate cumulative risk
  const calculateRiskScores = (): { asp: number; stopBang: number; intubationDifficulty: string } => {
    let asp = patient.asa
    let stopBang = 0

    // STOP-BANG components
    if (patient.smoking) stopBang += 1
    if (patient.age > 50) stopBang += 1
    if (patient.weight > 80) stopBang += 1
    if (patient.labs.some(l => l.name === 'Creatinina' && l.value > 1.8)) stopBang += 1
    if (patient.comorbidities.includes('Apnea del sueño')) stopBang += 1

    // Intubation difficulty
    let intubationDifficulty = 'Fácil'
    if (patient.age > 65 || patient.comorbidities.includes('Obesidad')) intubationDifficulty = 'Moderada'
    if (patient.comorbidities.includes('Micrognacia') || patient.comorbidities.includes('Limitación cervical')) intubationDifficulty = 'Difícil'

    return { asp, stopBang, intubationDifficulty }
  }

  // Malignant Hyperthermia Risk
  const getMalignantHyperThermiaRisk = (drug: string): number => {
    const ryrGenotype = patient.pgx.find(g => g.gene === 'RYR1')?.genotype
    const baseRisk = drugDatabase[drug]?.ryrRisk || 0
    
    if (ryrGenotype === 'NC') return baseRisk * 3 // Carrier
    if (ryrGenotype === 'NN') return baseRisk * 0.1 // No mutation
    return baseRisk
  }

  // Calculate ventilation parameters
  const calculateVentilationParams = (effectMagnitude: number, intubated: boolean) => {
    const baseCompliance = 40
    const compliance = Math.max(15, baseCompliance - effectMagnitude * 20)
    const pip = Math.max(15, 20 + effectMagnitude * 10)
    const peep = intubated ? 5 : 0
    return { pip, peep, compliance }
  }

  // Calculate blood gas analysis
  const calculateBloodGasAnalysis = (vitals: VitalSigns, effectMagnitude: number): BloodGasAnalysis => {
    let ph = 7.40 - (Math.max(0, vitals.etco2 - 38) * 0.008) + (effectMagnitude * 0.03)
    let pco2 = vitals.etco2 + Math.random() * 4 - 2
    let po2 = vitals.spo2 * 5.5 + Math.random() * 20
    let hco3 = 24 - Math.max(0, vitals.etco2 - 38) * 0.3
    let be = hco3 - 24
    let lac = 1.5 + effectMagnitude * 2 + Math.max(0, (120 - vitals.sbp) / 60)
    
    return { ph: Math.round(ph * 100) / 100, pco2: Math.round(pco2), po2: Math.round(po2), hco3: Math.round(hco3 * 10) / 10, be: Math.round(be * 10) / 10, lac: Math.round(lac * 10) / 10 }
  }

  // Calculate SOFA score
  const calculateSOFAScore = (vitals: VitalSigns, organFunction: OrganFunction, labs: { name: string; value: number; unit: string }[], _bloodGas: BloodGasAnalysis): SOFAScores => {
    let respiratory = vitals.spo2 >= 95 ? 0 : vitals.spo2 >= 85 ? 2 : 3

    let coagulation = 0
    if (organFunction.heart < 50) coagulation = 4

    let liver = 0
    const bilirubin = labs.find(l => l.name === 'Bilirrubina')?.value || 0
    if (bilirubin > 6) liver = 4
    else if (bilirubin > 3) liver = 3
    else if (bilirubin > 1.2) liver = 1

    let cardiovascular = 0
    if (vitals.sbp >= 90) cardiovascular = 0
    else if (vitals.sbp >= 70) cardiovascular = 2
    else cardiovascular = 4

    let cns = 0
    if (vitals.spo2 < 85) cns = 4
    else if (vitals.spo2 < 90) cns = 3
    else if (vitals.spo2 < 95) cns = 1

    let renal = 0
    const creatinine = labs.find(l => l.name === 'Creatinina')?.value || 0
    if (creatinine > 5) renal = 4
    else if (creatinine > 3.5) renal = 3
    else if (creatinine > 1.2) renal = 1

    const total = respiratory + coagulation + liver + cardiovascular + cns + renal

    return { respiratory, coagulation, liver, cardiovascular, cns, renal, total }
  }

  // Detect complications
  const checkComplications = (vitals: VitalSigns, _organFunction: OrganFunction, effectMagnitude: number, simulationTime: number, state: SimulationState, drug: string): Complication[] => {
    const newComplications: Complication[] = []

    // Pulmonary edema
    if (vitals.etco2 > 60 && vitals.spo2 < 88 && !state.complications.some(c => c.type === 'pulmonaryEdema' && c.active)) {
      newComplications.push({
        type: 'pulmonaryEdema',
        onset: simulationTime,
        severity: vitals.etco2 > 70 ? 'severe' : 'moderate',
        active: true
      })
    }

    // Aspiration risk
    if (effectMagnitude > 0.7 && vitals.rr < 10 && Math.random() < 0.02) {
      newComplications.push({
        type: 'aspiration',
        onset: simulationTime,
        severity: 'moderate',
        active: true
      })
    }

    // Aspiration pneumonitis (follows aspiration)
    if (state.complications.some(c => c.type === 'aspiration' && c.active) && simulationTime > state.complications.find(c => c.type === 'aspiration')!.onset + 30) {
      if (!state.complications.some(c => c.type === 'aspirationPneumonitis' && c.active)) {
        newComplications.push({
          type: 'aspirationPneumonitis',
          onset: simulationTime,
          severity: 'severe',
          active: true
        })
      }
    }

    // Malignant Hyperthermia
    if (vitals.temp > 38.5 && !state.complications.some(c => c.type === 'malignantHyperthermia' && c.active)) {
      newComplications.push({
        type: 'malignantHyperthermia',
        onset: simulationTime,
        severity: vitals.temp > 40 ? 'severe' : 'moderate',
        active: true
      })
    }

    // Rhabdomyolysis (Succinylcholine + RYR1 or prolonged paralysis)
    if (drug === 'Succinilcolina' && patient.pgx.find(g => g.gene === 'RYR1')?.genotype !== 'NN' && Math.random() < 0.05) {
      newComplications.push({
        type: 'rhabdo',
        onset: simulationTime,
        severity: 'severe',
        active: true
      })
    }

    // Hyperkalemia (succinylcholine)
    if (drug === 'Succinilcolina' && patient.comorbidities.some(c => ['Quemaduras', 'Inmovilidad'].includes(c))) {
      if (!state.complications.some(c => c.type === 'dvi' && c.active)) {
        newComplications.push({
          type: 'dvi',
          onset: simulationTime,
          severity: 'critical',
          active: true
        })
      }
    }

    // DIC (Disseminated Intravascular Coagulation) from prolonged hypoxia
    if (vitals.spo2 < 80 && simulationTime > 60) {
      if (!state.complications.some(c => c.type === 'disseminated' && c.active)) {
        newComplications.push({
          type: 'disseminated',
          onset: simulationTime,
          severity: 'critical',
          active: true
        })
      }
    }

    // ARDS (from aspiration, prolonged hypoxia, or sepsis)
    if ((vitals.spo2 < 85 || state.complications.some(c => c.type === 'aspirationPneumonitis' && c.active)) && simulationTime > 120) {
      if (!state.complications.some(c => c.type === 'ards' && c.active)) {
        newComplications.push({
          type: 'ards',
          onset: simulationTime,
          severity: vitals.spo2 < 75 ? 'severe' : 'moderate',
          active: true
        })
      }
    }

    return newComplications
  }

  // Calculate Glasgow Coma Scale
  const calculateGlasgow = (consciousness: string, vitals: VitalSigns): Glasgow => {
    let eye: 1 | 2 | 3 | 4 = 4
    let verbal: 1 | 2 | 3 | 4 | 5 = 5
    let motor: 1 | 2 | 3 | 4 | 5 | 6 = 6

    if (consciousness === 'awake') {
      eye = 4
      verbal = 5
      motor = 6
    } else if (consciousness === 'sedated') {
      eye = 3
      verbal = 4
      motor = 5
    } else if (consciousness === 'unconscious') {
      eye = 2
      verbal = 2
      motor = 4
    } else if (consciousness === 'anesthetized') {
      eye = 1
      verbal = 1
      motor = 3
    }

    // Adjust if hypoxic
    if (vitals.spo2 < 85) {
      motor = Math.max(1, motor - 2) as 1 | 2 | 3 | 4 | 5 | 6
    }

    const total = eye + verbal + motor as number
    let category: 'severo' | 'moderado' | 'leve' | 'normal' = 'normal'
    if (total <= 8) category = 'severo'
    else if (total <= 12) category = 'moderado'
    else if (total <= 14) category = 'leve'

    return { eye, verbal, motor, total: total as number, category }
  }

  // Calculate urine output
  const calculateUrineOutput = (vitals: VitalSigns, simulationTime: number): UrineOutput => {
    const baseOutput = 0.5 // ml/min baseline
    let multiplier = 1.0

    // Hypotension decreases urine output
    if (vitals.sbp < 90) multiplier *= 0.5
    if (vitals.sbp < 70) multiplier *= 0.3
    if (vitals.sbp < 60) multiplier *= 0.1

    const hourlyOutput = baseOutput * 60 * multiplier
    const totalOutput = (simulationTime / 60) * hourlyOutput

    let category: 'normal' | 'oligurica' | 'anurica' = 'normal'
    if (hourlyOutput < 0.5) category = 'anurica'
    else if (hourlyOutput < 0.5) category = 'oligurica'

    return { hourly: Math.round(hourlyOutput * 10) / 10, total: Math.round(totalOutput * 10) / 10, category }
  }

  // Calculate pain score (if awake)
  const calculatePainScore = (consciousness: string, vitals: VitalSigns): PainScore => {
    let numeric = 0
    let facial = 0
    let behavioral = 0

    if (consciousness === 'awake') {
      // Can respond to pain questions
      numeric = Math.floor(Math.random() * 4) // 0-3 baseline
      if (vitals.hr > 100) numeric += 2
      if (vitals.sbp > 140) numeric += 1
    } else if (consciousness === 'sedated') {
      numeric = 0 // Sedated, shouldn't feel pain
      facial = 0
      behavioral = 0
    } else {
      // Unconscious - use behavioral pain scale
      facial = Math.random() < 0.3 ? 1 : 0
      behavioral = Math.random() < 0.3 ? 1 : 0
      numeric = 0
    }

    numeric = Math.min(10, Math.max(0, numeric))
    const total = numeric

    return { numeric, facial, behavioral, total }
  }

  // Calculate ARDS staging
  const calculateARDSStaging = (bloodGas: BloodGasAnalysis, _pipPeep: { pip: number; peep: number; compliance: number }): 'none' | 'mild' | 'moderate' | 'severe' => {
    const paoFiO2 = bloodGas.po2 / 0.21 // Assuming FiO2 ~21% on room air, adjust if intubated

    if (paoFiO2 >= 300) return 'none'
    if (paoFiO2 >= 200) return 'mild'
    if (paoFiO2 >= 100) return 'moderate'
    return 'severe'
  }

  const runSimulation = () => {
    setIsSimulating(true)
    const drug = drugDatabase[simulation.drug]
    const metabolismRate = getMetabolismRate()

    const adjustedDuration = drug.duration / metabolismRate
    
    // Calcular dosis en mg
    const doseInMg = simulation.unit === 'mg/kg' ? simulation.dose * patient.weight : simulation.dose
    const volumeOfDistribution = 0.5 * patient.weight
    
    // Calcular concentración plasmática basada en la dosis
    const initialConcentration = doseInMg / volumeOfDistribution
    
    // Magnitud del efecto depende de: 
    // 1. Concentración (dosis) 
    // 2. Potencia del fármaco
    // 3. Factores farmacogenéticos
    let effectMagnitude = (initialConcentration / 10) * drug.effectMagnitude
    effectMagnitude = Math.min(0.95, Math.max(0, effectMagnitude)) // Limitar entre 0-95%
    
    // Para ultra-metabolizadores, reducir el efecto
    if (metabolismRate > 1.5) {
      effectMagnitude *= (1 / metabolismRate) * 0.6
    }

    const effectSiteConcentration = initialConcentration * drug.effectMagnitude

    const sedationScores = calculateSedationScores(Math.min(effectMagnitude, 0.9))

    // Get active drugs (simulated as current + recently given)
    const activeDrugs = state.medicationTimeline
      .filter(m => (state.timeline.length - m.time) < 30) // Last 30 seconds
      .map(m => m.drug)
    activeDrugs.push(simulation.drug)
    const uniqueDrugs = [...new Set(activeDrugs)]

    let newWarnings: typeof state.warnings = []
    let newAdverseEvents: AdverseEvent[] = []

    // Metabolism warnings
    if (metabolismRate < 0.5) {
      newWarnings.push({
        message: `Metabolizador LENTO: Duración ~${Math.round(adjustedDuration / drug.duration)}x prolongada`,
        severity: 'high'
      })
    }
    if (metabolismRate > 1.5) {
      newWarnings.push({
        message: `Metabolizador RÁPIDO: Efecto reducido ~${Math.round((1 - effectMagnitude / ((initialConcentration / 10) * drug.effectMagnitude)) * 100)}%`,
        severity: 'medium'
      })
    }

    // Drug interactions
    const interaction = checkDrugInteractions(uniqueDrugs)
    if (interaction) {
      newWarnings.push({
        message: `⚡ ${interaction}`,
        severity: 'high'
      })
      effectMagnitude += 0.2 // Increase depth with interactions
    }

    // Malignant Hyperthermia Risk
    const mhRisk = getMalignantHyperThermiaRisk(simulation.drug)
    let temperatureRise = 0
    if (mhRisk > 0.1) {
      temperatureRise = mhRisk * effectMagnitude * 0.5
    }

    // Hyperkalemia risk with succinylcholine
    if (simulation.drug === 'Succinilcolina') {
      if (patient.comorbidities.includes('Quemaduras') || patient.comorbidities.includes('Inmovilidad')) {
        newWarnings.push({
          message: '⚠️ RIESGO: Hiperkalemia con Succinilcolina en este paciente',
          severity: 'critical'
        })
        newAdverseEvents.push({
          type: 'hyperkalemia',
          severity: 'critical',
          triggered: true
        })
      }
    }

    // Calculate new vitals
    const newVitals = {
      sbp: Math.max(70, 120 - effectMagnitude * 35),
      dbp: Math.max(40, 80 - effectMagnitude * 22),
      hr: Math.max(45, 75 - effectMagnitude * 22),
      spo2: Math.max(85, 98 - effectMagnitude * 12),
      rr: Math.max(8, 16 - effectMagnitude * 7),
      etco2: Math.max(25, 38 - effectMagnitude * 6),
      temp: 36.5 + temperatureRise
    }

    // Adverse events detection
    if (newVitals.hr < 50) {
      newAdverseEvents.push({ type: 'bradycardia', severity: 'warning', triggered: true })
      if (newVitals.hr < 40) {
        newWarnings.push({ message: '🚨 BRADICARDIA SEVERA: HR < 40', severity: 'critical' })
        newAdverseEvents[newAdverseEvents.length - 1].severity = 'critical'
      } else {
        newWarnings.push({ message: '⚠️ Bradicardia: HR < 50', severity: 'high' })
      }
    }

    if (newVitals.hr > 120) {
      newAdverseEvents.push({ type: 'tachycardia', severity: 'warning', triggered: true })
      newWarnings.push({ message: '⚠️ Taquicardia: HR > 120', severity: 'medium' })
    }

    if (newVitals.spo2 < 92) {
      newAdverseEvents.push({ type: 'hypoxia', severity: 'critical', triggered: true })
      newWarnings.push({ 
        message: newVitals.spo2 < 85 ? '🚨 HIPOXIA SEVERA: SpO₂ < 85%' : '⚠️ Hipoxia: SpO₂ < 92%', 
        severity: newVitals.spo2 < 85 ? 'critical' : 'high' 
      })
    }

    if (newVitals.rr < 8 && !state.intubated) {
      newAdverseEvents.push({ type: 'apnea', severity: 'critical', triggered: true })
      newWarnings.push({ message: '🚨 APNEA: Necesita ventilación inmediata', severity: 'critical' })
    }

    if (newVitals.etco2 > 55) {
      newAdverseEvents.push({ type: 'hypercapnia', severity: 'warning', triggered: true })
      newWarnings.push({ message: '⚠️ Hipercapnia: EtCO₂ > 55 mmHg', severity: 'high' })
    }

    if (temperatureRise > 1.5) {
      newAdverseEvents.push({ type: 'malignantHyperthermia', severity: 'critical', triggered: true })
      newWarnings.push({ 
        message: '🔥 ALERTA: Posible Hipertermia Maligna - Temp. subiendo', 
        severity: 'critical' 
      })
    }

    if (newVitals.sbp < 60) {
      newAdverseEvents.push({ type: 'cardiovascularCollapse', severity: 'critical', triggered: true })
      newWarnings.push({ message: '🚨 COLAPSO CARDIOVASCULAR: PA < 60 mmHg', severity: 'critical' })
    }

    const organFunction = {
      brain: Math.max(0, Math.min(100, 90 - effectMagnitude * 35)),
      heart: Math.max(0, Math.min(100, 85 - effectMagnitude * 30)),
      lungs: state.intubated ? 95 : Math.max(0, Math.min(100, 95 - effectMagnitude * 18)),
      kidneys: Math.max(0, Math.min(100, 90 - effectMagnitude * 18))
    }

    const ventilationParams = calculateVentilationParams(effectMagnitude, state.intubated)

    const consciousness = effectMagnitude < 0.2 ? 'awake' : effectMagnitude < 0.5 ? 'sedated' : effectMagnitude < 0.8 ? 'unconscious' : 'anesthetized'
    const hemodynamics = newVitals.sbp < 90 ? 'hypotensive' : newVitals.sbp > 140 ? 'hypertensive' : newVitals.sbp < 60 ? 'shock' : 'stable'

    // Determine ECG status
    let ecgStatus: 'normal' | 'bradycardia' | 'tachycardia' | 'arrhythmia' = 'normal'
    if (newVitals.hr < 50) ecgStatus = 'bradycardia'
    else if (newVitals.hr > 120) ecgStatus = 'tachycardia'
    else if (newVitals.sbp < 60) ecgStatus = 'arrhythmia'

    // Calculate blood gas
    const newBloodGas = calculateBloodGasAnalysis(newVitals, effectMagnitude)

    // Calculate SOFA score
    const newSOFAScores = calculateSOFAScore(newVitals, organFunction, patient.labs, newBloodGas)

    // Check for complications
    const newComplications = checkComplications(newVitals, organFunction, effectMagnitude, state.timeline.length, state, simulation.drug)
    
    // Add warnings for complications
    newComplications.forEach(comp => {
      if (comp.type === 'pulmonaryEdema') {
        newWarnings.push({ message: `🫁 ALERTA: Posible edema pulmonar (EtCO₂ ${newVitals.etco2}, SpO₂ ${newVitals.spo2})`, severity: comp.severity === 'severe' ? 'critical' : 'high' })
      } else if (comp.type === 'aspiration') {
        newWarnings.push({ message: '⚠️ RIESGO: Posible aspiración - proteger vía aérea', severity: 'high' })
      } else if (comp.type === 'aspirationPneumonitis') {
        newWarnings.push({ message: '🫁 COMPLICACIÓN: Neumonitis por aspiración', severity: 'critical' })
      } else if (comp.type === 'malignantHyperthermia') {
        newWarnings.push({ message: '🔥 CRÍTICA: HIPERTERMIA MALIGNA CONFIRMADA', severity: 'critical' })
      } else if (comp.type === 'rhabdo') {
        newWarnings.push({ message: '⚠️ RIESGO: Rabdomiolisis - monitorear CK y mioglobinuria', severity: 'high' })
      } else if (comp.type === 'disseminated') {
        newWarnings.push({ message: '🚨 CRÍTICA: CID - hipoxia prolongada', severity: 'critical' })
      } else if (comp.type === 'dvi') {
        newWarnings.push({ message: '🚨 CRÍTICA: Hiperkalemia severa - riesgo de paro', severity: 'critical' })
      } else if (comp.type === 'ards') {
        newWarnings.push({ message: '🫁 CRÍTICA: ARDS - insuficiencia respiratoria', severity: 'critical' })
      }
    })

    // Calculate Glasgow, urine output, pain, and ARDS staging
    const newGlasgow = calculateGlasgow(consciousness, newVitals)
    const newUrineOutput = calculateUrineOutput(newVitals, state.timeline.length)
    const newPainScore = calculatePainScore(consciousness, newVitals)
    const newArdsStaging = calculateARDSStaging(newBloodGas, ventilationParams)

    // Update cumulative doses
    const newCumulativeDose = { ...state.cumulativeDose }
    newCumulativeDose[simulation.drug] = (newCumulativeDose[simulation.drug] || 0) + doseInMg

    // Propofol infusion syndrome warning
    if (simulation.drug === 'Propofol' && newCumulativeDose['Propofol'] > 12 * patient.weight) {
      newWarnings.push({
        message: `⚠️ Riesgo: Síndrome de Infusión de Propofol (dosis acumulada > 12mg/kg)`,
        severity: 'high'
      })
    }

    setState(prev => ({
      ...prev,
      vitals: newVitals,
      organFunction,
      consciousness,
      hemodynamics,
      sedationScore: sedationScores,
      pharmacokinetics: {
        effectSiteConcentration,
        metabolismRate,
        clearanceRate: metabolismRate * 0.15
      },
      warnings: [...prev.warnings, ...newWarnings],
      adverseEvents: [...prev.adverseEvents, ...newAdverseEvents],
      timeline: [...prev.timeline, { time: prev.timeline.length, ...newVitals }],
      cumulativeDose: newCumulativeDose,
      medicationTimeline: [...prev.medicationTimeline, {
        time: prev.timeline.length,
        drug: simulation.drug,
        dose: simulation.dose,
        unit: simulation.unit
      }],
      pipPeep: ventilationParams,
      ecgStatus,
      riskScores: calculateRiskScores(),
      bloodGas: newBloodGas,
      sofaScores: newSOFAScores,
      complications: [...prev.complications, ...newComplications],
      glasgow: newGlasgow,
      urineOutput: newUrineOutput,
      painScore: newPainScore,
      ardsStaging: newArdsStaging
    }))

    // Continue simulation
    timeoutRef.current = setTimeout(() => {
      if (isSimulating) runSimulation()
    }, 1000)
  }

  const stopSimulation = () => {
    setIsSimulating(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const resetSimulation = () => {
    stopSimulation()
    setState({
      vitals: {
        sbp: 120,
        dbp: 80,
        hr: 75,
        spo2: 98,
        rr: 16,
        etco2: 38,
        temp: 36.5
      },
      organFunction: {
        brain: 90,
        heart: 85,
        lungs: 95,
        kidneys: 90
      },
      consciousness: 'awake',
      hemodynamics: 'stable',
      ventilation: 'spontaneous',
      intubated: false,
      sedationScore: {
        ramsay: 1,
        rass: 0,
        description: 'Despierto y tranquilo'
      },
      pharmacokinetics: {
        effectSiteConcentration: 0,
        metabolismRate: 1.0,
        clearanceRate: 0.15
      },
      warnings: [],
      timeline: [],
      adverseEvents: [],
      medicationTimeline: [],
      cumulativeDose: {},
      ventilationMode: 'spontaneous',
      pipPeep: { pip: 20, peep: 0, compliance: 40 },
      ecgStatus: 'normal',
      riskScores: { asp: 2, stopBang: 0, intubationDifficulty: 'Fácil' },
      bloodGas: { ph: 7.40, pco2: 40, po2: 440, hco3: 24, be: 0, lac: 1.5 },
      sofaScores: { respiratory: 0, coagulation: 0, liver: 0, cardiovascular: 0, cns: 0, renal: 0, total: 0 },
      complications: [],
      glasgow: { eye: 4, verbal: 5, motor: 6, total: 15, category: 'normal' },
      urineOutput: { hourly: 30, total: 0, category: 'normal' },
      painScore: { numeric: 0, facial: 0, behavioral: 0, total: 0 },
      ardsStaging: 'none'
    })
  }

  const handleIntubation = () => {
    setState(prev => ({
      ...prev,
      intubated: true,
      ventilation: 'mechanical',
      vitals: {
        ...prev.vitals,
        rr: 12,
        spo2: Math.max(prev.vitals.spo2, 98),
        etco2: 38
      },
      organFunction: {
        ...prev.organFunction,
        lungs: 95,
        brain: Math.min(100, prev.organFunction.brain + 10)
      },
      warnings: prev.warnings.filter(w => 
        !w.message.includes('hipoxia') && 
        !w.message.includes('apnea') &&
        !w.message.includes('respiratoria')
      )
    }))
  }

  const chartData = {
    labels: state.timeline.map(t => `${t.time}s`),
    datasets: [
      {
        label: 'SpO₂ (%)',
        data: state.timeline.map(t => t.spo2),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.3,
        yAxisID: 'y'
      },
      {
        label: 'FC (lpm)',
        data: state.timeline.map(t => t.hr),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.3,
        yAxisID: 'y1'
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        min: 70,
        max: 100,
        title: { display: true, text: 'SpO₂ (%)' }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        min: 40,
        max: 120,
        title: { display: true, text: 'FC (lpm)' }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-3">
      <div className="max-w-[2400px] mx-auto">
        {/* HEADER */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              🧬 Gemelo Digital Anestésico
            </h1>
            <div className="flex gap-3 items-center">
              <div className={`px-3 py-1 rounded-full font-bold ${state.sofaScores.total > 8 ? 'bg-red-900 text-red-300' : state.sofaScores.total > 4 ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}>
                SOFA: {state.sofaScores.total}
              </div>
              <div className="text-slate-400 text-sm">{state.timeline.length}s</div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${state.consciousness === 'awake' ? 'bg-green-900 text-green-300' : state.consciousness === 'sedated' ? 'bg-yellow-900 text-yellow-300' : state.consciousness === 'unconscious' ? 'bg-orange-900 text-orange-300' : 'bg-purple-900 text-purple-300'}`}>
                {state.consciousness.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* UNIFIED DASHBOARD - 3 COLUMNS */}
        <div className="grid grid-cols-1 2xl:grid-cols-12 gap-3">
          
          {/* LEFT COLUMN - CONTROLS & PATIENT DATA */}
          <div className="2xl:col-span-3 space-y-3">
            {/* PATIENT INFO */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border border-slate-700 shadow-xl">
              <h3 className="text-sm font-bold mb-2 text-cyan-400">👤 Paciente</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Edad:</span>
                  <input type="number" value={patient.age} onChange={e => setPatient({...patient, age: Number(e.target.value)})} className="w-16 bg-slate-700 rounded px-2 py-1 text-right" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Peso:</span>
                  <div className="flex gap-1"><input type="number" value={patient.weight} onChange={e => setPatient({...patient, weight: Number(e.target.value)})} className="w-14 bg-slate-700 rounded px-2 py-1 text-right" /><span className="text-slate-400">kg</span></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ASA:</span>
                  <select value={patient.asa} onChange={e => setPatient({...patient, asa: Number(e.target.value)})} className="bg-slate-700 rounded px-2 py-1 text-xs">
                    <option value={1}>I</option><option value={2}>II</option><option value={3}>III</option><option value={4}>IV</option>
                  </select>
                </div>
              </div>
            </div>

            {/* DRUG ADMINISTRATION */}
            <div className={`bg-gradient-to-br ${drugDatabase[simulation.drug]?.color || 'from-slate-800 to-slate-900'} rounded-lg p-3 border border-slate-700 shadow-xl`}>
              <h3 className="text-sm font-bold mb-2 text-cyan-400">💉 Fármaco</h3>
              <div className="space-y-2">
                <select value={simulation.drug} onChange={e => setSimulation({...simulation, drug: e.target.value})} className="w-full bg-slate-900/50 border border-slate-600 rounded px-2 py-1.5 text-xs">
                  {Object.keys(drugDatabase).map(drug => <option key={drug} value={drug}>{drug}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" step="0.1" value={simulation.dose} onChange={e => setSimulation({...simulation, dose: Number(e.target.value)})} className="w-full bg-slate-900/50 border border-slate-600 rounded px-2 py-1.5 text-xs" placeholder="Dosis" />
                  <select value={simulation.unit} onChange={e => setSimulation({...simulation, unit: e.target.value})} className="w-full bg-slate-900/50 border border-slate-600 rounded px-2 py-1.5 text-xs">
                    <option value="mg/kg">mg/kg</option>
                    <option value="mg">mg</option>
                  </select>
                </div>
                <button onClick={isSimulating ? stopSimulation : runSimulation} className={`w-full ${isSimulating ? 'bg-red-600 hover:bg-red-700' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'} text-white font-bold py-2 px-4 rounded-lg shadow-lg text-sm`}>
                  {isSimulating ? '⏹ DETENER' : '▶ SIMULAR'}
                </button>
              </div>
            </div>

            {/* PHARMACOGENETICS */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border border-slate-700 shadow-xl">
              <h3 className="text-sm font-bold mb-2 text-cyan-400">🧬 Farmacogenética</h3>
              <div className="space-y-1.5">
                {patient.pgx.map((pgx, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">{pgx.gene}</span>
                    <select value={pgx.genotype} onChange={e => {const newPgx = [...patient.pgx]; newPgx[idx].genotype = e.target.value; setPatient({...patient, pgx: newPgx})}} className="bg-slate-700 rounded px-2 py-1 text-xs">
                      <option value="EM">EM</option>
                      <option value="IM">IM</option>
                      <option value="PM">PM</option>
                      <option value="UM">UM</option>
                      {pgx.gene === 'RYR1' && <option value="NC">NC</option>}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border border-slate-700 shadow-xl">
              <h3 className="text-sm font-bold mb-2 text-cyan-400">🚨 Acciones</h3>
              <div className="space-y-1.5">
                <button onClick={handleIntubation} disabled={state.intubated} className={`w-full py-1.5 rounded text-xs font-bold ${state.intubated ? 'bg-gray-600 text-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  🔌 {state.intubated ? 'Intubado' : 'Intubar'}
                </button>
                <button onClick={() => setState(prev => ({...prev, vitals: { ...prev.vitals, sbp: Math.min(140, prev.vitals.sbp + 8) }, warnings: [...prev.warnings, { message: '💧 Fluidos IV', severity: 'info' }]}))} className="w-full py-1.5 bg-blue-900/50 hover:bg-blue-800/50 text-blue-300 rounded text-xs font-bold">
                  💧 Fluidos IV
                </button>
                <button onClick={() => setState(prev => ({...prev, vitals: { ...prev.vitals, sbp: Math.min(150, prev.vitals.sbp + 12), hr: Math.min(120, prev.vitals.hr + 5) }, warnings: [...prev.warnings, { message: '💉 Vasopressor', severity: 'info' }]}))} className="w-full py-1.5 bg-green-900/50 hover:bg-green-800/50 text-green-300 rounded text-xs font-bold">
                  💉 Vasopressor
                </button>
                <button onClick={resetSimulation} className="w-full bg-slate-700 hover:bg-slate-600 py-1.5 rounded text-xs font-bold">
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* RISK SCORES */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border border-slate-700 shadow-xl">
              <h3 className="text-sm font-bold mb-2 text-cyan-400">📊 Escalas</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ASA-PS:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-xs ${state.riskScores.asp <= 2 ? 'bg-green-900/50 text-green-300' : state.riskScores.asp === 3 ? 'bg-yellow-900/50 text-yellow-300' : 'bg-red-900/50 text-red-300'}`}>
                    {['I', 'II', 'III', 'IV', 'V'][state.riskScores.asp - 1]}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">STOP-BANG:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-xs ${state.riskScores.stopBang < 3 ? 'bg-green-900/50 text-green-300' : state.riskScores.stopBang < 5 ? 'bg-yellow-900/50 text-yellow-300' : 'bg-red-900/50 text-red-300'}`}>
                    {state.riskScores.stopBang}/8
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Intubación:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-xs ${state.riskScores.intubationDifficulty === 'Fácil' ? 'bg-green-900/50 text-green-300' : state.riskScores.intubationDifficulty === 'Moderada' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-red-900/50 text-red-300'}`}>
                    {state.riskScores.intubationDifficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN - MAIN MONITOR & VITALS */}
          <div className="2xl:col-span-5 space-y-3">
            {/* MAIN MONITOR */}
            <div className="bg-black rounded-lg border-4 border-slate-700 shadow-2xl p-3">
              <h2 className="text-lg font-bold mb-3 text-cyan-400">Monitor UCI</h2>
              
              {/* BIG VITALS GRID */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-4 bg-gradient-to-b from-red-900/30 to-red-950/30 rounded-lg border border-red-700/50">
                  <div className="text-xs text-red-400 mb-1">PA SISTÓLICA</div>
                  <div className={`text-6xl font-bold font-mono ${state.vitals.sbp < 90 ? 'text-red-500 animate-pulse' : state.vitals.sbp > 140 ? 'text-orange-400' : 'text-green-400'}`}>
                    {Math.round(state.vitals.sbp)}
                  </div>
                  <div className={`text-2xl font-mono ${state.vitals.dbp < 60 ? 'text-red-500' : 'text-red-300'}`}>/{Math.round(state.vitals.dbp)}</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-b from-green-900/30 to-green-950/30 rounded-lg border border-green-700/50">
                  <div className="text-xs text-green-400 mb-1">FC</div>
                  <div className={`text-6xl font-bold font-mono ${state.vitals.hr < 50 || state.vitals.hr > 120 ? 'text-yellow-500 animate-pulse' : 'text-green-400'}`}>
                    {Math.round(state.vitals.hr)}
                  </div>
                  <div className="text-sm text-slate-400">lpm</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-b from-cyan-900/30 to-cyan-950/30 rounded-lg border border-cyan-700/50">
                  <div className="text-xs text-cyan-400 mb-1">SpO₂</div>
                  <div className={`text-6xl font-bold font-mono ${state.vitals.spo2 < 92 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                    {Math.round(state.vitals.spo2)}
                  </div>
                  <div className="text-sm text-slate-400">%</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-b from-purple-900/30 to-purple-950/30 rounded-lg border border-purple-700/50">
                  <div className="text-xs text-purple-400 mb-1">TEMPERATURA</div>
                  <div className={`text-6xl font-bold font-mono ${state.vitals.temp > 38.5 ? 'text-red-500 animate-pulse' : state.vitals.temp < 36 ? 'text-blue-400' : 'text-purple-400'}`}>
                    {state.vitals.temp.toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-400">°C</div>
                </div>
              </div>

              {/* SECONDARY VITALS */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-6">
                <div className="bg-slate-900/50 rounded p-2">
                  <div className="text-slate-400">FR</div>
                  <div className={`text-3xl font-bold ${state.vitals.rr < 8 ? 'text-red-500' : 'text-purple-400'}`}>{Math.round(state.vitals.rr)}</div>
                </div>
                <div className="bg-slate-900/50 rounded p-2">
                  <div className="text-slate-400">EtCO₂</div>
                  <div className={`text-3xl font-bold ${state.vitals.etco2 > 55 ? 'text-red-500' : 'text-yellow-400'}`}>{Math.round(state.vitals.etco2)}</div>
                </div>
                <div className="bg-slate-900/50 rounded p-2">
                  <div className="text-slate-400">TEMP</div>
                  <div className="text-3xl font-bold text-orange-400">{state.vitals.temp.toFixed(1)}</div>
                </div>
              </div>

              {/* STATUS BADGES */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${state.consciousness === 'awake' ? 'bg-green-900/50 border border-green-600' : state.consciousness === 'sedated' ? 'bg-yellow-900/50 border border-yellow-600' : state.consciousness === 'unconscious' ? 'bg-orange-900/50 border border-orange-600' : 'bg-purple-900/50 border border-purple-600'}`}>
                  {state.consciousness.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${state.hemodynamics === 'stable' ? 'bg-green-900/50 border border-green-600' : state.hemodynamics === 'hypotensive' ? 'bg-red-900/50 border border-red-600 animate-pulse' : 'bg-orange-900/50 border border-orange-600'}`}>
                  {state.hemodynamics.toUpperCase()}
                </span>
                {state.intubated && <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-900/50 border border-blue-600">🔌 INTUBADO</span>}
                {state.ardsStaging !== 'none' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-900/50 border border-red-600 animate-pulse">🫁 ARDS {state.ardsStaging.toUpperCase()}</span>}
              </div>

              {/* SEDATION SCALES */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-800/50 rounded p-2 border border-slate-700">
                  <div className="text-blue-300 font-bold">RAMSAY</div>
                  <div className="text-2xl font-bold text-blue-400">{state.sedationScore.ramsay}/6</div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 border border-slate-700">
                  <div className="text-indigo-300 font-bold">RASS</div>
                  <div className="text-2xl font-bold text-indigo-400">{state.sedationScore.rass}</div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR - QUICK STATS */}
            <div className="xl:col-span-2 space-y-4">
              {/* ORGAN FUNCTION */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700 shadow-2xl">
                <h3 className="text-lg font-bold mb-3 text-cyan-400">Función Orgánica</h3>
                {Object.entries(state.organFunction).map(([organ, value]) => (
                  <div key={organ} className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold capitalize">{organ === 'brain' ? '🧠 Cerebro' : organ === 'heart' ? '❤️ Corazón' : organ === 'lungs' ? '🫁 Pulmones' : '🫘 Riñones'}</span>
                      <span className={`text-sm font-bold ${value > 80 ? 'text-green-400' : value > 60 ? 'text-yellow-400' : value > 40 ? 'text-orange-400' : 'text-red-400'}`}>{Math.round(value)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 transition-all ${value > 80 ? 'bg-green-500' : value > 60 ? 'bg-yellow-500' : value > 40 ? 'bg-orange-500' : 'bg-red-500'}`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* GLASGOW */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700 shadow-2xl">
                <h3 className="text-lg font-bold mb-3 text-cyan-400">Glasgow Coma Scale</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900/50 rounded p-2">
                    <div className="text-xs text-slate-400">Ojos</div>
                    <div className="text-3xl font-bold text-blue-400">{state.glasgow.eye}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2">
                    <div className="text-xs text-slate-400">Verbal</div>
                    <div className="text-3xl font-bold text-green-400">{state.glasgow.verbal}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2">
                    <div className="text-xs text-slate-400">Motor</div>
                    <div className="text-3xl font-bold text-purple-400">{state.glasgow.motor}</div>
                  </div>
                </div>
                <div className={`mt-3 p-2 rounded text-center font-bold ${state.glasgow.category === 'severo' ? 'bg-red-900/50 text-red-300' : state.glasgow.category === 'moderado' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-green-900/50 text-green-300'}`}>
                  Total: {state.glasgow.total} - {state.glasgow.category.toUpperCase()}
                </div>
              </div>

              {/* PAIN & URINE */}
              <div className="grid grid-cols-2 gap-4">
                {state.consciousness === 'awake' && (
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700">
                    <h3 className="text-sm font-bold mb-2 text-cyan-400">😣 Dolor</h3>
                    <div className={`text-3xl font-bold mb-2 ${state.painScore.numeric === 0 ? 'text-green-400' : state.painScore.numeric <= 3 ? 'text-yellow-400' : state.painScore.numeric <= 6 ? 'text-orange-400' : 'text-red-400'}`}>
                      {state.painScore.numeric}/10
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${state.painScore.numeric === 0 ? 'bg-green-500' : state.painScore.numeric <= 3 ? 'bg-yellow-500' : state.painScore.numeric <= 6 ? 'bg-orange-500' : 'bg-red-500'}`}
                        style={{ width: `${(state.painScore.numeric / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-sm font-bold mb-2 text-cyan-400">💧 Orina/h</h3>
                  <div className={`text-3xl font-bold mb-2 ${state.urineOutput.hourly > 1 ? 'text-green-400' : state.urineOutput.hourly > 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {state.urineOutput.hourly.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-400">ml/min</div>
                </div>
              </div>

              {/* ARDS STAGING */}
              {state.ardsStaging !== 'none' && (
                <div className={`bg-gradient-to-br rounded-xl p-4 border shadow-2xl ${state.ardsStaging === 'mild' ? 'from-yellow-900/30 to-yellow-950/30 border-yellow-700' : state.ardsStaging === 'moderate' ? 'from-orange-900/30 to-orange-950/30 border-orange-700' : 'from-red-900/30 to-red-950/30 border-red-700'}`}>
                  <h3 className={`font-bold mb-2 ${state.ardsStaging === 'mild' ? 'text-yellow-400' : state.ardsStaging === 'moderate' ? 'text-orange-400' : 'text-red-400'}`}>
                    🫁 ARDS {state.ardsStaging.toUpperCase()}
                  </h3>
                  <div className="text-xs opacity-75">PaO₂/FiO₂ ≈ {Math.round(state.bloodGas.po2 / 0.21)}</div>
                </div>
              )}
            </div>

            {/* ORGAN FUNCTION */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border border-slate-700 shadow-xl">
              <h3 className="text-sm font-bold mb-2 text-cyan-400">Función Orgánica</h3>
              {Object.entries(state.organFunction).map(([organ, value]) => (
                <div key={organ} className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold capitalize">{organ === 'brain' ? '🧠 Cerebro' : organ === 'heart' ? '❤️ Corazón' : organ === 'lungs' ? '🫁 Pulmones' : '🫘 Riñones'}</span>
                    <span className={`text-xs font-bold ${value > 80 ? 'text-green-400' : value > 60 ? 'text-yellow-400' : value > 40 ? 'text-orange-400' : 'text-red-400'}`}>{Math.round(value)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 transition-all ${value > 80 ? 'bg-green-500' : value > 60 ? 'bg-yellow-500' : value > 40 ? 'bg-orange-500' : 'bg-red-500'}`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* ECG */}
            <div className="bg-black rounded-lg p-3 border-2 border-slate-700 shadow-xl">
              <h3 className="text-xs font-bold text-cyan-400 mb-2">ECG</h3>
              <svg viewBox="0 0 400 100" className="w-full h-12 bg-black rounded">
                {state.ecgStatus === 'normal' && (
                  <polyline points="0,50 20,50 40,50 60,30 80,50 100,50 120,50 140,45 160,55 180,50 200,50 220,50 240,30 260,50 280,50 300,50 320,50 340,30 360,50 380,50 400,50" fill="none" stroke="#22c55e" strokeWidth="2" />
                )}
                {state.ecgStatus === 'bradycardia' && (
                  <polyline points="0,50 40,50 80,50 120,30 160,50 200,50 240,50 280,50 320,30 360,50 400,50" fill="none" stroke="#ef4444" strokeWidth="2" />
                )}
                {state.ecgStatus === 'tachycardia' && (
                  <polyline points="0,50 10,50 20,50 30,25 40,50 50,50 60,50 70,25 80,50 90,50 100,50 110,25 120,50 130,50 140,50 150,25 160,50 170,50 180,50 190,25 200,50 210,50 220,50 230,25 240,50 250,50 260,50 270,25 280,50 290,50 300,50 310,25 320,50 330,50 340,50 350,25 360,50 370,50 380,50 390,25 400,50" fill="none" stroke="#fbbf24" strokeWidth="2" />
                )}
                {state.ecgStatus === 'arrhythmia' && (
                  <polyline points="0,50 20,40 40,60 60,30 80,70 100,25 120,75 140,20 160,80 180,50 200,50 220,50 240,50 260,50" fill="none" stroke="#ef4444" strokeWidth="2" />
                )}
              </svg>
              <div className="text-xs text-slate-400 mt-1 text-center">
                {state.ecgStatus === 'normal' ? 'Ritmo normal' : state.ecgStatus === 'bradycardia' ? 'BRADICARDIA' : state.ecgStatus === 'tachycardia' ? 'TAQUICARDIA' : 'ARRITMIA'}
              </div>
            </div>

            {/* VENTILATION PARAMETERS */}
            {state.intubated && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border border-slate-700 shadow-xl">
                <h3 className="text-sm font-bold mb-2 text-cyan-400">Parámetros Ventilatorios</h3>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900/50 rounded p-2">
                    <div className="text-xs text-slate-400">PIP</div>
                    <div className="text-2xl font-bold text-blue-400">{Math.round(state.pipPeep.pip)}</div>
                    <div className="text-xs text-slate-500">cmH₂O</div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2">
                    <div className="text-xs text-slate-400">PEEP</div>
                    <div className="text-2xl font-bold text-green-400">{Math.round(state.pipPeep.peep)}</div>
                    <div className="text-xs text-slate-500">cmH₂O</div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2">
                    <div className="text-xs text-slate-400">Comp.</div>
                    <div className="text-2xl font-bold text-purple-400">{Math.round(state.pipPeep.compliance)}</div>
                    <div className="text-xs text-slate-500">ml/cmH₂O</div>
                  </div>
                </div>
              </div>
            )}

            {/* VITALS CHART */}
            {state.timeline.length > 0 && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border border-slate-700 shadow-xl">
                <h3 className="text-sm font-bold mb-2 text-cyan-400">Tendencias Vitales</h3>
                <div className="h-48">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - LABS, COMPLICATIONS & ALERTS */}
          <div className="2xl:col-span-4 space-y-3">
            {/* GLASGOW COMA SCALE */}
            {state.timeline.length > 0 && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border border-slate-700 shadow-xl">
                <h3 className="text-sm font-bold mb-2 text-cyan-400">🧠 Glasgow Coma Scale</h3>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="bg-slate-900/50 rounded p-2 text-center">
                    <div className="text-xs text-slate-400">Ojos</div>
                    <div className="text-2xl font-bold text-blue-400">{state.glasgow.eye}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2 text-center">
                    <div className="text-xs text-slate-400">Verbal</div>
                    <div className="text-2xl font-bold text-green-400">{state.glasgow.verbal}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2 text-center">
                    <div className="text-xs text-slate-400">Motor</div>
                    <div className="text-2xl font-bold text-purple-400">{state.glasgow.motor}</div>
                  </div>
                </div>
                <div className={`p-2 rounded text-center font-bold text-sm ${state.glasgow.category === 'severo' ? 'bg-red-900/50 text-red-300' : state.glasgow.category === 'moderado' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-green-900/50 text-green-300'}`}>
                  Total: {state.glasgow.total} - {state.glasgow.category.toUpperCase()}
                </div>
              </div>
            )}

            {/* BLOOD GAS ANALYSIS */}
            {state.timeline.length > 0 && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border border-slate-700 shadow-xl">
                <h3 className="text-sm font-bold mb-2 text-cyan-400">🧬 Gasometría Arterial</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">pH</span>
                    <span className={`font-bold ${state.bloodGas.ph < 7.35 ? 'text-red-400' : state.bloodGas.ph > 7.45 ? 'text-yellow-400' : 'text-green-400'}`}>{state.bloodGas.ph}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PCO₂</span>
                    <span className={`font-bold ${state.bloodGas.pco2 < 35 ? 'text-yellow-400' : state.bloodGas.pco2 > 45 ? 'text-red-400' : 'text-green-400'}`}>{state.bloodGas.pco2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PO₂</span>
                    <span className={`font-bold ${state.bloodGas.po2 < 60 ? 'text-red-400' : state.bloodGas.po2 < 80 ? 'text-yellow-400' : 'text-green-400'}`}>{state.bloodGas.po2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">HCO₃</span>
                    <span className={`font-bold ${state.bloodGas.hco3 < 18 ? 'text-red-400' : state.bloodGas.hco3 > 26 ? 'text-yellow-400' : 'text-green-400'}`}>{state.bloodGas.hco3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">BE</span>
                    <span className={`font-bold ${Math.abs(state.bloodGas.be) > 2 ? 'text-yellow-400' : 'text-green-400'}`}>{state.bloodGas.be}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lactato</span>
                    <span className={`font-bold ${state.bloodGas.lac > 2 ? 'text-red-400' : state.bloodGas.lac > 1.5 ? 'text-yellow-400' : 'text-green-400'}`}>{state.bloodGas.lac}</span>
                  </div>
                </div>
              </div>
            )}

            {/* SOFA SCORE */}
            {state.timeline.length > 0 && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border border-slate-700 shadow-xl">
                <h3 className="text-sm font-bold mb-2 text-cyan-400">🏥 SOFA Score</h3>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    { label: 'Resp', value: state.sofaScores.respiratory },
                    { label: 'Coag', value: state.sofaScores.coagulation },
                    { label: 'Hígado', value: state.sofaScores.liver },
                    { label: 'CV', value: state.sofaScores.cardiovascular },
                    { label: 'SNC', value: state.sofaScores.cns },
                    { label: 'Renal', value: state.sofaScores.renal }
                  ].map((score, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded p-1.5 text-center border border-slate-700">
                      <div className="text-xs text-slate-400">{score.label}</div>
                      <div className={`text-xl font-bold ${score.value === 0 ? 'text-green-400' : score.value <= 2 ? 'text-yellow-400' : score.value <= 3 ? 'text-orange-400' : 'text-red-400'}`}>
                        {score.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`p-2 rounded border-2 text-center ${state.sofaScores.total === 0 ? 'bg-green-900/30 border-green-700' : state.sofaScores.total <= 4 ? 'bg-yellow-900/30 border-yellow-700' : state.sofaScores.total <= 8 ? 'bg-orange-900/30 border-orange-700' : 'bg-red-900/30 border-red-700'}`}>
                  <div className="text-xs font-bold mb-0.5">TOTAL SOFA</div>
                  <div className={`text-3xl font-bold ${state.sofaScores.total === 0 ? 'text-green-400' : state.sofaScores.total <= 4 ? 'text-yellow-400' : state.sofaScores.total <= 8 ? 'text-orange-400' : 'text-red-400'}`}>
                    {state.sofaScores.total}
                  </div>
                </div>
              </div>
            )}

            {/* PAIN & URINE */}
            {state.timeline.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {state.consciousness === 'awake' && (
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 border border-slate-700">
                    <h3 className="text-xs font-bold mb-1 text-cyan-400">😣 Dolor</h3>
                    <div className={`text-2xl font-bold mb-1 ${state.painScore.numeric === 0 ? 'text-green-400' : state.painScore.numeric <= 3 ? 'text-yellow-400' : state.painScore.numeric <= 6 ? 'text-orange-400' : 'text-red-400'}`}>
                      {state.painScore.numeric}/10
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${state.painScore.numeric === 0 ? 'bg-green-500' : state.painScore.numeric <= 3 ? 'bg-yellow-500' : state.painScore.numeric <= 6 ? 'bg-orange-500' : 'bg-red-500'}`}
                        style={{ width: `${(state.painScore.numeric / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 border border-slate-700">
                  <h3 className="text-xs font-bold mb-1 text-cyan-400">💧 Orina</h3>
                  <div className={`text-2xl font-bold ${state.urineOutput.hourly > 1 ? 'text-green-400' : state.urineOutput.hourly > 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {state.urineOutput.hourly.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-400">ml/min</div>
                </div>
              </div>
            )}

            {/* WARNINGS */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border border-slate-700 shadow-xl">
              <h3 className="text-sm font-bold mb-2 text-cyan-400">⚠️ Alertas</h3>
              {state.warnings.length === 0 ? (
                <div className="text-center py-4 text-slate-500 text-xs">
                  <div className="text-2xl mb-1">✅</div>
                  <div>Sin alertas</div>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {state.warnings.slice(-15).reverse().map((w, idx) => (
                    <div key={idx} className={`p-2 rounded text-xs border-l-2 ${w.severity === 'critical' ? 'bg-red-900/30 border-l-red-600 text-red-200' : w.severity === 'high' ? 'bg-orange-900/30 border-l-orange-600 text-orange-200' : w.severity === 'medium' ? 'bg-yellow-900/30 border-l-yellow-600 text-yellow-200' : 'bg-blue-900/30 border-l-blue-600 text-blue-200'}`}>
                      {w.message}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* COMPLICATIONS */}
            {state.complications.filter(c => c.active).length > 0 && (
              <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 rounded-lg p-3 border border-red-700 shadow-xl">
                <h3 className="text-sm font-bold mb-2 text-red-400">🚨 Complicaciones</h3>
                <div className="space-y-1.5">
                  {state.complications.filter(c => c.active).map((comp, idx) => (
                    <div key={idx} className={`p-2 rounded text-xs border-l-2 ${comp.severity === 'critical' ? 'bg-red-900/50 border-l-red-600' : comp.severity === 'severe' ? 'bg-red-900/40 border-l-red-500' : comp.severity === 'moderate' ? 'bg-yellow-900/40 border-l-yellow-500' : 'bg-orange-900/40 border-l-orange-500'}`}>
                      <div className="font-bold">
                        {comp.type === 'pulmonaryEdema' && '🫁 Edema Pulmonar'}
                        {comp.type === 'aspiration' && '🤤 Aspiración'}
                        {comp.type === 'aspirationPneumonitis' && '🫁 Neumonitis'}
                        {comp.type === 'malignantHyperthermia' && '🔥 Hipertermia Maligna'}
                        {comp.type === 'rhabdo' && '💪 Rabdomiolisis'}
                        {comp.type === 'disseminated' && '🩸 CID'}
                        {comp.type === 'ards' && '🫁 ARDS'}
                        {comp.type === 'dvi' && '💥 Hiperkalemia'}
                      </div>
                      <div className="text-xs opacity-75 mt-0.5">{comp.onset}s | {comp.severity}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MEDICATION TIMELINE */}
            {state.medicationTimeline.length > 0 && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border border-slate-700 shadow-xl">
                <h3 className="text-sm font-bold mb-2 text-cyan-400">📋 Medicación</h3>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {state.medicationTimeline.slice(-8).reverse().map((med, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-1.5 bg-slate-900/50 rounded border border-slate-700">
                      <span className="font-semibold">{med.drug}</span>
                      <span className="text-slate-400">{med.dose} {med.unit}</span>
                      <span className="text-slate-500">@{med.time}s</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VirtualTwin
