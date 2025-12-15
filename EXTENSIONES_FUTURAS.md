# 🔮 Extensiones Futuras - Gemelo Digital

Este documento proporciona ejemplos de código y conceptos para futuras mejoras del Gemelo Digital Anestésico.

---

## 1. 🎨 Modo Oscuro/Claro Toggle

```tsx
// Agregar al componente VirtualTwin
const [theme, setTheme] = useState<'dark' | 'light'>('dark')

const toggleTheme = () => {
  setTheme(prev => prev === 'dark' ? 'light' : 'dark')
}

// En el JSX
<button 
  onClick={toggleTheme}
  className="absolute top-4 right-4 p-2 rounded-full bg-slate-700 hover:bg-slate-600"
>
  {theme === 'dark' ? '☀️' : '🌙'}
</button>

// Aplicar tema
<div className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>
```

---

## 2. 📊 ECG Simulado

```tsx
// Nuevo componente ECGMonitor.tsx
interface ECGProps {
  hr: number
  rhythm: 'normal' | 'bradycardia' | 'tachycardia' | 'arrhythmia'
}

const ECGMonitor: React.FC<ECGProps> = ({ hr, rhythm }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let x = 0
    const drawECG = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      // Dibujar onda ECG basada en FC
      const beatInterval = (60 / hr) * 100 // ms entre latidos
      
      for (let i = 0; i < canvas.width; i++) {
        const t = (x + i) % beatInterval
        let y = canvas.height / 2
        
        // Onda QRS
        if (t < 10) {
          y += Math.sin(t * Math.PI / 10) * 40
        }
        // Onda T
        else if (t > 30 && t < 50) {
          y += Math.sin((t - 30) * Math.PI / 20) * 15
        }
        
        ctx.lineTo(i, y)
      }
      
      ctx.stroke()
      x = (x + 2) % canvas.width
      requestAnimationFrame(drawECG)
    }
    
    drawECG()
  }, [hr])
  
  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={150}
      className="w-full bg-black border border-green-500"
    />
  )
}
```

---

## 3. 🌊 Curva de Capnografía

```tsx
// Componente CapnographyWaveform.tsx
const CapnographyWaveform: React.FC<{ etco2: number; rr: number }> = ({ etco2, rr }) => {
  const chartData = {
    datasets: [{
      label: 'EtCO₂',
      data: generateCapnographyData(etco2, rr),
      borderColor: '#facc15',
      backgroundColor: 'rgba(250, 204, 21, 0.1)',
      tension: 0.2
    }]
  }
  
  return (
    <div className="h-32">
      <Line data={chartData} options={capnographyOptions} />
    </div>
  )
}

function generateCapnographyData(etco2: number, rr: number) {
  const points = []
  const cycleLength = 60 / rr // segundos por ciclo
  
  for (let t = 0; t < 10; t += 0.1) {
    const phase = (t % cycleLength) / cycleLength
    
    if (phase < 0.3) {
      // Inspiración (CO2 = 0)
      points.push({ x: t, y: 0 })
    } else if (phase < 0.5) {
      // Meseta alveolar
      points.push({ x: t, y: etco2 })
    } else {
      // Espiración
      const progress = (phase - 0.5) / 0.5
      points.push({ x: t, y: etco2 * (1 - progress) })
    }
  }
  
  return points
}
```

---

## 4. 💊 Simulación Multidroga

```tsx
interface DrugStack {
  drug: string
  dose: number
  timeAdministered: number
  active: boolean
}

const [drugStack, setDrugStack] = useState<DrugStack[]>([])

const addDrug = () => {
  setDrugStack([...drugStack, {
    drug: simulation.drug,
    dose: simulation.dose,
    timeAdministered: elapsedTime,
    active: true
  }])
}

// Calcular efectos combinados
const calculateCombinedEffects = () => {
  let totalSbpEffect = 0
  let totalHrEffect = 0
  
  drugStack.forEach(drug => {
    if (!drug.active) return
    
    const drugInfo = drugDatabase[drug.drug]
    const timeSince = elapsedTime - drug.timeAdministered
    
    if (timeSince < drugInfo.duration) {
      const magnitude = calculateMagnitude(timeSince, drugInfo)
      totalSbpEffect += drugInfo.effects.sbp * drug.dose * magnitude
      totalHrEffect += drugInfo.effects.hr * drug.dose * magnitude
    }
  })
  
  return { sbp: totalSbpEffect, hr: totalHrEffect }
}

// Interfaz en JSX
<div className="space-y-2">
  <h4>Fármacos Activos</h4>
  {drugStack.filter(d => d.active).map((drug, idx) => (
    <div key={idx} className="flex justify-between p-2 bg-slate-700 rounded">
      <span>{drug.drug} {drug.dose}mg</span>
      <button onClick={() => removeDrug(idx)}>❌</button>
    </div>
  ))}
</div>
```

---

## 5. 🎲 Biblioteca de Casos Clínicos

```tsx
const clinicalCases = {
  'induccion-rapida': {
    name: 'Inducción de Secuencia Rápida',
    patient: {
      age: 35,
      weight: 80,
      asa: 2,
      comorbidities: ['Reflujo GE']
    },
    protocol: [
      { drug: 'Propofol', dose: 2, unit: 'mg/kg', time: 0 },
      { drug: 'Succinilcolina', dose: 1.5, unit: 'mg/kg', time: 30 }
    ],
    objectives: [
      'Mantener SpO2 >95%',
      'Intubar antes de 60 segundos',
      'Evitar aspiración'
    ]
  },
  'cesaréa': {
    name: 'Cesárea Urgente',
    patient: {
      age: 28,
      weight: 75,
      gender: 'F',
      asa: 2,
      comorbidities: ['Embarazo 39s']
    },
    protocol: [
      { drug: 'Propofol', dose: 2, unit: 'mg/kg', time: 0 },
      { drug: 'Rocuronio', dose: 0.6, unit: 'mg/kg', time: 30 }
    ]
  }
}

const loadCase = (caseId: string) => {
  const clinicalCase = clinicalCases[caseId]
  setPatient(clinicalCase.patient)
  // Auto-ejecutar protocolo
  clinicalCase.protocol.forEach(step => {
    setTimeout(() => {
      setSimulation(step)
      runSimulation()
    }, step.time * 1000)
  })
}
```

---

## 6. 📤 Exportar Resultados a PDF

```tsx
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const exportToPDF = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  
  // Título
  pdf.setFontSize(20)
  pdf.text('Simulación Anestésica - Reporte', 20, 20)
  
  // Datos del paciente
  pdf.setFontSize(12)
  pdf.text(`Paciente: ${patient.age} años, ${patient.weight}kg`, 20, 40)
  pdf.text(`ASA: ${patient.asa}`, 20, 50)
  
  // Fármaco administrado
  pdf.text(`Fármaco: ${simulation.drug} ${simulation.dose}${simulation.unit}`, 20, 60)
  
  // Capturar gráfica
  const chartElement = document.getElementById('timeline-chart')
  if (chartElement) {
    const canvas = await html2canvas(chartElement)
    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 20, 70, 170, 80)
  }
  
  // Tabla de eventos críticos
  let yPos = 160
  pdf.text('Eventos Críticos:', 20, yPos)
  state.warnings.forEach((warning, idx) => {
    yPos += 10
    pdf.text(`${idx + 1}. ${warning.message}`, 25, yPos)
  })
  
  // Guardar
  pdf.save(`simulacion-${Date.now()}.pdf`)
}

// Botón en JSX
<button onClick={exportToPDF} className="...">
  📄 Exportar PDF
</button>
```

---

## 7. 🤖 Predicción con Machine Learning

```tsx
// Usar TensorFlow.js para predecir respuesta del paciente
import * as tf from '@tensorflow/tfjs'

interface PatientFeatures {
  age: number
  weight: number
  asa: number
  drugDose: number
  // ... más features
}

const predictResponse = async (features: PatientFeatures) => {
  // Cargar modelo pre-entrenado
  const model = await tf.loadLayersModel('/models/anesthesia-model.json')
  
  // Preparar tensor de entrada
  const inputTensor = tf.tensor2d([[
    features.age / 100, // normalizar
    features.weight / 100,
    features.asa / 4,
    features.drugDose / 10
  ]])
  
  // Predecir
  const prediction = model.predict(inputTensor) as tf.Tensor
  const values = await prediction.data()
  
  return {
    predictedSBP: values[0] * 200, // desnormalizar
    predictedHR: values[1] * 200,
    predictedSpO2: values[2] * 100,
    confidence: values[3]
  }
}

// Mostrar predicción vs realidad
<div className="comparison">
  <h4>Predicción ML vs Simulación</h4>
  <div>
    <span>PAS predicha: {mlPrediction.predictedSBP}</span>
    <span>PAS real: {state.vitals.sbp}</span>
  </div>
</div>
```

---

## 8. 🌐 Colaboración Multi-Usuario

```tsx
// Usar WebSockets para simulación compartida
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')

// Compartir estado
const shareSimulation = () => {
  socket.emit('simulation-update', {
    roomId: 'sim-123',
    patient: patient,
    state: state,
    simulation: simulation
  })
}

// Recibir actualizaciones
useEffect(() => {
  socket.on('simulation-update', (data) => {
    setPatient(data.patient)
    setState(data.state)
    setSimulation(data.simulation)
  })
  
  return () => {
    socket.off('simulation-update')
  }
}, [])

// UI para compartir
<div>
  <button onClick={shareSimulation}>
    🔗 Compartir Simulación
  </button>
  <input 
    placeholder="Código de sala"
    onChange={e => joinRoom(e.target.value)}
  />
</div>
```

---

## 9. 🎮 Modo Gamificación

```tsx
interface Challenge {
  id: string
  name: string
  description: string
  objectives: Objective[]
  timeLimit: number
  difficulty: 'easy' | 'medium' | 'hard'
}

interface Objective {
  type: 'maintain-sbp' | 'avoid-hypoxia' | 'intubate-time'
  target: number
  tolerance: number
}

const challenges: Challenge[] = [
  {
    id: 'speed-intubation',
    name: 'Intubación Rápida',
    description: 'Induce y relaja al paciente en <90 segundos',
    objectives: [
      { type: 'intubate-time', target: 90, tolerance: 10 }
    ],
    timeLimit: 90,
    difficulty: 'medium'
  }
]

const [score, setScore] = useState(0)
const [achievements, setAchievements] = useState<string[]>([])

const checkAchievements = () => {
  if (state.vitals.sbp > 100 && state.vitals.sbp < 140) {
    unlockAchievement('perfect-pressure')
  }
  if (state.warnings.length === 0) {
    unlockAchievement('no-complications')
  }
}

// UI de Desafíos
<div className="challenges-panel">
  <h3>🏆 Desafíos</h3>
  {challenges.map(challenge => (
    <div key={challenge.id} className="challenge-card">
      <h4>{challenge.name}</h4>
      <p>{challenge.description}</p>
      <button onClick={() => startChallenge(challenge)}>
        Comenzar
      </button>
    </div>
  ))}
</div>
```

---

## 10. 🔊 Alarmas Sonoras

```tsx
const playAlarm = (severity: 'low' | 'high' | 'critical') => {
  const audioContext = new AudioContext()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  // Frecuencias según severidad
  const frequencies = {
    low: 440,      // La
    high: 880,     // La alto
    critical: 1760 // La muy alto
  }
  
  oscillator.frequency.value = frequencies[severity]
  gainNode.gain.value = 0.3
  
  oscillator.start()
  
  // Patrón de alarma
  if (severity === 'critical') {
    // Beep rápido repetitivo
    setTimeout(() => oscillator.stop(), 200)
    setTimeout(() => playAlarm('critical'), 400)
  } else {
    setTimeout(() => oscillator.stop(), 500)
  }
}

// Activar alarma cuando hay warning crítico
useEffect(() => {
  const criticalWarning = state.warnings.find(w => w.severity === 'critical')
  if (criticalWarning) {
    playAlarm('critical')
  }
}, [state.warnings])
```

---

## 💡 Estructura de Archivos Recomendada

```
src/
├── components/
│   ├── VirtualTwin/
│   │   ├── VirtualTwin.tsx (principal)
│   │   ├── Monitor.tsx (constantes vitales)
│   │   ├── HumanBody.tsx (anatomía SVG)
│   │   ├── ECGWaveform.tsx
│   │   ├── CapnographyWaveform.tsx
│   │   ├── TimelineChart.tsx
│   │   ├── PatientPanel.tsx
│   │   ├── DrugPanel.tsx
│   │   ├── AlertsPanel.tsx
│   │   └── QuickActions.tsx
│   └── ...
├── hooks/
│   ├── useSimulation.ts
│   ├── useVitals.ts
│   └── useDrugDatabase.ts
├── lib/
│   ├── pharmacokinetics.ts
│   ├── physiologyModels.ts
│   └── mlPredictor.ts
├── types/
│   ├── simulation.d.ts
│   └── drugs.d.ts
└── data/
    ├── drugDatabase.ts
    ├── clinicalCases.ts
    └── achievements.ts
```

---

## 🚀 Roadmap Sugerido

### Fase 1 (1-2 semanas)
- ✅ Monitor de constantes vitales
- ✅ Visualización anatómica básica
- ✅ Simulación de 6 fármacos principales
- ✅ Gráficas temporales

### Fase 2 (2-3 semanas)
- [ ] ECG simulado
- [ ] Curvas de capnografía
- [ ] Simulación multidroga
- [ ] Exportar a PDF

### Fase 3 (3-4 semanas)
- [ ] Biblioteca de casos clínicos
- [ ] Modo gamificación
- [ ] Alarmas sonoras
- [ ] Predicción con ML

### Fase 4 (1-2 meses)
- [ ] Modelo 3D con Three.js
- [ ] Colaboración multi-usuario
- [ ] Integración con HIS/EMR
- [ ] VR/AR support

---

**Estas extensiones transformarán el Gemelo Digital en una herramienta completa de formación y simulación clínica.** 🎓✨
