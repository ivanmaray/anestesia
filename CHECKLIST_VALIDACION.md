# ✅ Checklist de Validación Visual - Gemelo Digital v2.0

## 📋 Instrucciones de Prueba

Este documento contiene un checklist sistemático para validar todas las mejoras implementadas. Sigue cada paso para verificar que todo funciona correctamente.

---

## 1️⃣ Validación de Escalas de Sedación

### Ubicación
Panel central del monitor, debajo de vitales secundarios (FR, EtCO₂, Temp)

### Elementos a Verificar

#### Escala de Ramsay
- [ ] Se ve el título "RAMSAY" en color azul
- [ ] El número (1-6) está en fuente grande y monoespacio
- [ ] El color cambia según el valor:
  - [ ] 1-2 → Texto amarillo
  - [ ] 3-4 → Texto verde
  - [ ] 5-6 → Texto rojo con animación pulse
- [ ] Debajo hay texto pequeño con descripción corta
- [ ] Al pasar el ratón aparece tooltip con escala completa

#### Escala RASS
- [ ] Se ve el título "RASS" en color índigo
- [ ] El número (-5 a +4) con signo "+" si es positivo
- [ ] El color cambia según el valor:
  - [ ] 0 a -1 → Texto amarillo
  - [ ] -2 a -3 → Texto verde
  - [ ] -4 a -5 → Texto rojo con animación pulse
- [ ] Descripción corta debajo (primeras 2 palabras)
- [ ] Tooltip con escala completa al hover

### Pasos de Prueba
```
1. Ir a http://localhost:5174/
2. Navegar a sección "Gemelo Digital"
3. Estado inicial: Ramsay debe ser 1, RASS debe ser 0
4. Panel derecho → Seleccionar "Propofol", 2 mg/kg
5. Presionar "▶ SIMULAR"
6. Observar que Ramsay y RASS aumentan progresivamente
7. Pasar el ratón sobre cada escala → Ver tooltip
```

**Estado esperado durante simulación**:
- t=0s: Ramsay 1, RASS 0 (amarillo)
- t=60s: Ramsay 3-4, RASS -2 a -3 (verde)
- t=120s: Ramsay 5-6, RASS -4 a -5 (rojo con pulse)

---

## 2️⃣ Validación de Indicador de Metabolismo

### Ubicación
Debajo de las escalas de sedación, línea separada con borde superior

### Elementos a Verificar
- [ ] Línea con texto "Metabolismo: X% (Descripción)"
- [ ] Color del porcentaje según valor:
  - [ ] <50% → Rojo
  - [ ] 50-150% → Verde
  - [ ] >150% → Amarillo
- [ ] Descripción textual: "Lento" / "Normal" / "Rápido"
- [ ] Si concentración efectiva >0, muestra segunda línea
- [ ] "Concentración efectiva: X.XX μg/mL" en azul y fuente mono

### Pasos de Prueba
```
CASO A: Metabolizador Normal (EM)
1. Panel izquierdo → Farmacogenética → CYP2D6: EM
2. No debe aparecer indicador (metabolismo = 100%)
3. Al simular, verificar que la concentración se muestra

CASO B: Metabolizador Pobre (PM)
1. CYP2D6: PM
2. Debe aparecer "Metabolismo: 20% (Lento)" en ROJO
3. Al simular, efectos prolongados visibles

CASO C: Metabolizador Rápido (UM)
1. CYP2D6: UM
2. Debe aparecer "Metabolismo: 250% (Rápido)" en AMARILLO
3. Al simular, efectos más cortos
```

---

## 3️⃣ Validación de Advertencias Farmacogenéticas

### Ubicación
Panel derecho, entre selectores de fármaco y botón "SIMULAR"

### Elementos a Verificar

#### Para PM (Poor Metabolizer)
- [ ] Caja con fondo rojo semitransparente
- [ ] Borde rojo
- [ ] Título: "⚠ Advertencia Farmacogenética"
- [ ] Texto: "Metabolizador LENTO detectado"
- [ ] Lista con bullets:
  - [ ] "Efecto prolongado (~3-5x)"
  - [ ] "Aclaramiento reducido"
  - [ ] "Considere reducir dosis 30-50%"

#### Para UM (Ultra-rapid Metabolizer)
- [ ] Caja con fondo amarillo semitransparente
- [ ] Borde amarillo
- [ ] Título: "⚠ Advertencia Farmacogenética"
- [ ] Texto: "Metabolizador RÁPIDO detectado"
- [ ] Lista con bullets:
  - [ ] "Efecto reducido (~40-60%)"
  - [ ] "Duración más corta"
  - [ ] "Puede necesitar dosis mayores"

### Pasos de Prueba
```
1. Panel izquierdo → CYP2D6: PM
2. Panel derecho → Fármaco: Propofol (afectado por CYP2D6)
3. Verificar que aparece caja ROJA con advertencia
4. Cambiar a Midazolam → Advertencia debe permanecer
5. Cambiar a fármaco NO afectado → Advertencia desaparece
6. Cambiar CYP2D6 a UM
7. Volver a Propofol → Advertencia AMARILLA aparece
8. Cambiar a EM → Advertencia desaparece
```

**Fármacos afectados**: Propofol, Midazolam, Fentanyl
**Fármacos NO afectados**: Rocuronio, Succinilcolina, Remifentanil (parcial)

---

## 4️⃣ Validación de Tooltips Educativos

### Ubicación
Panel derecho, sección "Parámetros Farmacocinéticos"

### Elementos a Verificar

Cada fila debe tener:
- [ ] Label a la izquierda (color slate-400)
- [ ] Valor a la derecha
- [ ] Al pasar el ratón, aparece tooltip oscuro
- [ ] Tooltip tiene borde, sombra, y fondo negro
- [ ] Texto del tooltip es legible (10px)

#### Tooltip "Inicio (Onset)"
- [ ] Aparece tooltip con:
  > **Tiempo de inicio:** Tiempo desde la administración hasta que aparecen los primeros efectos clínicos.

#### Tooltip "Pico (Peak)"
- [ ] Aparece tooltip con:
  > **Tiempo al pico:** Tiempo hasta alcanzar la concentración plasmática máxima y el efecto más intenso.

#### Tooltip "Duración"
- [ ] Aparece tooltip con:
  > **Duración del efecto:** Tiempo durante el cual el fármaco mantiene efectos clínicos significativos antes de requerir nueva dosis.

#### Tooltip "Metabolismo"
- [ ] Aparece tooltip con:
  > **Vía de metabolismo:** Principal órgano responsable de biotransformar el fármaco. Hepático: CYP450 (afectado por genética). Renal: filtración glomerular. Plasmático: esterasas.

### Pasos de Prueba
```
1. Panel derecho → Sección de información del fármaco
2. Pasar el ratón sobre "Inicio:" → Ver tooltip
3. Mover a "Pico:" → Tooltip cambia
4. Mover a "Duración:" → Tooltip cambia
5. Mover a "Metabolismo:" → Tooltip cambia
6. Verificar que tooltips no se cortan por los bordes
7. Cambiar fármaco → Valores actualizados, tooltips funcionan
```

---

## 5️⃣ Validación de Intubación Funcional

### Estado Inicial (Antes de Intubar)
- [ ] Pulmones en anatomía SVG: Color rojo (<50%)
- [ ] SpO₂: <92% (ej. 85-90%)
- [ ] Puede haber alertas de hipoxia en panel de advertencias

### Acción: Presionar "🔌 Intubar"

### Cambios Esperados Inmediatos
- [ ] **Pulmones**: Color cambia de rojo → VERDE (95%)
- [ ] **SpO₂**: Sube a 98-100%
- [ ] **FR**: Se fija en 12 rpm
- [ ] **Estado**: Badge cambia a "INTUBATED" (azul)
- [ ] **Cerebro**: +10% función (color puede mejorar)
- [ ] **Alertas**: Se eliminan mensajes de "hipoxia", "apnea", "respiratoria"
- [ ] **Mensaje nuevo**: "✅ Paciente intubado y ventilado correctamente"

### Pasos de Prueba Completos
```
ESCENARIO: Paciente en apnea/hipoxia

1. Estado inicial: Observar anatomía y vitales
2. Panel derecho → Propofol 3 mg/kg (dosis alta)
3. Presionar "▶ SIMULAR"
4. Esperar ~60-90s hasta que:
   - SpO₂ baje <92%
   - Pulmones se pongan rojos
   - Aparezcan alertas de hipoxia
5. Panel derecho → Acciones Rápidas → "🔌 Intubar"
6. VERIFICAR cambios inmediatos (arriba ↑)
7. Observar que vitales se mantienen estables
8. Pulmones deben permanecer verdes permanentemente
```

### Validación Visual en Anatomía SVG
```
ANTES:
  Pulmones SVG: fill="rgb(239, 68, 68)" (rojo)
  
DESPUÉS:
  Pulmones SVG: fill="rgb(34, 197, 94)" (verde)
```

---

## 6️⃣ Validación de Ajustes Farmacocinéticos

### Escenario A: Metabolizador Pobre (PM)

#### Setup
```
1. Panel izquierdo:
   - CYP2D6: PM
   - Edad: 35 años
   - AST/ALT: normales

2. Panel derecho:
   - Fármaco: Propofol
   - Dosis: 2 mg/kg
```

#### Resultados Esperados
- [ ] Advertencia roja antes de simular
- [ ] Metabolismo: 20% (Lento) mostrado en monitor
- [ ] Durante simulación:
  - [ ] Ramsay sube a 5-6 (rojo)
  - [ ] RASS baja a -4 a -5
  - [ ] Efecto dura ~40-50 minutos (vs 10 min normal)
  - [ ] SpO₂, FC pueden bajar más de lo normal
- [ ] Gráfico temporal muestra efecto muy prolongado

### Escenario B: Metabolizador Ultra-rápido (UM)

#### Setup
```
1. Panel izquierdo:
   - CYP2D6: UM
   - Edad: 25 años

2. Panel derecho:
   - Fármaco: Midazolam
   - Dosis: 0.1 mg/kg
```

#### Resultados Esperados
- [ ] Advertencia amarilla antes de simular
- [ ] Metabolismo: 250% (Rápido) mostrado
- [ ] Durante simulación:
  - [ ] Ramsay sube solo a 2-3 (efecto reducido)
  - [ ] RASS baja solo a -1 a -2
  - [ ] Efecto dura ~4-5 minutos (muy corto)
  - [ ] Vitales pueden no cambiar mucho
- [ ] Gráfico muestra pico bajo y duración corta

### Escenario C: Paciente Complejo (Múltiples Factores)

#### Setup
```
1. Panel izquierdo:
   - Edad: 78 años
   - CYP2D6: PM
   - AST: 150, ALT: 140
   - Creatinina: 2.5

2. Panel derecho:
   - Fentanyl 2 mcg/kg
```

#### Cálculo Esperado
```
Base: 1.0
× CYP2D6 PM: 0.2
× Edad >75: 0.7
× Hepatopatía: 0.8
× Insuf. renal: 0.85

= 1.0 × 0.2 × 0.7 × 0.8 × 0.85
= 0.095 (9.5%)
```

#### Resultados Esperados
- [ ] Metabolismo: ~10% (Lento extremo) 🔴
- [ ] Advertencia roja con todos los factores
- [ ] Efecto MUY prolongado (>1 hora)
- [ ] Sedación profunda y sostenida
- [ ] Múltiples alertas por efectos acumulados

---

## 7️⃣ Validación del Botón Reset

### Acción: Presionar "🔄 Reset"

### Estado Esperado Después del Reset
- [ ] Todos los vitales vuelven a valores basales:
  - [ ] PA: 120/80
  - [ ] FC: 75
  - [ ] SpO₂: 98
  - [ ] FR: 16
  - [ ] EtCO₂: 38
  - [ ] Temp: 36.5
- [ ] Ramsay: 1
- [ ] RASS: 0
- [ ] Descripción: "Despierto y tranquilo"
- [ ] Órganos:
  - [ ] Cerebro: 90%
  - [ ] Corazón: 85%
  - [ ] Pulmones: 95%
  - [ ] Riñones: 90%
- [ ] Todos los colores de órganos: VERDE
- [ ] Estado: "awake", "stable", "spontaneous"
- [ ] Alertas: VACÍAS
- [ ] Timeline: VACÍO
- [ ] Intubated: false
- [ ] Sedation scores reseteados
- [ ] Pharmacokinetics reseteados

### Pasos de Prueba
```
1. Ejecutar una simulación completa (cualquier fármaco)
2. Esperar que haya cambios en vitales, órganos, alertas
3. Presionar "🔄 Reset"
4. Verificar TODOS los items del checklist arriba
5. Intentar nueva simulación → Debe funcionar normalmente
```

---

## 8️⃣ Validación de Responsive Design

### Desktop (>1024px)
- [ ] Grid de 3 columnas visible
- [ ] Panel izquierdo: Datos paciente + Labs + PGx
- [ ] Panel central: Monitor completo + Anatomía + Gráfico
- [ ] Panel derecho: Administración + Alertas + Acciones
- [ ] Todos los tooltips visibles sin cortes
- [ ] Escalas de sedación lado a lado

### Tablet (768-1023px)
- [ ] Grid se ajusta (puede ser 4-8-4 o apilado)
- [ ] Contenido legible sin scroll horizontal
- [ ] Tooltips siguen funcionando

### Mobile (<767px)
- [ ] Vista de 1 columna
- [ ] Paneles apilados verticalmente
- [ ] Monitor simplificado pero funcional
- [ ] Tooltips en taps en lugar de hover
- [ ] Botones accesibles con pulgar

---

## 9️⃣ Validación de Animaciones

### Elementos con `animate-pulse`
- [ ] Valores críticos de vitales:
  - [ ] PA sistólica <90 mmHg
  - [ ] FC <50 o >120 lpm
  - [ ] SpO₂ <92%
  - [ ] FR <8 rpm
- [ ] Ramsay 5-6 (sedación profunda)
- [ ] RASS -4 a -5
- [ ] Metabolismo <50% (rojo)

### Transiciones suaves
- [ ] Cambios de color en órganos (0.3s)
- [ ] Aparición de tooltips (fade in)
- [ ] Botones con hover:scale-105

### Pasos de Prueba
```
1. Inducir valores críticos (ej. Propofol alta dosis)
2. Observar que elementos críticos pulsan
3. Pasar ratón sobre botones → Escalan ligeramente
4. Tooltips aparecen/desaparecen suavemente
```

---

## 🔟 Validación de Consistencia de Datos

### Durante Simulación Activa

#### Timeline (Gráfico Temporal)
- [ ] Se añaden puntos cada ~1 segundo
- [ ] Líneas de SpO₂, FC, PA visibles
- [ ] Eje X: tiempo en segundos
- [ ] Eje Y: valores reales de vitales

#### Sincronización
- [ ] Valor en monitor = valor en gráfico
- [ ] Color de órgano = % mostrado en hover
- [ ] Ramsay/RASS coherentes con efecto del fármaco
- [ ] Metabolismo mostrado = metabolismo calculado

### Coherencia Clínica

#### Relaciones Esperadas
- [ ] Propofol → Baja PA, baja FC, sube sedación
- [ ] Fentanyl → Baja FR, sube sedación
- [ ] Rocuronio → NO cambia sedación (relajante)
- [ ] Crystalloids → Sube PA, no cambia sedación
- [ ] Phenylephrine → Sube PA, baja FC (reflejo)

### Pasos de Prueba
```
1. Administrar Propofol 2 mg/kg
2. Verificar que:
   ✓ PA baja ~20-30 mmHg
   ✓ FC baja ~10-20 lpm
   ✓ Sedación sube (Ramsay 4-6)
   ✓ Todos los cambios son coherentes

3. Administrar Crystalloids 500ml
4. Verificar que:
   ✓ PA sube ~10-15 mmHg
   ✓ Sedación NO cambia
   ✓ Riñones pueden mejorar (perfusión)
```

---

## 📊 Tabla de Validación Final

### Checklist Completo

| # | Funcionalidad | Estado | Notas |
|---|--------------|--------|-------|
| 1 | Escala Ramsay visible | ☐ | Color, número, descripción |
| 2 | Escala RASS visible | ☐ | Signo, color, descripción |
| 3 | Tooltips de escalas | ☐ | Escala completa al hover |
| 4 | Indicador metabolismo | ☐ | Porcentaje, color, descripción |
| 5 | Concentración efectiva | ☐ | Valor en μg/mL |
| 6 | Advertencia PM (roja) | ☐ | Con bullets y recomendación |
| 7 | Advertencia UM (amarilla) | ☐ | Con bullets y advertencia |
| 8 | Tooltips farmacocinéticos | ☐ | 4 tooltips: onset, peak, duration, metabolism |
| 9 | Intubación mejora pulmones | ☐ | 45% rojo → 95% verde |
| 10 | Intubación mejora SpO₂ | ☐ | <92% → 98-100% |
| 11 | Intubación elimina alertas | ☐ | Filtrar hipoxia/apnea |
| 12 | Ajuste duración PM | ☐ | ~3-5x más largo |
| 13 | Ajuste efecto UM | ☐ | ~40-60% reducido |
| 14 | Múltiples factores | ☐ | Edad + PGx + hepático |
| 15 | Reset completo | ☐ | Vuelve a estado basal |
| 16 | Animaciones pulse | ☐ | En valores críticos |
| 17 | Responsive desktop | ☐ | Grid 3 columnas |
| 18 | Responsive mobile | ☐ | Vista apilada |
| 19 | Sin errores consola | ☐ | F12 → Console limpia |
| 20 | Coherencia clínica | ☐ | Efectos realistas |

### Criterio de Aprobación
✅ **20/20 checks** → Sistema completamente funcional
⚠️ **18-19/20 checks** → Funcional con mejoras menores
❌ **<18/20 checks** → Requiere revisión

---

## 🐛 Problemas Comunes y Soluciones

### Problema: Tooltips no aparecen
**Solución**: Verificar que CSS tiene clase `group` en padre y `group-hover:block` en tooltip

### Problema: Pulmones no se ponen verdes al intubar
**Solución**: Verificar que `organFunction.lungs` se actualiza a 95

### Problema: Advertencias PGx no aparecen
**Solución**: Verificar que fármaco está en `affectedDrugs` y genotipo es PM o UM

### Problema: Metabolismo siempre 100%
**Solución**: Verificar que `getMetabolismRate()` se llama y factores se aplican

### Problema: Escalas no cambian durante simulación
**Solución**: Verificar que `calculateSedationScores()` se llama con `effectMagnitude` correcto

---

## 📸 Screenshots Sugeridos

### Captura 1: Estado Basal
- Monitor con vitales normales
- Ramsay 1, RASS 0 (amarillo)
- Anatomía toda verde

### Captura 2: Advertencia PM
- Panel derecho con caja roja
- CYP2D6 PM seleccionado
- Propofol seleccionado

### Captura 3: Durante Simulación PM
- Ramsay 6 (rojo, pulsando)
- RASS -5 (rojo)
- Metabolismo: 20% (Lento) rojo
- Pulmones amarillos/rojos
- Múltiples alertas

### Captura 4: Post-Intubación
- Pulmones verdes brillantes (95%)
- SpO₂ 98-100%
- Mensaje "✅ Intubado"
- Alertas respiratorias eliminadas

### Captura 5: Tooltips
- Tooltip de Ramsay visible con escala completa
- Tooltip de "Metabolismo" visible con explicación

---

## ✅ Validación Final

Fecha: ___________
Validador: ___________

**Firma de Aprobación**: 
Este checklist confirma que todas las funcionalidades del Gemelo Digital v2.0 han sido probadas y funcionan correctamente.

---

**Versión del Checklist**: 1.0
**Corresponde a**: Gemelo Digital v2.0

