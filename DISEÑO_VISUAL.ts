/**
 * LAYOUT VISUAL DEL GEMELO DIGITAL ANESTÉSICO
 * 
 * Este archivo describe visualmente la estructura del diseño implementado
 */

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                     🏥 GEMELO DIGITAL ANESTÉSICO 🏥                          ║
║              Simulación farmacológica avanzada en tiempo real                ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────┐
│                              LAYOUT PRINCIPAL                                │
└──────────────────────────────────────────────────────────────────────────────┘

╔═══════════════╦═══════════════════════════════╦═══════════════════╗
║               ║                               ║                   ║
║   PACIENTE    ║         MONITOR UCI           ║   ADMINISTRACIÓN  ║
║   (3 cols)    ║         (6 cols)              ║     (3 cols)      ║
║               ║                               ║                   ║
║ ┌───────────┐ ║  ┌─────────────────────────┐  ║  ┌─────────────┐ ║
║ │👤 Datos   │ ║  │  🩺 CONSTANTES VITALES  │  ║  │💉 Fármaco   │ ║
║ │           │ ║  │                         │  ║  │             │ ║
║ │ Edad: 45  │ ║  │    120    75    99      │  ║  │ Propofol    │ ║
║ │ Peso: 70  │ ║  │   ─────  ─────  ─────   │  ║  │ 2 mg/kg     │ ║
║ │ Altura:170│ ║  │    /80    lpm    %      │  ║  │             │ ║
║ │ IMC: 24.2 │ ║  │   PAS     FC    SpO2    │  ║  │ [▶ SIMULAR] │ ║
║ │ ASA: II   │ ║  │                         │  ║  │             │ ║
║ └───────────┘ ║  └─────────────────────────┘  ║  └─────────────┘ ║
║               ║                               ║                   ║
║ ┌───────────┐ ║  ┌─────────────────────────┐  ║  ┌─────────────┐ ║
║ │🧪 Labs    │ ║  │    14    38    36.5     │  ║  │⚠️ Alertas   │ ║
║ │           │ ║  │   ─────  ─────  ─────   │  ║  │             │ ║
║ │ Hb: 13.5  │ ║  │    rpm   mmHg    °C     │  ║  │ ✅ Sin      │ ║
║ │ Cr: 0.9   │ ║  │    FR    EtCO2   TEMP   │  ║  │   alertas   │ ║
║ │ K+: 4.1   │ ║  │                         │  ║  │             │ ║
║ │ Glu: 105  │ ║  │ [AWAKE] [STABLE]        │  ║  │             │ ║
║ └───────────┘ ║  │        [SPONTANEOUS]     │  ║  └─────────────┘ ║
║               ║  └─────────────────────────┘  ║                   ║
║ ┌───────────┐ ║                               ║  ┌─────────────┐ ║
║ │🧬 PGx     │ ║  ┌─────────────────────────┐  ║  │🚑 Rescate   │ ║
║ │           │ ║  │   ESTADO DE ÓRGANOS     │  ║  │             │ ║
║ │CYP2D6: EM │ ║  │                         │  ║  │ 💧 Cristal. │ ║
║ │CYP2C19:EM │ ║  │        🧠 100%          │  ║  │ 💉 Fenilef. │ ║
║ │RYR1: NN   │ ║  │                         │  ║  │ 🫁 Intubar  │ ║
║ └───────────┘ ║  │   🫁     ❤️     🫁      │  ║  │ 🔄 Reinicio │ ║
║               ║  │  100%   100%   100%     │  ║  │             │ ║
║               ║  │                         │  ║  └─────────────┘ ║
║               ║  │      🏥        💧💧      │  ║                   ║
║               ║  │     100%      100%      │  ║                   ║
║               ║  └─────────────────────────┘  ║                   ║
║               ║                               ║                   ║
║               ║  ┌─────────────────────────┐  ║                   ║
║               ║  │  📈 EVOLUCIÓN TEMPORAL  │  ║                   ║
║               ║  │                         │  ║                   ║
║               ║  │    ╱╲                   │  ║                   ║
║               ║  │   ╱  ╲    PAS (rojo)    │  ║                   ║
║               ║  │  ╱    ╲╱                │  ║                   ║
║               ║  │ ─────────────────────   │  ║                   ║
║               ║  │     FC (azul)           │  ║                   ║
║               ║  │     SpO2 (verde)        │  ║                   ║
║               ║  │                         │  ║                   ║
║               ║  │ 0min  5min  10min       │  ║                   ║
║               ║  └─────────────────────────┘  ║                   ║
╚═══════════════╩═══════════════════════════════╩═══════════════════╝


┌──────────────────────────────────────────────────────────────────────────────┐
│                            PALETA DE COLORES                                 │
└──────────────────────────────────────────────────────────────────────────────┘

🎨 TEMA OSCURO:
  - Fondo principal:    slate-950 → slate-900 (gradiente)
  - Cards:              slate-800 → slate-900 (gradiente)
  - Bordes:             slate-700
  - Texto principal:    white
  - Texto secundario:   slate-400
  - Monitor:            black (fondo)

💉 CONSTANTES VITALES:
  - Presión Arterial:   red-400 / red-500 (crítico)
  - Frecuencia Cardíaca: green-400 / yellow-500 (anormal)
  - SpO2:               cyan-400 / red-500 (bajo)
  - Frecuencia Resp.:   purple-400 / red-500 (bajo)
  - EtCO2:              yellow-400
  - Temperatura:        orange-400

🏥 ÓRGANOS (según función):
  - ≥90%:  green-400   🟢
  - 70-89%: yellow-400  🟡
  - 50-69%: orange-400  🟠
  - <50%:   red-400    🔴

💊 FÁRMACOS (degradado distintivo):
  - Propofol:       purple-500 → pink-500
  - Fentanyl:       blue-500 → cyan-500
  - Remifentanil:   cyan-500 → teal-500
  - Midazolam:      indigo-500 → purple-500
  - Rocuronio:      red-500 → orange-500
  - Succinilcolina: orange-500 → red-500

⚠️ ALERTAS (por severidad):
  - Críticas:       red-900/30 + border-red-500
  - Altas:          orange-900/30 + border-orange-500
  - Medias:         yellow-900/30 + border-yellow-500
  - Bajas:          blue-900/30 + border-blue-500


┌──────────────────────────────────────────────────────────────────────────────┐
│                      ANIMACIONES Y TRANSICIONES                              │
└──────────────────────────────────────────────────────────────────────────────┘

🎬 EFECTOS VISUALES:
  - Valores críticos:     animate-pulse (parpadeo)
  - Corazón:             animate-pulse (latido)
  - Cambios de color:     transition-all duration-500
  - Botones hover:        scale-105 + shadow
  - Estados badge:        rounded-full + px-3 py-1


┌──────────────────────────────────────────────────────────────────────────────┐
│                         TIPOGRAFÍA Y TAMAÑOS                                 │
└──────────────────────────────────────────────────────────────────────────────┘

📝 JERARQUÍA:
  - Título principal:  text-4xl font-bold (gradient)
  - Subtítulo:         text-sm text-slate-400
  - Encabezados card:  text-lg font-semibold
  - Valores monitor:   text-5xl font-mono font-bold
  - Valores secundar:  text-2xl font-mono
  - Etiquetas:         text-xs
  - Texto normal:      text-sm

🔢 FUENTES:
  - Valores numéricos: font-mono (monoespaciada)
  - Texto general:     sans-serif (por defecto)


┌──────────────────────────────────────────────────────────────────────────────┐
│                      RESPONSIVIDAD (Breakpoints)                             │
└──────────────────────────────────────────────────────────────────────────────┘

📱 LAYOUT ADAPTATIVO:

Desktop (lg: ≥1024px):
  ┌───────────────────────────────────────────┐
  │ [3 cols] | [6 cols]    | [3 cols]         │
  │ Paciente | Monitor UCI | Administración   │
  └───────────────────────────────────────────┘

Tablet (md: 768-1023px):
  ┌───────────────────────────────────────────┐
  │ [Paciente - 12 cols]                      │
  │ [Monitor - 12 cols]                       │
  │ [Administración - 12 cols]                │
  └───────────────────────────────────────────┘

Mobile (sm: <768px):
  ┌───────────────────────────────────────────┐
  │ [Todo apilado verticalmente]              │
  │ [Full width - 12 cols cada sección]       │
  └───────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                         ESTADOS INTERACTIVOS                                 │
└──────────────────────────────────────────────────────────────────────────────┘

🎮 BOTONES:
  - Normal:     bg-gradient-to-r from-cyan-500 to-blue-600
  - Hover:      from-cyan-600 to-blue-700 + scale-105
  - Active:     (durante simulación) bg-red-600
  - Disabled:   opacity-50 cursor-not-allowed

📊 INPUTS:
  - Normal:     bg-slate-700 border-slate-600
  - Focus:      border-cyan-500 ring-2 ring-cyan-500
  - Invalid:    border-red-500

✅ INDICADORES:
  - Normal:     w-2 h-2 rounded-full bg-green-400
  - Anormal:    w-2 h-2 rounded-full bg-red-400


┌──────────────────────────────────────────────────────────────────────────────┐
│                      ESTRUCTURA DE COMPONENTES                               │
└──────────────────────────────────────────────────────────────────────────────┘

VirtualTwin (Principal)
├── Header
│   ├── Título con gradiente
│   └── Subtítulo
│
├── Grid de 3 Columnas
│   │
│   ├── Columna Izquierda (Paciente)
│   │   ├── PatientInfoCard
│   │   │   ├── Edad, Peso, Altura
│   │   │   ├── IMC calculado
│   │   │   └── ASA classification
│   │   ├── LabsCard
│   │   │   └── 4 analíticas con indicadores
│   │   └── PGxCard
│   │       └── 3 genes farmacogenéticos
│   │
│   ├── Columna Central (Monitor)
│   │   ├── MonitorDisplay (Negro)
│   │   │   ├── Constantes principales (3)
│   │   │   ├── Constantes secundarias (3)
│   │   │   ├── Status badges (3)
│   │   │   └── Timer
│   │   ├── HumanBodySVG
│   │   │   ├── Anatomía con colores
│   │   │   └── Porcentajes de función
│   │   └── TimelineChart (Chart.js)
│   │       └── 3 curvas (PAS, FC, SpO2)
│   │
│   └── Columna Derecha (Control)
│       ├── DrugAdministrationCard
│       │   ├── Selector de fármaco
│       │   ├── Dosis y unidad
│       │   ├── Vía de administración
│       │   ├── Botón SIMULAR/DETENER
│       │   └── Info del fármaco
│       ├── AlertsCard
│       │   └── Lista de alertas por severidad
│       └── QuickActionsCard
│           ├── Cristaloides
│           ├── Fenilefrina
│           ├── Intubar
│           └── Reiniciar


┌──────────────────────────────────────────────────────────────────────────────┐
│                         FLUJO DE SIMULACIÓN                                  │
└──────────────────────────────────────────────────────────────────────────────┘

1. Usuario configura paciente
        ↓
2. Usuario selecciona fármaco y dosis
        ↓
3. Usuario pulsa ▶ SIMULAR
        ↓
4. Calcular efectos farmacocinéticos
   (onset → peak → decay)
        ↓
5. Generar timeline de puntos temporales
   (cada 5 segundos durante la duración)
        ↓
6. Detectar eventos críticos
   (hipotensión, bradicardia, etc.)
        ↓
7. Calcular efectos orgánicos
   (cerebro, corazón, pulmones, etc.)
        ↓
8. Actualizar estado con warnings
        ↓
9. Animar timeline (cada 100ms)
   ├── Actualizar constantes vitales
   ├── Actualizar colores de órganos
   ├── Mostrar alertas
   └── Incrementar timer
        ↓
10. Al terminar: mostrar resultados finales


┌──────────────────────────────────────────────────────────────────────────────┐
│                           CASOS DE USO                                       │
└──────────────────────────────────────────────────────────────────────────────┘

🎓 EDUCACIÓN:
  ✓ Formación de residentes
  ✓ Práctica de inducción anestésica
  ✓ Estudio de interacciones farmacológicas
  ✓ Aprendizaje de farmacogenética

🏥 CLÍNICA:
  ✓ Planificación pre-procedimiento
  ✓ Evaluación de riesgos
  ✓ Simulación de escenarios complejos
  ✓ Training de manejo de crisis

🔬 INVESTIGACIÓN:
  ✓ Modelado farmacocinético
  ✓ Estudio de variabilidad interpaciente
  ✓ Validación de protocolos
  ✓ Desarrollo de nuevas estrategias

*/

export const LAYOUT_DESCRIPTION = {
  columns: {
    left: {
      width: '3/12',
      content: ['Patient Demographics', 'Laboratory Results', 'Pharmacogenetics']
    },
    center: {
      width: '6/12',
      content: ['ICU Monitor Display', 'Human Body Visualization', 'Timeline Charts']
    },
    right: {
      width: '3/12',
      content: ['Drug Administration', 'Alerts Panel', 'Quick Actions']
    }
  },
  
  colorPalette: {
    background: 'slate-950 → slate-900',
    cards: 'slate-800 → slate-900',
    vitals: {
      bp: 'red-400',
      hr: 'green-400',
      spo2: 'cyan-400',
      rr: 'purple-400',
      etco2: 'yellow-400',
      temp: 'orange-400'
    },
    organs: {
      good: 'green-400',
      fair: 'yellow-400',
      poor: 'orange-400',
      critical: 'red-400'
    }
  },
  
  animations: {
    critical: 'animate-pulse',
    heart: 'animate-pulse',
    transitions: 'duration-500',
    hover: 'scale-105'
  }
}
