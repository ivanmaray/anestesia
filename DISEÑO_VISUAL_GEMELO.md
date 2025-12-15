# 🎨 Diseño Visual del Gemelo Digital Mejorado

```
╔════════════════════════════════════════════════════════════════════════════════════════╗
║                         🧬 GEMELO DIGITAL ANESTÉSICO v2.0                              ║
║                     Simulación Farmacológica Avanzada en Tiempo Real                   ║
╚════════════════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────┬────────────────────────────────────────────┬──────────────────────┐
│   PANEL IZQUIERDO   │           PANEL CENTRAL (MONITOR UCI)      │   PANEL DERECHO      │
│   Datos Paciente    │                                            │   Controles          │
├─────────────────────┼────────────────────────────────────────────┼──────────────────────┤
│                     │  ╔════════════════════════════════════════╗│                      │
│ 👤 PACIENTE         │  ║  SIGNOS VITALES PRINCIPALES            ║│  💉 ADMINISTRACIÓN   │
│                     │  ╠════════════════════════════════════════╣│                      │
│ Edad: [68]          │  ║     PRESIÓN ARTERIAL                   ║│  Fármaco:            │
│ Peso: [75] kg       │  ║         120                            ║│  [Propofol     ▼]    │
│ Altura: [170] cm    │  ║         ───                            ║│                      │
│ IMC: 25.9           │  ║          80                            ║│  Dosis: [2.0]        │
│ ASA: [II ▼]         │  ║        mmHg                            ║│  Unidad: [mg/kg ▼]   │
│                     │  ║                                        ║│                      │
├─────────────────────┤  ║  FRECUENCIA    SATURACIÓN              ║│  Vía: [IV ▼]         │
│                     │  ║   CARDÍACA         O₂                  ║│                      │
│ 🧪 ANALÍTICAS       │  ║      75           98%                  ║│  ┌────────────────┐ │
│                     │  ║     lpm            %                   ║│  │ ⚠️ ADVERTENCIA  │ │
│ Creatinina: [1.2]   │  ║                                        ║│  │ Farmacogenética│ │
│ Urea: [45]          │  ╚════════════════════════════════════════╝│  │                │ │
│ Hb: [14.0]          │                                            │  │ Metabolizador  │ │
│ AST: [35]           │  ╔════════════════════════════════════════╗│  │ LENTO detectado│ │
│ ALT: [38]           │  ║  SIGNOS VITALES SECUNDARIOS            ║│  │                │ │
│                     │  ╠════════════════════════════════════════╣│  │ • Efecto       │ │
├─────────────────────┤  ║                                        ║│  │   prolongado   │ │
│                     │  ║   FR          EtCO₂        TEMP        ║│  │   (~3-5x)      │ │
│ 🧬 FARMACOGENÉTICA  │  ║   12           38         36.5°C       ║│  │ • Aclaramiento │ │
│                     │  ║  rpm          mmHg                     ║│  │   reducido     │ │
│ CYP2D6:             │  ║                                        ║│  │ • Considere    │ │
│   [PM       ▼]  ⚠️  │  ╚════════════════════════════════════════╝│  │   reducir dosis│ │
│ (Metabolizador      │                                            │  │   30-50%       │ │
│  Pobre)             │  ╔════════════════════════════════════════╗│  └────────────────┘ │
│                     │  ║  ESCALAS DE SEDACIÓN                   ║│                      │
│ CYP2C19:            │  ╠════════════════════════════════════════╣│  [▶ SIMULAR]         │
│   [EM       ▼]      │  ║                                        ║│                      │
│                     │  ║      RAMSAY            RASS            ║│  ┌────────────────┐ │
│ RYR1:               │  ║         5               -4             ║│  │ Parámetros     │ │
│   [NN       ▼]      │  ║   Dormido, lento   Sedación profunda  ║│  │ Farmacocinéticos│
│                     │  ║                                        ║│  │                │ │
│                     │  ║   [Hover para ver escala completa] ⓘ  ║│  │ Inicio: 30s ⓘ  │ │
│                     │  ╚════════════════════════════════════════╝│  │ Pico: 2min ⓘ   │ │
│                     │                                            │  │ Duración: 10min│ │
│                     │  ╔════════════════════════════════════════╗│  │ Metabolismo:   │ │
│                     │  ║  METABOLISMO                           ║│  │ hepático ⓘ     │ │
│                     │  ╠════════════════════════════════════════╣│  └────────────────┘ │
│                     │  ║                                        ║├──────────────────────┤
│                     │  ║  Metabolismo: 20% (Lento) 🔴          ║│                      │
│                     │  ║  Concentración efectiva: 2.35 μg/mL   ║│  ⚠️ ALERTAS          │
│                     │  ║                                        ║│                      │
│                     │  ╚════════════════════════════════════════╝│  ┌────────────────┐ │
│                     │                                            │  │ 🔴 CRÍTICO      │ │
│                     │  ╔════════════════════════════════════════╗│  │ Bradicardia    │ │
│                     │  ║  ESTADO CLÍNICO                        ║│  │ FC < 50 lpm    │ │
│                     │  ╠════════════════════════════════════════╣│  └────────────────┘ │
│                     │  ║                                        ║│                      │
│                     │  ║  [SEDATED] [HYPOTENSIVE] [INTUBATED]  ║│  ┌────────────────┐ │
│                     │  ║                                        ║│  │ 🟡 MEDIO        │ │
│                     │  ╚════════════════════════════════════════╝│  │ Metabolizador  │ │
│                     │                                            │  │ lento - ajustar│ │
│                     │  ╔════════════════════════════════════════╗│  │ dosis          │ │
│                     │  ║  ANATOMÍA HUMANA (SVG)                 ║│  └────────────────┘ │
│                     │  ╠════════════════════════════════════════╣│                      │
│                     │  ║            ╭───╮                       ║│  ┌────────────────┐ │
│                     │  ║            │ 🧠│ 75% 🟡                ║│  │ ℹ️ INFO         │ │
│                     │  ║            ╰───╯                       ║│  │ Paciente       │ │
│                     │  ║             / \                        ║│  │ intubado y     │ │
│                     │  ║           /🫁 🫁\ 95% 🟢              ║│  │ ventilado ✅    │ │
│                     │  ║           \     /                      ║│  └────────────────┘ │
│                     │  ║             |                          ║│                      │
│                     │  ║            ❤️ 80% 🟢                  ║├──────────────────────┤
│                     │  ║             |                          ║│                      │
│                     │  ║            / \                         ║│  🚨 ACCIONES RÁPIDAS │
│                     │  ║         [🝏] [🝏] 90% 🟢               ║│                      │
│                     │  ║       (Riñones)                        ║│  [💧 500ml Cristal]  │
│                     │  ║                                        ║│  [💉 Phenylephrine]  │
│                     │  ╚════════════════════════════════════════╝│  [🔌 Intubar]        │
│                     │                                            │  [🔄 Reset]          │
│                     │  ╔════════════════════════════════════════╗│                      │
│                     │  ║  GRÁFICO DE EVOLUCIÓN TEMPORAL         ║│                      │
│                     │  ╠════════════════════════════════════════╣│                      │
│                     │  ║                                        ║│                      │
│                     │  ║  SpO₂ ┼─────────────╱╲                ║│                      │
│                     │  ║   98% ┤            ╱  ╲                ║│                      │
│                     │  ║   95% ┤           ╱    ╲───            ║│                      │
│                     │  ║   92% ┤  ────────╱                     ║│                      │
│                     │  ║   90% ┤                                ║│                      │
│                     │  ║       └────────────────────────────    ║│                      │
│                     │  ║       0s  60s  120s  180s  240s        ║│                      │
│                     │  ║                                        ║│                      │
│                     │  ║  FC  ┼──────╲                          ║│                      │
│                     │  ║  80  ┤       ╲                         ║│                      │
│                     │  ║  70  ┤        ╲─────                   ║│                      │
│                     │  ║  60  ┤             ╲                   ║│                      │
│                     │  ║  50  ┤              ╲────              ║│                      │
│                     │  ║      └────────────────────────────     ║│                      │
│                     │  ║      0s  60s  120s  180s  240s         ║│                      │
│                     │  ║                                        ║│                      │
│                     │  ╚════════════════════════════════════════╝│                      │
└─────────────────────┴────────────────────────────────────────────┴──────────────────────┘
```

## 🎨 Código de Colores

### Órganos (Anatomía SVG)
```
🟢 Verde (90-100%)   → Función normal/óptima
🟡 Amarillo (70-89%) → Función comprometida
🟠 Naranja (50-69%)  → Disfunción moderada
🔴 Rojo (<50%)       → Fallo orgánico crítico
```

### Escalas de Sedación
```
RAMSAY:
🟡 1-2 → Despierto
🟢 3-4 → Sedación adecuada
🔴 5-6 → Sedación profunda/crítica

RASS:
🟡 0 a -1 → Alerta/Somnoliento
🟢 -2 a -3 → Sedación ligera/moderada
🔴 -4 a -5 → Sedación profunda/no despierta
```

### Metabolismo
```
🔴 <50%   → Metabolizador muy lento (PM)
🟡 50-80% → Metabolizador lento (IM)
🟢 80-120% → Metabolismo normal (EM)
🟡 120-200% → Metabolizador rápido
🔴 >200%  → Metabolizador ultra-rápido (UM)
```

### Alertas
```
🔴 CRÍTICO  → Riesgo vital inmediato
🟠 ALTO     → Requiere acción urgente
🟡 MEDIO    → Monitoreo cercano necesario
🔵 INFO     → Información clínica relevante
```

---

## 📱 Elementos Interactivos

### Tooltips (Hover)
- **Escalas de Sedación**: Muestra escala completa con descripciones
- **Parámetros Farmacocinéticos**: Explica onset, peak, duración, metabolismo
- **Órganos (SVG)**: Muestra porcentaje exacto de función
- **Genotipos**: Explica significado clínico (PM, IM, EM, UM)

### Animaciones
- **Pulso en alertas críticas**: `animate-pulse` en valores peligrosos
- **Degradados suaves**: Transiciones de color en órganos
- **Gráfico en tiempo real**: Actualización cada 1 segundo

### Estados Visuales
```
▶ SIMULAR    → Verde/Azul gradient, hover scale 1.05
⏹ DETENER    → Rojo, hover más oscuro
🔄 Reset     → Gris, restaura todo a valores base
🔌 Intubar   → Azul, efecto inmediato en anatomía
```

---

## 🖥️ Responsive Design

### Desktop (>1024px)
- Grid de 3 columnas: 3-6-3
- Paneles expandidos con toda la información
- Gráficos de mayor altura (h-48)

### Tablet (768-1023px)
- Grid adaptativo: 4-8-4 o 12-12-12
- Paneles apilables
- Fuentes ligeramente reducidas

### Mobile (<767px)
- Vista de una columna
- Paneles colapsables
- Monitor simplificado con vitales esenciales
- Tooltips en taps en lugar de hover

---

## 🎯 Mejoras de UX Implementadas

1. **Feedback Inmediato**: Cada acción muestra resultado visual instantáneo
2. **Prevención de Errores**: Advertencias antes de acciones riesgosas
3. **Código de Colores Consistente**: Mismo sistema en toda la interfaz
4. **Jerarquía Visual Clara**: Información crítica destacada
5. **Tooltips Educativos**: Aprender mientras se usa
6. **Estados Visuales Claros**: Siempre se sabe qué está pasando

---

## 🔍 Áreas de Atención Visual

### 🔴 Área Crítica (Top Priority)
- Signos vitales principales (PA, FC, SpO₂)
- Alertas rojas/naranjas
- Ramsay 5-6, RASS -4 a -5

### 🟡 Área Importante (Monitor)
- Vitales secundarios (FR, EtCO₂, Temp)
- Estado clínico (badges)
- Anatomía (colores de órganos)

### 🔵 Área Informativa (Contexto)
- Datos del paciente
- Parámetros farmacocinéticos
- Gráficos temporales
- Genotipos

---

**Principio de Diseño**: *"Ver es Entender, Interactuar es Aprender"*

La interfaz está diseñada para que cualquier profesional de salud, desde estudiantes hasta expertos, pueda:
1. **Comprender** el estado del paciente en <3 segundos
2. **Identificar** problemas críticos inmediatamente
3. **Aprender** conceptos mientras interactúa
4. **Tomar decisiones** informadas con advertencias preventivas

