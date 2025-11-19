# Mapeo del protocolo — Formulario de Evaluación Preanestesia (resumen)

Este documento extrae las secciones relevantes del protocolo PDF y las mapea a campos de la aplicación.

Objetivo: crear un formulario FGG (flujo guiado) para la consulta preanestesia que pueda integrarse con el asistente IA y con el dashboard retrospectivo.

Campos (mínimos) — datos de paciente y contexto
- paciente_id: string (ID interno)
- nombre: string (opcional)
- fecha_nacimiento / edad: date | number
- sexo: enum (M/F/O)
- peso_kg: number
- altura_cm: number
- alergias: text
- ASA_status: enum (I, II, III, IV, V)
- procedimiento_planificado: text
- urgencia: enum (Electivo, Urgente, Emergencia)
- ayuno_horas: number
- antecedentes_relevantes: text (ej: insuficiencia renal, hepática, IAM reciente)
- medicacion_actual: text (lista — resaltar anticoagulantes, antiagregantes)
- antecedentes_anestesia: text (complicaciones previas)

Signos y pruebas (opcional/estructura)
- TA_mmHg: number
- FC_bpm: number
- Sat_O2_pct: number
- INR: number
- creatinina_mg_dL: number
- hemoglobina_g_dL: number

Checklists y verificación (booleanos)
- identidad_confirmada: boolean
- consentimiento_obtenido: boolean
- alergias_verificadas: boolean
- marcaje_sitio_quirurgico: boolean

Evaluación de riesgo (salida esperada del asistente IA / reglas)
- riesgo_global: enum (Bajo, Moderado, Alto)
- recomendaciones: text (acciones sugeridas)

Export / CSV (ejemplo de cabecera para exportar un registro preanestesia)

```
### Ubicación y trazabilidad del PDF original

- Archivo original (no versionado en este repositorio): `Proyecto de cooperación estratégica ... (corregido).pdf` (almacenado en ubicación privada del equipo / hospital).
- Fecha / versión: 2025-11-17 (documenta la versión que se usó para el mapeo local).
- Checksum: Guarda el SHA-256 del archivo si trabajas con el PDF original; puedes extraerlo con `scripts/extractProtocolSections.js`.

Si el archivo no puede almacenarse en el repositorio, utiliza la carpeta `docs/protocols/` para incluir una versión saneada y añade en la entrada del registro de cambios el hash y la ruta de almacenamiento privado.

paciente_id,nombre,fecha_nacimiento,edad,sexo,peso_kg,altura_cm,alergias,ASA_status,procedimiento_planificado,urgencia,ayuno_horas,medicacion_actual,antecedentes_relevantes,TA_mmHg,FC_bpm,Sat_O2_pct,INR,creatinina_mg_dL,hemoglobina_g_dL,identidad_confirmada,consentimiento_obtenido,alergias_verificadas,marcaje_sitio_quirurgico,riesgo_global,recomendaciones
```

Notas de implementación
- Validaciones: campos numéricos > 0, edad coherente, ASA dentro de valores válidos.
- Privacidad: los datos se guardarán localmente (localStorage) a modo de demo. Para producción se debe cifrar y usar backend clínico.
- Integración IA: el asistente IA tomará la nota clínica y devolverá `riesgo_global` y `recomendaciones` (actualmente simulado).

Siguientes pasos
1. Implementar `PreAnesthesiaForm` con validación y guardar/export CSV.
2. Conectar botón "Analizar con IA" que llame al asistente (simulado) y muestre recomendaciones.
3. Añadir almacenaje de registros y un listado en la sección retrospectiva para análisis.

Fase 1 (0–6 meses): Auditoría y diagnóstico inicial
- Revisión de errores de medicación registrados en quirófanos, reanimación y Unidad de Dolor en los últimos 3 años.
- Entrevistas estructuradas con anestesiólogos y farmacéuticos para identificar puntos críticos (se puede trackear con el checklist de la UI).
- Diseño de indicadores iniciales de seguridad y eficiencia (por ejemplo: tasa de errores / 1.000 administraciones, porcentaje de incidentes críticos, tiempo hasta intervención correcta).

***
 "Mapa generado automáticamente" — si quieres ajustes específicos del protocolo, indicar secciones concretas del PDF a priorizar.
