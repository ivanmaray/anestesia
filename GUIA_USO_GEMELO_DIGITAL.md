# 🎮 Guía de Uso - Gemelo Digital Anestésico

## 🚀 Inicio Rápido

1. **Acceder al Gemelo Digital**
   - Navega a la aplicación en `http://localhost:5173/`
   - Busca la sección "Gemelo Virtual" en el dashboard

2. **Configurar el Paciente**
   - **Panel izquierdo** - Datos del Paciente:
     - Ajusta edad, peso y altura usando los campos numéricos
     - El IMC se calcula automáticamente
     - Selecciona la clasificación ASA (I-IV)
     - Modifica valores de analíticas si es necesario
     - Configura genotipos farmacogenéticos (opcional)

3. **Seleccionar Fármaco**
   - **Panel derecho** - Administración:
     - Elige el fármaco del menú desplegable
     - Ajusta la dosis (el campo cambiará de color según el fármaco)
     - Selecciona la unidad (mg/kg, mcg/kg, mg)
     - Confirma la vía de administración

4. **Ejecutar Simulación**
   - Pulsa el botón **▶ SIMULAR**
   - Observa cómo cambian las constantes vitales en tiempo real
   - El monitor central mostrará los signos vitales actualizándose
   - Las gráficas mostrarán la evolución temporal

5. **Monitorizar Resultados**
   - **Monitor Central**: Constantes vitales en formato UCI
   - **Visualización Anatómica**: Estado de órganos con código de colores
   - **Gráficas**: Evolución de PAS, FC y SpO2
   - **Panel de Alertas**: Advertencias y eventos críticos

---

## 💡 Funciones Avanzadas

### Acciones de Rescate
Durante la simulación, puedes intervenir con:
- **💧 Cristaloides 500ml**: Aumenta la presión arterial
- **💉 Fenilefrina 100mcg**: Vasopresor potente
- **🫁 Intubar**: Asegura la vía aérea y normaliza ventilación
- **🔄 Reiniciar**: Vuelve al estado basal del paciente

### Interpretación del Monitor

#### Códigos de Color - Constantes Vitales
- **Rojo parpadeante**: Valor crítico (requiere intervención inmediata)
- **Amarillo parpadeante**: Valor anormal (requiere vigilancia)
- **Color normal**: Dentro de rangos fisiológicos

#### Estados del Paciente (Badges)
- **Consciencia**: 
  - 🟢 AWAKE (despierto)
  - 🟡 SEDATED (sedado)
  - 🟠 UNCONSCIOUS (inconsciente)
  - 🟣 ANESTHETIZED (anestesiado)

- **Hemodinámica**:
  - 🟢 STABLE (estable)
  - 🟡 HYPOTENSIVE (hipotensión)
  - 🔴 SHOCK (shock hemodinámico)

- **Ventilación**:
  - 🟢 SPONTANEOUS (respiración espontánea)
  - 🔵 ASSISTED/CONTROLLED (ventilación mecánica)
  - 🔴 APNEIC (apnea - requiere ventilación)

### Visualización Anatómica

#### Código de Colores Orgánicos
- **🟢 Verde** (≥90%): Función normal
- **🟡 Amarillo** (70-89%): Función ligeramente reducida
- **🟠 Naranja** (50-69%): Función comprometida
- **🔴 Rojo** (<50%): Fallo orgánico

El corazón late cuando está funcionando correctamente (animación pulse).

---

## 📊 Casos de Uso Educativos

### Caso 1: Inducción Anestésica Estándar
**Objetivo**: Simular una inducción anestésica típica
- **Paciente**: 45 años, 70kg, ASA II
- **Fármaco**: Propofol 2 mg/kg
- **Observar**: 
  - Caída de TA sistólica (~25%)
  - Reducción de FC
  - Transición a estado "anesthetized"
  - Depresión respiratoria moderada

### Caso 2: Relajación Neuromuscular
**Objetivo**: Entender los efectos de los bloqueantes neuromusculares
- **Paciente**: 60 años, 80kg, ASA II
- **Fármaco**: Rocuronio 0.6 mg/kg
- **Observar**:
  - Alerta crítica: "PARÁLISIS - Ventilación mecánica REQUERIDA"
  - FR cae a 0
  - Usar botón "🫁 Intubar" para resolver
  - Sin efectos en TA/FC

### Caso 3: Paciente con Riesgo Farmacogenético
**Objetivo**: Identificar riesgos de hipertermia maligna
- **Configuración PGx**: RYR1 = NC (portador)
- **Fármaco**: Succinilcolina
- **Observar**:
  - Alerta crítica: "🚨 RIESGO HIPERTERMIA MALIGNA"
  - Aprender a evitar fármacos gatillo

### Caso 4: Paciente Anciano Frágil
**Objetivo**: Ajustar dosis en población geriátrica
- **Paciente**: 85 años, 60kg, ASA III
- **Fármaco**: Propofol 1.5 mg/kg (dosis reducida)
- **Observar**:
  - Mayor caída de TA (ajuste automático por edad)
  - Advertencia de sensibilidad aumentada
  - Necesidad de vasopresores

### Caso 5: Insuficiencia Renal
**Objetivo**: Ajustar dosis en IRC
- **Configuración**: Creatinina 2.5 mg/dL
- **Fármaco**: Rocuronio (excreción biliar/renal)
- **Observar**:
  - Alerta: "Insuficiencia renal - Ajustar dosis"
  - Duración prolongada del bloqueo

---

## 🔬 Farmacología de los Fármacos

### Propofol
- **Color**: 🟣 Púrpura-Rosa
- **Onset**: 30 segundos
- **Pico**: 1 minuto
- **Duración**: 10 minutos
- **Efectos**: ↓TA (↓↓), ↓FC, sedación profunda
- **Metabolismo**: Hepático
- **Nota**: Hipotensor potente

### Fentanyl
- **Color**: 🔵 Azul-Cyan
- **Onset**: 60 segundos
- **Pico**: 3 minutos
- **Duración**: 30 minutos
- **Efectos**: ↓TA, ↓FC, ↓FR, analgesia
- **Metabolismo**: Hepático (CYP3A4)
- **Nota**: Opioide potente

### Remifentanil
- **Color**: 🌊 Cyan-Teal
- **Onset**: 30 segundos
- **Pico**: 1.5 minutos
- **Duración**: 5 minutos (ultra-corto)
- **Efectos**: ↓TA, ↓FC, ↓↓FR
- **Metabolismo**: Esterasas plasmáticas
- **Nota**: Contexto-sensible mínimo

### Midazolam
- **Color**: 🟣 Índigo-Púrpura
- **Onset**: 90 segundos
- **Pico**: 5 minutos
- **Duración**: 60 minutos
- **Efectos**: ↓TA leve, sedación
- **Metabolismo**: Hepático (CYP2C19, CYP3A4)
- **Nota**: Benzodiacepina segura

### Rocuronio
- **Color**: 🔴 Rojo-Naranja
- **Onset**: 90 segundos
- **Pico**: 3 minutos
- **Duración**: 40 minutos
- **Efectos**: Parálisis neuromuscular completa
- **Metabolismo**: Hepático/biliar
- **Nota**: Requiere ventilación mecánica

### Succinilcolina
- **Color**: 🟠 Naranja-Rojo
- **Onset**: 30 segundos (más rápido)
- **Pico**: 1 minuto
- **Duración**: 6 minutos (muy corto)
- **Efectos**: Parálisis rápida
- **Metabolismo**: Pseudocolinesterasa
- **Nota**: ⚠️ Riesgo HM, hiperpotasemia

---

## ⚠️ Interpretación de Alertas

### Alertas Críticas (🚨 Rojo)
- **"SHOCK - Vasopresores urgentes"**: PAS <70 mmHg
- **"Depresión respiratoria severa"**: FR <8 rpm
- **"PARÁLISIS - Ventilación mecánica REQUERIDA"**: Relajante + FR=0
- **"RIESGO HIPERTERMIA MALIGNA"**: RYR1 variante + fármaco gatillo

**Acción**: Intervenir INMEDIATAMENTE con acciones de rescate

### Alertas Altas (⚠️ Naranja)
- **"Hipotensión detectada"**: PAS 70-90 mmHg
- **"Bradicardia"**: FC <50 lpm
- **"Hipoxemia"**: SpO2 <92%

**Acción**: Vigilar estrechamente, preparar intervención

### Alertas Medias (💡 Amarillo)
- **"Insuficiencia renal - Ajustar dosis"**: Cr >1.5 mg/dL
- **"Hepatopatía - Efecto prolongado"**: AST/ALT elevados

**Acción**: Considerar ajuste de dosis o elección de fármaco

---

## 📈 Valores de Referencia

### Signos Vitales Normales
- **PAS**: 100-140 mmHg
- **PAD**: 60-90 mmHg
- **FC**: 60-100 lpm
- **SpO2**: 95-100%
- **FR**: 12-20 rpm
- **EtCO2**: 35-45 mmHg
- **Temperatura**: 36.0-37.5°C

### IMC
- **Bajo peso**: <18.5
- **Normal**: 18.5-24.9
- **Sobrepeso**: 25-29.9
- **Obesidad**: ≥30

### Analíticas
- **Hemoglobina**: 12-16 g/dL
- **Creatinina**: 0.6-1.2 mg/dL
- **K+**: 3.5-5.0 mEq/L
- **Glucosa**: 70-110 mg/dL

---

## 🎯 Tips y Trucos

1. **Empezar simple**: Usa el paciente predeterminado para familiarizarte
2. **Comparar fármacos**: Simula el mismo paciente con diferentes anestésicos
3. **Probar extremos**: Edades extremas, ASA IV, insuficiencias orgánicas
4. **Usar rescate**: Practica el manejo de hipotensión y apnea
5. **Observar timeline**: Las gráficas muestran el perfil farmacocinético completo
6. **Pausar y analizar**: Detén la simulación para estudiar un momento específico

---

## 🐛 Troubleshooting

### La simulación no se inicia
- Verifica que has seleccionado un fármaco válido
- Revisa que la dosis sea >0
- Recarga la página si es necesario

### Los valores no cambian
- Asegúrate de haber pulsado "▶ SIMULAR"
- Espera al menos 5-10 segundos (tiempo de onset)
- Verifica la consola del navegador (F12)

### Las gráficas no aparecen
- Las gráficas solo aparecen después de la primera simulación
- Requieren al menos 5 puntos de datos

---

## 📞 Soporte

Para reportar bugs o sugerir mejoras, consulta el archivo `VIRTUAL_TWIN_MEJORAS.md` en la raíz del proyecto.

---

**¡Disfruta explorando la farmacología anestésica de forma segura e interactiva!** 🎓💉
