# 💻 Ejemplos de Código - Sistema de Simulación Mejorado

## 📘 Índice de Ejemplos

1. [Cálculo de Tasa de Metabolismo](#1-cálculo-de-tasa-de-metabolismo)
2. [Escalas de Sedación](#2-escalas-de-sedación)
3. [Advertencias Farmacogenéticas](#3-advertencias-farmacogenéticas)
4. [Ajustes Farmacocinéticos](#4-ajustes-farmacocinéticos)
5. [Intubación Funcional](#5-intubación-funcional)
6. [Actualización de Órganos](#6-actualización-de-órganos)
7. [Tooltips Educativos](#7-tooltips-educativos)

---

## 1. Cálculo de Tasa de Metabolismo

### Código Completo
```typescript
function getMetabolismRate(): number {
  let rate = 1.0 // Base 100%

  // Factor 1: Genotipo CYP2D6
  const cyp2d6 = patient.pgx.find(g => g.gene === 'CYP2D6')
  if (cyp2d6?.genotype === 'PM') rate *= 0.2   // Poor Metabolizer: 20%
  if (cyp2d6?.genotype === 'IM') rate *= 0.7   // Intermediate: 70%
  if (cyp2d6?.genotype === 'UM') rate *= 2.5   // Ultra-rapid: 250%

  // Factor 2: Genotipo CYP2C19
  const cyp2c19 = patient.pgx.find(g => g.gene === 'CYP2C19')
  if (cyp2c19?.genotype === 'PM') rate *= 0.2
  if (cyp2c19?.genotype === 'UM') rate *= 2.0

  // Factor 3: Edad
  if (patient.age > 75) rate *= 0.7  // Reducción 30%
  else if (patient.age > 65) rate *= 0.85  // Reducción 15%

  // Factor 4: Función hepática
  const ast = patient.labs.find(l => l.name === 'AST')?.value || 0
  const alt = patient.labs.find(l => l.name === 'ALT')?.value || 0
  if (ast > 100 || alt > 100) rate *= 0.8  // Reducción 20%

  // Factor 5: Función renal
  const creatinine = patient.labs.find(l => l.name === 'Creatinina')?.value || 0
  if (creatinine > 2.0) rate *= 0.85  // Reducción 15%

  return Math.max(0.1, rate)  // Mínimo 10%
}
```

### Ejemplo de Ejecución
```typescript
// Caso 1: Paciente normal joven
{
  age: 35,
  pgx: [{ gene: 'CYP2D6', genotype: 'EM' }],
  labs: [{ name: 'AST', value: 30 }]
}
// Resultado: rate = 1.0 (100%)

// Caso 2: Paciente anciano con hepatopatía y PM
{
  age: 78,
  pgx: [{ gene: 'CYP2D6', genotype: 'PM' }],
  labs: [{ name: 'AST', value: 150 }, { name: 'ALT', value: 140 }]
}
// Cálculo:
// - Base: 1.0
// - CYP2D6 PM: 1.0 × 0.2 = 0.2
// - Edad >75: 0.2 × 0.7 = 0.14
// - Hepatopatía: 0.14 × 0.8 = 0.112
// Resultado: rate = 0.112 (11.2%)

// Caso 3: Metabolizador ultra-rápido
{
  age: 25,
  pgx: [{ gene: 'CYP2D6', genotype: 'UM' }],
  labs: [{ name: 'AST', value: 25 }]
}
// Resultado: rate = 2.5 (250%)
```

---

## 2. Escalas de Sedación

### Código de Cálculo
```typescript
function calculateSedationScores(effectMagnitude: number) {
  // effectMagnitude va de 0 (sin efecto) a 1 (efecto máximo)

  // Escala de Ramsay: 1 (despierto) a 6 (no responde)
  // Mapeo lineal: 0 → 1, 0.2 → 2, 0.4 → 3, 0.6 → 4, 0.8 → 5, 1.0 → 6
  const ramsay = Math.min(6, Math.max(1, Math.ceil(1 + effectMagnitude * 5)))

  // Escala RASS: 0 (alerta) a -5 (no despierta)
  // Mapeo: 0 → 0, 0.2 → -1, 0.4 → -2, 0.6 → -3, 0.8 → -4, 1.0 → -5
  const rass = Math.round(-effectMagnitude * 5)

  // Descripción textual según RASS
  const descriptions: Record<number, string> = {
    0: 'Alerta y calmado',
    [-1]: 'Somnoliento',
    [-2]: 'Sedación ligera',
    [-3]: 'Sedación moderada',
    [-4]: 'Sedación profunda',
    [-5]: 'No despierta',
  }

  return {
    ramsay,
    rass,
    description: descriptions[rass] || 'Alerta y calmado'
  }
}
```

### Ejemplos de Uso
```typescript
// Ejemplo 1: Efecto mínimo (0.15)
calculateSedationScores(0.15)
// → { ramsay: 1, rass: 0, description: 'Alerta y calmado' }

// Ejemplo 2: Sedación ligera (0.35)
calculateSedationScores(0.35)
// → { ramsay: 3, rass: -2, description: 'Sedación ligera' }

// Ejemplo 3: Sedación moderada (0.55)
calculateSedationScores(0.55)
// → { ramsay: 4, rass: -3, description: 'Sedación moderada' }

// Ejemplo 4: Sedación profunda (0.85)
calculateSedationScores(0.85)
// → { ramsay: 5, rass: -4, description: 'Sedación profunda' }

// Ejemplo 5: No despierta (1.0)
calculateSedationScores(1.0)
// → { ramsay: 6, rass: -5, description: 'No despierta' }
```

### Visualización en UI
```tsx
// En el componente
<div className="text-center group relative">
  <div className="text-xs text-blue-400 mb-1">RAMSAY</div>
  <div className={`text-3xl font-bold font-mono ${
    state.sedationScore.ramsay >= 5 ? 'text-red-400 animate-pulse' : 
    state.sedationScore.ramsay >= 3 ? 'text-green-400' : 'text-yellow-400'
  }`}>
    {state.sedationScore.ramsay}
  </div>
  <div className="text-[10px] text-slate-400 mt-1">
    {state.sedationScore.ramsay === 1 ? '1-Despierto' :
     state.sedationScore.ramsay === 2 ? '2-Cooperador' :
     state.sedationScore.ramsay === 3 ? '3-Responde' :
     state.sedationScore.ramsay === 4 ? '4-Dormido' :
     state.sedationScore.ramsay === 5 ? '5-Respuesta lenta' :
     '6-No responde'}
  </div>
</div>
```

---

## 3. Advertencias Farmacogenéticas

### Código del Sistema de Alertas
```tsx
{(() => {
  const cyp2d6 = patient.pgx.find(g => g.gene === 'CYP2D6')
  const cyp2c19 = patient.pgx.find(g => g.gene === 'CYP2C19')
  const isPM = cyp2d6?.genotype === 'PM' || cyp2c19?.genotype === 'PM'
  const isUM = cyp2d6?.genotype === 'UM' || cyp2c19?.genotype === 'UM'
  const affectedDrugs = ['Propofol', 'Midazolam', 'Fentanyl']
  
  if ((isPM || isUM) && affectedDrugs.includes(simulation.drug)) {
    return (
      <div className={`p-2 rounded-lg text-xs border ${
        isPM ? 'bg-red-900/30 border-red-700 text-red-300' : 
               'bg-yellow-900/30 border-yellow-700 text-yellow-300'
      }`}>
        <div className="font-bold mb-1">⚠ Advertencia Farmacogenética</div>
        <div className="text-[10px] leading-tight">
          {isPM && (
            <>
              Metabolizador LENTO detectado. Espere:
              <ul className="ml-3 mt-1 space-y-0.5">
                <li>• Efecto prolongado (~3-5x)</li>
                <li>• Aclaramiento reducido</li>
                <li>• Considere reducir dosis 30-50%</li>
              </ul>
            </>
          )}
          {isUM && (
            <>
              Metabolizador RÁPIDO detectado. Espere:
              <ul className="ml-3 mt-1 space-y-0.5">
                <li>• Efecto reducido (~40-60%)</li>
                <li>• Duración más corta</li>
                <li>• Puede necesitar dosis mayores</li>
              </ul>
            </>
          )}
        </div>
      </div>
    )
  }
  return null
})()}
```

### Ejemplo de Renderizado
```
┌────────────────────────────────┐
│ ⚠️ Advertencia Farmacogenética │  ← Fondo rojo/30% transparencia
│                                │
│ Metabolizador LENTO detectado  │
│ Espere:                        │
│  • Efecto prolongado (~3-5x)   │
│  • Aclaramiento reducido       │
│  • Considere reducir dosis 30% │
└────────────────────────────────┘
```

---

## 4. Ajustes Farmacocinéticos

### Lógica de Ajuste en Simulación
```typescript
function runSimulation() {
  const drug = drugDatabase[simulation.drug]
  const metabolismRate = getMetabolismRate()
  
  // 1. Ajuste de Duración (inversamente proporcional)
  const baseDuration = drug.duration // segundos
  const adjustedDuration = baseDuration / metabolismRate
  
  // Ejemplo:
  // PM (0.2): 600s → 600/0.2 = 3000s (50 min) ← 5x más largo
  // EM (1.0): 600s → 600/1.0 = 600s (10 min) ← Normal
  // UM (2.5): 600s → 600/2.5 = 240s (4 min) ← 2.5x más corto
  
  // 2. Ajuste del Tiempo al Pico (raíz cuadrada)
  const basePeak = drug.peak
  const adjustedPeak = basePeak / Math.sqrt(metabolismRate)
  
  // Ejemplo:
  // PM (0.2): 120s → 120/√0.2 = 120/0.447 = 268s ← Pico más tardío
  // EM (1.0): 120s → 120/√1.0 = 120s ← Normal
  // UM (2.5): 120s → 120/√2.5 = 120/1.58 = 76s ← Pico más temprano
  
  // 3. Ajuste de Magnitud del Efecto (reducido en UM)
  let effectMagnitude = drug.effectMagnitude
  if (metabolismRate > 1.5) {
    effectMagnitude *= (1 / metabolismRate) * 0.6
  }
  
  // Ejemplo:
  // UM (2.5): 0.8 → 0.8 × (1/2.5) × 0.6 = 0.8 × 0.4 × 0.6 = 0.192
  // Resultado: Efecto ~76% reducido
  
  // 4. Cálculo de Concentración en Sitio de Efecto (simplificado)
  const doseInMg = simulation.unit === 'mg/kg' 
    ? simulation.dose * patient.weight 
    : simulation.dose
  
  const volumeOfDistribution = 0.5 * patient.weight // L (simplificado)
  const effectSiteConcentration = (doseInMg / volumeOfDistribution) * effectMagnitude
  
  // 5. Generar Advertencias
  const warnings: Warning[] = []
  if (metabolismRate < 0.5) {
    warnings.push({
      message: `Metabolizador LENTO: Espere duración ~${Math.round(adjustedDuration/baseDuration)}x más prolongada`,
      severity: 'high'
    })
  }
  if (metabolismRate > 1.5) {
    warnings.push({
      message: `Metabolizador RÁPIDO: Efecto reducido ~${Math.round((1-effectMagnitude/drug.effectMagnitude)*100)}%`,
      severity: 'medium'
    })
  }
  
  // 6. Actualizar Estado
  setState(prev => ({
    ...prev,
    pharmacokinetics: {
      effectSiteConcetration: effectSiteConcentration,
      metabolismRate,
      clearanceRate: metabolismRate * 0.15 // L/min (simplificado)
    },
    warnings: [...prev.warnings, ...warnings]
  }))
}
```

### Tabla de Comparación
```
┌───────────┬──────────────┬──────────────┬──────────────┐
│ Parámetro │ PM (20%)     │ EM (100%)    │ UM (250%)    │
├───────────┼──────────────┼──────────────┼──────────────┤
│ Duración  │ 50 min (5x)  │ 10 min (1x)  │ 4 min (0.4x) │
│ Pico      │ 268s (2.2x)  │ 120s (1x)    │ 76s (0.6x)   │
│ Efecto    │ 0.8 (100%)   │ 0.8 (100%)   │ 0.19 (24%)   │
│ [Drug]    │ 2.5 μg/mL ↑  │ 1.2 μg/mL    │ 0.5 μg/mL ↓  │
└───────────┴──────────────┴──────────────┴──────────────┘
```

---

## 5. Intubación Funcional

### Código del Botón de Intubación
```typescript
const handleIntubation = () => {
  setState(prev => ({
    ...prev,
    ventilation: 'mechanical',
    intubated: true,
    vitals: {
      ...prev.vitals,
      rr: 12,        // Ventilación controlada
      spo2: Math.max(prev.vitals.spo2, 98),  // Oxigenación óptima
      etco2: 38      // EtCO₂ normalizado
    },
    organFunction: {
      ...prev.organFunction,
      lungs: 95,     // ← CLAVE: Pulmones a 95% (verde)
      brain: Math.min(100, prev.organFunction.brain + 10) // Mejora cerebral
    },
    // Eliminar alertas respiratorias
    warnings: prev.warnings.filter(w => 
      !w.message.includes('hipoxia') && 
      !w.message.includes('apnea') &&
      !w.message.includes('respiratoria')
    ),
    // Agregar mensaje de éxito
    messages: [
      ...prev.messages,
      {
        text: '✅ Paciente intubado y ventilado correctamente',
        type: 'success',
        timestamp: Date.now()
      }
    ]
  }))
}
```

### Antes vs Después
```
ANTES DE INTUBAR:
┌─────────────────────────┐
│  SpO₂: 85% 🔴           │
│  FR: 8 rpm 🔴           │
│  Estado: APNEIC         │
│  Pulmones: 45% 🔴       │
│  Cerebro: 70% 🟡        │
│  ⚠️ Hipoxia severa      │
│  ⚠️ Apnea detectada     │
└─────────────────────────┘

[🔌 Intubar] ← Presionar

DESPUÉS DE INTUBAR:
┌─────────────────────────┐
│  SpO₂: 98% 🟢           │
│  FR: 12 rpm 🟢          │
│  Estado: INTUBATED      │
│  Pulmones: 95% 🟢       │ ← Cambio visual dramático
│  Cerebro: 80% 🟢        │
│  ✅ Intubado            │
└─────────────────────────┘
```

---

## 6. Actualización de Órganos

### Lógica de Función Orgánica
```typescript
// En runSimulation(), después de calcular vitals
const newOrganFunction = {
  brain: Math.max(0, Math.min(100, 
    50 + (state.vitals.sbp - 90) * 0.5 +  // Perfusión cerebral
    (state.vitals.spo2 - 90) * 2          // Oxigenación
  )),
  
  heart: Math.max(0, Math.min(100,
    70 + (state.vitals.hr - 60) * 0.3 +   // Función cardíaca
    (state.vitals.sbp - 90) * 0.4         // Postcarga
  )),
  
  lungs: state.intubated ? 95 :           // Si intubado → 95%
    Math.max(0, Math.min(100,
      50 + state.vitals.spo2 * 0.5 +      // Oxigenación
      (20 - state.vitals.rr) * -1         // Taquipnea penaliza
    )),
  
  kidneys: Math.max(0, Math.min(100,
    60 + (state.vitals.sbp - 90) * 0.6 +  // Perfusión renal
    (creatinina < 1.2 ? 20 : -20)         // Función basal
  ))
}

setState(prev => ({
  ...prev,
  organFunction: newOrganFunction
}))
```

### Ejemplo de Evolución
```typescript
// t=0s: Estado basal
{ brain: 90, heart: 85, lungs: 95, kidneys: 90 }

// t=60s: Propofol 2mg/kg administrado (PM patient)
// - SBP: 120 → 85 (hipotensión)
// - HR: 75 → 55 (bradicardia)
// - SpO₂: 98 → 92 (desaturación leve)
{ brain: 70, heart: 75, lungs: 80, kidneys: 70 }

// t=120s: Intubación realizada
// - lungs → 95 (forzado por intubación)
// - SpO₂: 92 → 98 (mejora inmediata)
// - brain: +10 por mejor oxigenación
{ brain: 80, heart: 75, lungs: 95, kidneys: 70 }

// t=240s: Phenylephrine administrada
// - SBP: 85 → 110 (mejora perfusión)
{ brain: 85, heart: 80, lungs: 95, kidneys: 85 }
```

---

## 7. Tooltips Educativos

### Implementación con Tailwind CSS
```tsx
// Tooltip para parámetro farmacocinético
<div className="flex justify-between group relative">
  <span className="text-slate-400">Inicio (Onset):</span>
  <span>{drug.onset}s</span>
  
  {/* Tooltip (oculto por defecto) */}
  <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block 
                  bg-slate-950 text-white text-[10px] rounded p-2 w-52 z-50 
                  shadow-xl border border-slate-700">
    <span className="font-bold">Tiempo de inicio:</span> 
    Tiempo desde la administración hasta que aparecen los primeros efectos clínicos.
  </div>
</div>
```

### Tooltips de Escalas
```tsx
// Tooltip para Escala de Ramsay
<div className="text-center group relative">
  <div className="text-3xl font-bold">{state.sedationScore.ramsay}</div>
  
  {/* Tooltip con escala completa */}
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                  hidden group-hover:block bg-slate-900 text-white text-xs 
                  rounded p-2 w-48 z-50 shadow-xl border border-slate-700">
    <div className="font-bold mb-1">Escala de Ramsay:</div>
    <div className="text-left text-[10px] leading-tight space-y-0.5">
      <div>1: Despierto, ansioso/agitado</div>
      <div>2: Cooperador, orientado</div>
      <div>3: Responde a órdenes</div>
      <div>4: Dormido, responde rápido</div>
      <div>5: Dormido, respuesta lenta</div>
      <div>6: No responde</div>
    </div>
  </div>
</div>
```

### CSS Classes Clave
```css
/* Clases de Tailwind usadas */
.group:hover .group-hover:block → Tooltip aparece al hover del grupo
.absolute.bottom-full → Posición sobre el elemento
.left-1/2.-translate-x-1/2 → Centrado horizontal
.z-50 → Sobre todo el contenido
.shadow-xl.border → Sombra y borde para destacar
```

---

## 🧪 Tests Unitarios Sugeridos

### Test 1: Cálculo de Metabolismo
```typescript
describe('getMetabolismRate', () => {
  it('debería retornar 1.0 para paciente normal', () => {
    const rate = getMetabolismRate({
      age: 35,
      pgx: [{ gene: 'CYP2D6', genotype: 'EM' }],
      labs: []
    })
    expect(rate).toBe(1.0)
  })
  
  it('debería retornar 0.2 para PM', () => {
    const rate = getMetabolismRate({
      age: 35,
      pgx: [{ gene: 'CYP2D6', genotype: 'PM' }],
      labs: []
    })
    expect(rate).toBe(0.2)
  })
  
  it('debería combinar factores (PM + anciano + hepatopatía)', () => {
    const rate = getMetabolismRate({
      age: 78,
      pgx: [{ gene: 'CYP2D6', genotype: 'PM' }],
      labs: [
        { name: 'AST', value: 150 },
        { name: 'ALT', value: 140 }
      ]
    })
    // 0.2 (PM) × 0.7 (edad) × 0.8 (hígado) = 0.112
    expect(rate).toBeCloseTo(0.112, 2)
  })
})
```

### Test 2: Escalas de Sedación
```typescript
describe('calculateSedationScores', () => {
  it('debería retornar Ramsay 1 y RASS 0 con efecto 0', () => {
    const scores = calculateSedationScores(0)
    expect(scores.ramsay).toBe(1)
    expect(scores.rass).toBe(0)
    expect(scores.description).toBe('Alerta y calmado')
  })
  
  it('debería retornar Ramsay 6 y RASS -5 con efecto 1', () => {
    const scores = calculateSedationScores(1.0)
    expect(scores.ramsay).toBe(6)
    expect(scores.rass).toBe(-5)
    expect(scores.description).toBe('No despierta')
  })
  
  it('debería mapear correctamente efecto intermedio', () => {
    const scores = calculateSedationScores(0.6)
    expect(scores.ramsay).toBe(4) // Dormido
    expect(scores.rass).toBe(-3)  // Sedación moderada
  })
})
```

### Test 3: Intubación
```typescript
describe('handleIntubation', () => {
  it('debería mejorar función pulmonar a 95%', () => {
    const initialState = {
      organFunction: { lungs: 45, brain: 70 },
      vitals: { spo2: 85 }
    }
    
    const newState = handleIntubation(initialState)
    
    expect(newState.organFunction.lungs).toBe(95)
    expect(newState.intubated).toBe(true)
  })
  
  it('debería eliminar alertas respiratorias', () => {
    const initialState = {
      warnings: [
        { message: 'Hipoxia severa', severity: 'critical' },
        { message: 'Hipovolemia', severity: 'high' }
      ]
    }
    
    const newState = handleIntubation(initialState)
    
    expect(newState.warnings).toHaveLength(1)
    expect(newState.warnings[0].message).toBe('Hipovolemia')
  })
})
```

---

## 🔍 Debugging Tips

### Console Logs Útiles
```typescript
// En runSimulation()
console.log('=== SIMULATION START ===')
console.log('Drug:', simulation.drug)
console.log('Metabolism Rate:', metabolismRate.toFixed(2))
console.log('Adjusted Duration:', adjustedDuration.toFixed(0), 's')
console.log('Effect Magnitude:', effectMagnitude.toFixed(2))
console.log('Sedation:', sedationScores)
console.log('========================')
```

### Breakpoints Clave
```typescript
// Colocar breakpoints en:
1. getMetabolismRate() → Verificar cálculo
2. calculateSedationScores() → Ver mapeo de escalas
3. setState() dentro de runSimulation() → Ver estado final
4. handleIntubation() → Verificar cambios de órganos
```

### Estado de Referencia
```typescript
// Estado ideal para debugging
const debugState = {
  patient: {
    age: 68,
    weight: 75,
    pgx: [{ gene: 'CYP2D6', genotype: 'PM' }],
    labs: [{ name: 'AST', value: 150 }]
  },
  simulation: {
    drug: 'Propofol',
    dose: 2.0,
    unit: 'mg/kg',
    route: 'IV'
  }
}
// Resultado esperado:
// - metabolismRate: 0.16 (PM + hepatopatía)
// - duration: ~3750s (62 min)
// - sedation: Ramsay 5-6, RASS -4 a -5
```

---

## 📚 Referencias de Implementación

### TypeScript Interfaces
```typescript
interface SimulationState {
  vitals: VitalSigns
  organFunction: OrganFunction
  sedationScore: {
    ramsay: 1 | 2 | 3 | 4 | 5 | 6
    rass: -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4
    description: string
  }
  pharmacokinetics: {
    effectSiteConcetration: number  // μg/mL
    metabolismRate: number          // 0.1 - 2.5
    clearanceRate: number           // L/min
  }
  intubated: boolean
  warnings: Warning[]
}
```

### Constantes
```typescript
const METABOLISM_FACTORS = {
  CYP2D6: {
    PM: 0.2,  // 20%
    IM: 0.7,  // 70%
    EM: 1.0,  // 100%
    UM: 2.5   // 250%
  },
  AGE: {
    OVER_75: 0.7,   // -30%
    OVER_65: 0.85   // -15%
  },
  HEPATIC: 0.8,     // -20% if AST/ALT > 100
  RENAL: 0.85       // -15% if Cr > 2.0
}

const SEDATION_THRESHOLDS = {
  RAMSAY: {
    AWAKE: 1,
    COOPERATING: 2,
    RESPONDING: 3,
    ASLEEP_RAPID: 4,
    ASLEEP_SLOW: 5,
    NO_RESPONSE: 6
  },
  RASS: {
    ALERT: 0,
    DROWSY: -1,
    LIGHT: -2,
    MODERATE: -3,
    DEEP: -4,
    UNAROUSABLE: -5
  }
}
```

---

**Nota**: Estos son ejemplos simplificados. El código real en `VirtualTwin.tsx` incluye manejo de errores, validaciones y optimizaciones adicionales.

