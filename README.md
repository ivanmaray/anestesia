# Farmacia–Anestesia — Dashboard (Demo)

Proyecto de ejemplo: dashboard de seguridad clínica Farmacia–Anestesia.

Requisitos: Node 18+ recomendado.

Instalación y ejecución

```bash
npm install
npm run dev
```

El servidor de desarrollo arrancará y podrá abrir http://localhost:5173 (u otro puerto que muestre Vite).

Funcionalidades incluidas

- Filtros globales: Período (12/24/36 meses) y Área (Quirófano, REA, UCI, Unidad de Dolor, Todas).
- 4 KPIs con delta vs 12 meses previos.
 - Para esta demo simplificada, la app expone 3 secciones principales: Demo clínico interactivo, Evaluación retrospectiva y Construcción de algoritmo IA. Los gráficos y paneles extras han sido ocultados para presentar un flujo más directo.
- Gráfica de línea (tasa mensual de errores por 1.000 administraciones).
- Gráfica de barras apiladas por tipo de error.
- Semáforo de riesgo según tasa global.
- Tabla de alertas del CDSS con búsqueda, paginación (10/página) y filtro "Ver solo críticas".
- Botón "Subir CSV" para reemplazar datos simulados (validación de cabeceras).

Nuevas secciones

- Evaluación retrospectiva: análisis y agrupación de incidentes por mes/área/tipo; visualizaciones y exportación de resúmenes para auditoría.
	- En la sección 'Evaluación retrospectiva' se ha añadido una tarjeta para la 'Fase 1 (0–6 meses): Auditoría y diagnóstico inicial' que ahora está dividida en tres sub-secciones: `Revisión de errores`, `Entrevistas estructuradas` y `Diseño de indicadores iniciales`. Cada sub-sección muestra resultados de ejemplo (datos demo) y permite añadir notas/indicadores localmente para propósitos de auditoría demo. Las entrevistas ahora muestran hallazgos con un resumen visual (barras) y una breve explicación conceptual para cada hallazgo.
- Dashboard moderno — IA / FGG: sección conceptual para integrar modelos de apoyo a la decisión en la consulta preanestesia y en quirófano; incluye un asistente de texto (placeholder) y un flujo guiado (FGG) de ejemplo.
	- En el panel IA (Resultados predictivos) se muestra actualmente un modelo demo con nombre y métricas (precisión, recall, F1, AUC). Las métricas son de ejemplo y deben ser substituidas por valores reales tras entrenar y validar con datos clínicos reales.

CSV esperado

1) CSV mensual agregado (mínimo de columnas requeridas):

```
mes,area,administraciones,errores_totales,errores_severos_GI,near_miss,alertas_totales,alertas_criticas,alertas_aceptadas,dosis,farmaco,via,velocidad,lasa
2024-01,Quirófano,3500,12,2,4,10,1,6,3,4,2,2,1
2024-01,REA,2800,8,1,2,6,0,4,2,2,1,1,1
```

2) CSV detalle de alertas (opcional):

```
fecha,area,paciente_id,alerta,motivo,critica,aceptada
2024-01-05,Quirófano,P-12345,Intervención peligrosa,Error de etiquetado,true,false
2024-01-12,REA,P-54321,Dosis fuera de rango,Prescripción manual,false,true
```

Si faltan las cabeceras mínimas en el CSV mensual, la aplicación mostrará un error claro indicando las cabeceras necesarias.

Notas

- Todos los textos están en español.
- Los datos se generan de forma ficticia y pueden ser sustituidos mediante la opción "Subir CSV".

Protocol PDF
-------------
La versión completa del protocolo (documento que se usó para mapear campos del formulario preanestesia) **no está** almacenada en este repositorio por razones de privacidad y control de acceso. Para trabajar con el PDF localmente sigue estos pasos:

- Consultar `docs/protocols/README.md` para políticas y procedimiento recomendados.
- Ejecutar localmente `node scripts/extractProtocolSections.js /ruta/al/protocolo.pdf` para extraer texto y generar un `-extract.json` con el hash SHA-256 del archivo. Esto evita subir el PDF a un repositorio público.

