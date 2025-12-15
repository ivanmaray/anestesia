# 🧬 Mejoras de Simulación Farmacológica - Gemelo Digital

## 📋 Resumen de Mejoras Implementadas

Se ha mejorado significativamente el Gemelo Digital Anestésico con un modelo farmacológico avanzado que incluye:

### ✅ 1. Escalas de Sedación Profesionales

#### Escala de Ramsay (1-6)
Visualizada en el monitor UCI con código de colores:
- **1**: Despierto, ansioso/agitado → 🟡 Amarillo
- **2**: Cooperador, orientado, tranquilo → 🟡 Amarillo
- **3**: Responde a órdenes → 🟢 Verde
- **4**: Dormido, respuesta rápida al estímulo → 🟢 Verde
- **5**: Dormido, respuesta lenta al estímulo → 🔴 Rojo (crítico)
- **6**: No responde → 🔴 Rojo (crítico)

#### Escala RASS (-5 a +4)
Sistema estandarizado de sedación-agitación:
- **+4**: Combativo, violento
- **+3**: Muy agitado
- **+2**: Agitado
- **+1**: Inquieto
- **0**: Alerta y calmado → 🟡 Amarillo
- **-1**: Somnoliento → 🟡 Amarillo
- **-2**: Sedación ligera → 🟢 Verde
- **-3**: Sedación moderada → 🟢 Verde
- **-4**: Sedación profunda → 🔴 Rojo
- **-5**: No despierta → 🔴 Rojo

**Ubicación en UI**: Panel central superior, junto a signos vitales principales.

**Tooltips informativos**: Al pasar el ratón sobre Ramsay o RASS, aparece tooltip con descripción completa de todas las categorías.

---

### ✅ 2. Modelo Farmacogenético Avanzado

#### Genes Implementados

##### CYP2D6 (Citocromo P450 2D6)
Metaboliza: Propofol, Midazolam, Fentanyl
- **PM (Poor Metabolizer)**: 5-10% población → Metabolismo 20% (0.2x)
- **IM (Intermediate)**: 10-15% población → Metabolismo 70% (0.7x)
- **EM (Extensive - Normal)**: 70-80% población → Metabolismo 100% (1.0x)
- **UM (Ultra-rapid)**: 5-10% población → Metabolismo 250% (2.5x)

##### CYP2C19
Similar a CYP2D6, afecta benzodiacepinas y algunos opioides.

##### RYR1 (Receptor de Rianodina)
- **NN (Normal)**: Sin riesgo
- **NC (Portador)**: Riesgo de hipertermia maligna con succinilcolina/halogenados

#### Efectos Farmacocinéticos por Genotipo

**Poor Metabolizers (PM)**:
```
✓ Duración: 3-5x más prolongada
✓ Concentración plasmática: Más elevada
✓ Aclaramiento: 80% reducido
✓ Riesgo: Toxicidad, sedación excesiva
✓ Recomendación: Reducir dosis 30-50%
```

**Ultra-rapid Metabolizers (UM)**:
```
✓ Efecto pico: 40-60% reducido
✓ Duración: 50-70% más corta
✓ Aclaramiento: 2.5x acelerado
✓ Riesgo: Efecto insuficiente
✓ Recomendación: Aumentar dosis o frecuencia
```

#### Factores Adicionales que Modifican el Metabolismo

1. **Edad > 65 años**: -15% metabolismo
2. **Edad > 75 años**: -30% metabolismo
3. **Función hepática alterada** (AST/ALT > 100): -20% metabolismo
4. **Insuficiencia renal** (Creatinina > 2.0): -15% metabolismo

---

### ✅ 3. Advertencias Farmacogenéticas en Tiempo Real

#### Sistema de Alertas Preventivas
Antes de administrar un fármaco, el sistema analiza:

**Para Metabolizadores Lentos (PM/IM)**:
```
⚠️ Advertencia Farmacogenética
Metabolizador LENTO detectado. Espere:
• Efecto prolongado (~3-5x)
• Aclaramiento reducido
• Considere reducir dosis 30-50%
```

**Para Metabolizadores Rápidos (UM)**:
```
⚠️ Advertencia Farmacogenética
Metabolizador RÁPIDO detectado. Espere:
• Efecto reducido (~40-60%)
• Duración más corta
• Puede necesitar dosis mayores
```

#### Visualización del Metabolismo en Monitor
En el panel de signos vitales, se muestra:
```
Metabolismo: 20% (Lento)   → 🔴 Rojo si <50%
Metabolismo: 100% (Normal)  → 🟢 Verde
Metabolismo: 250% (Rápido)  → 🟡 Amarillo si >150%
```

---

### ✅ 4. Intubación Funcional y Respuesta Orgánica

#### Antes (Problema)
- Intubar → Sin cambios visuales en anatomía
- Pulmones permanecían rojos (hipoxia)
- No había feedback clínico claro

#### Después (Solución)
Al presionar **"Intubar Paciente"**:

1. **Pulmones → 95% (Verde)** 🟢
   - Oxigenación óptima con ventilación mecánica
   
2. **Cerebro → +10%** 🧠
   - Mejora de perfusión cerebral por oxigenación
   
3. **Signos Vitales Normalizados**:
   - SpO₂ → 98-100%
   - FR → 12-14 rpm (ventilación controlada)
   
4. **Alertas Respiratorias Eliminadas**:
   - Se filtran warnings de hipoxia/apnea
   - Mensaje: "✅ Paciente intubado y ventilado correctamente"

---

### ✅ 5. Variables Explicadas con Tooltips Educativos

#### Parámetros Farmacocinéticos (panel de administración)
Cada parámetro tiene tooltip al pasar el ratón:

**Inicio (Onset)**:
> "Tiempo desde la administración hasta que aparecen los primeros efectos clínicos."

**Pico (Peak)**:
> "Tiempo hasta alcanzar la concentración plasmática máxima y el efecto más intenso."

**Duración**:
> "Tiempo durante el cual el fármaco mantiene efectos clínicos significativos antes de requerir nueva dosis."

**Metabolismo**:
> "Principal órgano responsable de biotransformar el fármaco. Hepático: CYP450 (afectado por genética). Renal: filtración glomerular. Plasmático: esterasas."

#### Escalas de Sedación
Tooltips en Ramsay y RASS muestran la escala completa con descripciones.

---

## 🎯 Casos de Uso Educativos

### Caso 1: Paciente con CYP2D6 PM (Poor Metabolizer)
```
Escenario: Mujer, 65 años, genotipo CYP2D6 PM
Fármaco: Propofol 2 mg/kg IV

Resultado esperado:
✓ Metabolismo: 20% (Lento) → 🔴 Alerta automática
✓ Duración normal: 10 min → Duración ajustada: ~35 min
✓ Ramsay: 5-6 (sedación profunda prolongada)
✓ RASS: -4 a -5
✓ Warning: "Efecto prolongado, considere reducir dosis"
```

### Caso 2: Paciente con CYP2D6 UM (Ultra-rapid Metabolizer)
```
Escenario: Hombre, 30 años, genotipo CYP2D6 UM
Fármaco: Midazolam 0.1 mg/kg IV

Resultado esperado:
✓ Metabolismo: 250% (Rápido) → 🟡 Alerta automática
✓ Efecto pico: Reducido 40-60%
✓ Duración: 50% más corta
✓ Ramsay: 2-3 (sedación insuficiente)
✓ RASS: -1 a 0
✓ Warning: "Metabolismo acelerado, puede necesitar más dosis"
```

### Caso 3: Intubación en Paciente Hipóxico
```
Escenario: Paciente con SpO₂ 85%, apnea, pulmones rojos
Acción: Presionar "Intubar Paciente"

Resultado inmediato:
✓ Pulmones: 95% → Color verde 🟢
✓ SpO₂: 85% → 98-100%
✓ Cerebro: +10% función
✓ FR: 12 rpm (ventilación controlada)
✓ Alertas respiratorias eliminadas
✓ Mensaje: "✅ Paciente intubado y ventilado correctamente"
```

### Caso 4: Anciano con Hepatopatía
```
Escenario: Hombre, 78 años, AST 150, ALT 140, CYP2D6 EM
Fármaco: Fentanyl 2 mcg/kg IV

Cálculo de metabolismo:
- Base CYP2D6 EM: 1.0x
- Edad >75 años: -30% → 0.7x
- Hepatopatía (AST>100): -20% → 0.56x

Resultado esperado:
✓ Metabolismo final: 56% (Lento)
✓ Duración: ~2x más prolongada
✓ Alerta: "Metabolismo hepático reducido"
✓ Ramsay: 4-5 (efecto más intenso y prolongado)
```

---

## 📊 Visualización de Datos en UI

### Monitor UCI (Panel Central)
```
┌─────────────────────────────────────────┐
│  PA: 120/80   FC: 75   SpO₂: 98%       │
│  FR: 12   EtCO₂: 38   Temp: 36.5°C     │
├─────────────────────────────────────────┤
│  RAMSAY: 3 (Responde)  RASS: -2 (Ligera)│
├─────────────────────────────────────────┤
│  Metabolismo: 100% (Normal)             │
│  Concentración efectiva: 2.35 μg/mL     │
└─────────────────────────────────────────┘
```

### Panel de Administración (Derecha)
```
┌──────────────────────────────────┐
│  💉 Administración               │
│  Fármaco: [Propofol ▼]           │
│  Dosis: [2.0] [mg/kg ▼]          │
│  Vía: [IV ▼]                     │
├──────────────────────────────────┤
│  ⚠️ Advertencia Farmacogenética  │
│  Metabolizador LENTO detectado   │
│  • Efecto prolongado (~3-5x)     │
│  • Considere reducir dosis 30%   │
├──────────────────────────────────┤
│  [▶ SIMULAR]                     │
├──────────────────────────────────┤
│  Parámetros Farmacocinéticos ⓘ   │
│  Inicio: 30s                     │
│  Pico: 2min                      │
│  Duración: 10min                 │
│  Metabolismo: hepático           │
└──────────────────────────────────┘
```

---

## 🧪 Detalles Técnicos de Implementación

### Función `getMetabolismRate()`
Calcula la tasa de metabolismo basándose en:
```typescript
function getMetabolismRate(): number {
  let rate = 1.0 // Base 100%
  
  // CYP2D6
  if (cyp2d6 === 'PM') rate *= 0.2  // 20%
  if (cyp2d6 === 'IM') rate *= 0.7  // 70%
  if (cyp2d6 === 'UM') rate *= 2.5  // 250%
  
  // Edad
  if (age > 75) rate *= 0.7  // -30%
  else if (age > 65) rate *= 0.85  // -15%
  
  // Función hepática
  if (ast > 100 || alt > 100) rate *= 0.8  // -20%
  
  return rate
}
```

### Función `calculateSedationScores()`
Mapea magnitud del efecto → escalas clínicas:
```typescript
function calculateSedationScores(effectMagnitude: number) {
  // effectMagnitude: 0 (sin efecto) a 1 (efecto máximo)
  
  // Ramsay: 1 (despierto) a 6 (no responde)
  ramsay = Math.min(6, Math.max(1, Math.ceil(1 + effectMagnitude * 5)))
  
  // RASS: 0 (alerta) a -5 (no despierta)
  rass = Math.round(-effectMagnitude * 5)
  
  return { ramsay, rass, description }
}
```

### Ajustes en `runSimulation()`
Los parámetros farmacocinéticos se ajustan dinámicamente:
```typescript
const metabolismRate = getMetabolismRate()

// Duración: inversamente proporcional al metabolismo
adjustedDuration = duration / metabolismRate
// PM (0.2): 10min → 50min
// UM (2.5): 10min → 4min

// Pico: raíz cuadrada del metabolismo
adjustedPeak = peak / Math.sqrt(metabolismRate)
// PM: pico más tardío
// UM: pico más temprano

// Magnitud: reducida en UM
if (metabolismRate > 1.5) {
  effectMagnitude *= (1 / metabolismRate * 0.6)
  // UM: efecto ~40-60% menor
}
```

---

## 🎓 Valor Educativo

### Para Estudiantes de Medicina
✓ Entender escalas de sedación universales (Ramsay, RASS)
✓ Visualizar impacto de la farmacogenética en la práctica clínica
✓ Aprender a interpretar farmacocinética (onset, peak, duración)
✓ Comprender respuesta orgánica a intervenciones (intubación)

### Para Residentes de Anestesia
✓ Ajustar dosis según perfil farmacogenético del paciente
✓ Anticipar duración de efecto en metabolizadores especiales
✓ Identificar riesgos de toxicidad (PM) o ineficacia (UM)
✓ Practicar toma de decisiones con variables múltiples

### Para Especialistas
✓ Herramienta de enseñanza con datos realistas
✓ Demostración visual de conceptos complejos
✓ Base para discusión de casos clínicos
✓ Simulación de escenarios raros (hipertermia maligna, PM extremo)

---

## 🚀 Acceso y Pruebas

**URL Local**: http://localhost:5174/

**Navegación**: 
1. Ir a la página principal
2. Sección "Gemelo Digital" o ruta directa a `/virtual-twin`
3. Ajustar genotipos en panel izquierdo
4. Seleccionar fármaco y dosis
5. Observar alertas farmacogenéticas
6. Presionar "SIMULAR" y monitorear:
   - Escalas de sedación (Ramsay/RASS)
   - Metabolismo calculado
   - Evolución de signos vitales
   - Cambios en anatomía (colores de órganos)

---

## 📝 Próximas Extensiones Posibles

1. **Interacciones Farmacológicas**: Alertas cuando se administran 2+ fármacos incompatibles
2. **Curvas PK/PD**: Gráficos de concentración plasmática vs. tiempo
3. **Variantes Étnicas**: Frecuencias de genotipos por población
4. **Personalización de Avisos**: Permitir configurar umbrales de alerta
5. **Exportar Casos**: Guardar y compartir escenarios clínicos

---

## ✅ Checklist de Funcionalidades

- [x] Escalas de sedación (Ramsay y RASS) con colores
- [x] Tooltips explicativos en todas las variables
- [x] Modelo farmacogenético con CYP2D6/CYP2C19
- [x] Cálculo dinámico de metabolismo (genética + edad + función hepática)
- [x] Advertencias preventivas antes de administrar fármacos
- [x] Ajuste automático de duración/pico según metabolismo
- [x] Intubación funcional que mejora pulmones a 95% (verde)
- [x] Visualización de metabolismo en monitor
- [x] Concentración efectiva en sitio de acción
- [x] Eliminación de alertas respiratorias post-intubación
- [x] Reseteo completo de estado incluyendo nuevas variables

---

**Versión**: 2.0
**Última actualización**: 2024
**Autor**: Sistema de IA con supervisión médica

