import React, { useEffect, useState } from 'react';
import FeatureCard from './FeatureCard';
import UseCaseCard from './UseCaseCard';

interface ProjectExplanationProps {
  onBack?: () => void;
  onOpenPrototype?: (section?: string) => void;
}

const ProjectExplanation: React.FC<ProjectExplanationProps> = ({ onBack, onOpenPrototype }) => {
  const [errorReduction, setErrorReduction] = useState(0);
  const [acceptanceRate, setAcceptanceRate] = useState(0);

  useEffect(() => {
    let mounted = true;
    const animate = (target: number, setter: (n: number) => void, duration = 700) => {
      const start = performance.now();
      const from = 0;
      const tick = (t: number) => {
        if (!mounted) return;
        const elapsed = t - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(from + (target - from) * progress);
        setter(value);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    animate(20, setErrorReduction, 900);
    setTimeout(() => animate(75, setAcceptanceRate, 900), 200);
    return () => { mounted = false };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-teal-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="text-left">
            <h1 className="text-4xl font-bold mb-4">Proyecto Farmacia–Anestesia</h1>
            <p className="text-lg max-w-3xl">
              Optimización de la seguridad del paciente y la gestión de recursos mediante inteligencia artificial,
              farmacogenómica y colaboración interdisciplinaria.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {onOpenPrototype && (
                <button onClick={() => onOpenPrototype('dashboard')} className="px-4 py-2 rounded bg-white text-indigo-700 font-semibold hover:opacity-95">Ver Prototipo</button>
              )}
              <button onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} className="px-4 py-2 rounded bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20">Saber más</button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-xs">
              <div className="bg-white/12 p-3 rounded-lg text-left">
                <div className="text-sm text-white/80">Reducción estimada de errores</div>
                <div className="text-2xl font-bold">{errorReduction}%</div>
              </div>
              <div className="bg-white/12 p-3 rounded-lg text-left">
                <div className="text-sm text-white/80">Ahorro farmacias</div>
                <div className="text-2xl font-bold">15%</div>
              </div>
              <div className="bg-white/12 p-3 rounded-lg text-left">
                <div className="text-sm text-white/80">Aceptación recomendaciones</div>
                <div className="text-2xl font-bold">{acceptanceRate}%</div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-2xl p-4 max-w-md mx-auto">
              <div className="h-48 bg-gray-50 rounded-md p-3">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded mb-2 w-3/4"></div>
                <div className="h-2 bg-gradient-to-r from-green-400 to-teal-500 rounded mb-2 w-1/2"></div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-left">
                    <div className="text-xs text-gray-500">Alertas activas</div>
                    <div className="font-bold text-gray-900">28</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-left">
                    <div className="text-xs text-gray-500">Pacientes en piloto</div>
                    <div className="font-bold text-gray-900">42</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">Vista previa del prototipo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Objectives Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Objetivos del Proyecto</h2>
          <p className="text-gray-700">
            Este proyecto busca optimizar la seguridad del paciente y la gestión de recursos mediante el uso de
            inteligencia artificial, farmacogenómica y colaboración interdisciplinaria entre Farmacia y Anestesia.
          </p>
        </div>

        {/* Phases Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 inline-flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M3 11l2-2 4 4 8-8 4 4"/></svg>
            Plan de Acción
          </h2>
          <div className="text-sm text-gray-800 mb-4">Hospitales de referencia: implementación escalonada iniciando en centros con alta actividad quirúrgica y Unidades de Dolor.</div>
          <div className="flex items-center gap-3 mb-4" aria-hidden>
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center px-4 py-1 bg-indigo-600 text-white rounded-full text-sm font-bold shadow">Fase 1</div>
              <div className="w-20 h-0.5 bg-indigo-200 rounded" />
              <div className="inline-flex items-center px-4 py-1 bg-indigo-600 text-white rounded-full text-sm font-bold shadow">Fase 2</div>
              <div className="w-20 h-0.5 bg-indigo-200 rounded" />
              <div className="inline-flex items-center px-4 py-1 bg-indigo-600 text-white rounded-full text-sm font-bold shadow">Fase 3</div>
              <div className="w-20 h-0.5 bg-indigo-200 rounded" />
              <div className="inline-flex items-center px-4 py-1 bg-indigo-600 text-white rounded-full text-sm font-bold shadow">Fase 4</div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div tabIndex={0} className="bg-white p-4 rounded border-l-4 border-indigo-600 hover:shadow-lg transition-shadow focus:outline-none focus:ring-4 focus:ring-indigo-200" role="group" aria-label="Fase 1 (0–6 meses)">
              <h3 className="text-lg font-semibold text-gray-900">Fase 1 (0–6 meses): Auditoría y diagnóstico inicial</h3>
              <ul className="text-sm text-gray-700 list-disc ml-5 mt-2">
                <li>Revisión de errores de medicación registrados en quirófanos, reanimación y Unidad de Dolor en los últimos 3 años.</li>
                <li>Entrevistas estructuradas con anestesiólogos y farmacéuticos para identificar puntos críticos.</li>
                <li>Diseño de indicadores iniciales de seguridad y eficiencia.</li>
              </ul>
            </div>

            <div tabIndex={0} className="bg-white p-4 rounded border-l-4 border-indigo-600 hover:shadow-lg transition-shadow focus:outline-none focus:ring-4 focus:ring-indigo-200" role="group" aria-label="Fase 2 (6–18 meses)">
              <h3 className="text-lg font-semibold text-gray-900">Fase 2 (6–18 meses): Desarrollo e integración de sistemas piloto</h3>
              <ul className="text-sm text-gray-700 list-disc ml-5 mt-2">
                <li>Implementación de un sistema de validación cruzada Farmacia–Anestesia con alertas básicas.</li>
                <li>Desarrollo de un algoritmo piloto de IA entrenado con datos locales para predicción de errores de medicación.</li>
                <li>Integración con HCE y bombas inteligentes en 2–3 quirófanos seleccionados.</li>
              </ul>
            </div>

            <div tabIndex={0} className="bg-white p-4 rounded border-l-4 border-indigo-600 hover:shadow-lg transition-shadow focus:outline-none focus:ring-4 focus:ring-indigo-200" role="group" aria-label="Fase 3 (18–36 meses)">
              <h3 className="text-lg font-semibold text-gray-900">Fase 3 (18–36 meses): Farmacogenómica aplicada</h3>
              <ul className="text-sm text-gray-700 list-disc ml-5 mt-2">
                <li>Inicio de programa de farmacogenómica en pacientes de alto riesgo (dolor crónico refractario, cirugía mayor de alto consumo analgésico).</li>
                <li>Creación de un biobanco farmacogenómico hospitalario en colaboración con Farmacia y Anestesia.</li>
                <li>Ajuste posológico en tiempo real apoyado en datos genéticos.</li>
              </ul>
            </div>

            <div tabIndex={0} className="bg-white p-4 rounded border-l-4 border-indigo-600 hover:shadow-lg transition-shadow focus:outline-none focus:ring-4 focus:ring-indigo-200" role="group" aria-label="Fase 4 (36–60 meses)">
              <h3 className="text-lg font-semibold text-gray-900">Fase 4 (36–60 meses): Escalado y consolidación</h3>
              <ul className="text-sm text-gray-700 list-disc ml-5 mt-2">
                <li>Extensión del sistema IA + farmacogenómica a todos los quirófanos y unidades críticas.</li>
                <li>Establecimiento de un Comité Farmacia–Anestesia permanente con reuniones mensuales y auditoría trimestral.</li>
                <li>Difusión de resultados en foros nacionales e internacionales y búsqueda de financiación para fase multicéntrica.</li>
              </ul>
            </div>
          </div>
          <div className="text-sm text-gray-800 mt-4">
            <strong>Nota:</strong> Este plan está estructurado por fases escalonadas para permitir validación, integración y escalado seguro en entornos clínicos.
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Visión y Alcance</h2>
          <p className="text-gray-700">
            La visión del proyecto es integrar herramientas avanzadas como sistemas de soporte a decisiones clínicas
            (CDSS), integración de farmacogenómica (PGx) y notificaciones inteligentes para mejorar los resultados
            clínicos y la experiencia del paciente.
          </p>
        </div>

        {/* Key Components Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Componentes Clave</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>CDSS: Reglas clínicas para ajustes de dosis y alertas de interacciones.</li>
            <li>PGx: Integración de datos farmacogenómicos para personalización de tratamientos.</li>
            <li>Sistema de notificaciones: Circuito no punitivo para reportar incidencias.</li>
          </ul>
        </div>

        {/* Features and Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                title="CDSS en tiempo real"
                description="Reglas clínicas y alertas en la pantalla del anestesiólogo y farmacia para prevenir errores de medicación."
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>}
              />
              <FeatureCard
                title="Integración PGx"
                description="Perfil farmacogenómico para personalizar dosis y seleccionar analgésicos eficaces y seguros."
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-activity"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>}
              />
              <FeatureCard
                title="Circuito no punitivo"
                description="Formulario rápido para reportar incidencias de forma anónima o identificada, con objetivos educativos."
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>}
              />
              <FeatureCard
                title="IA Predictiva"
                description="Modelos para priorizar pacientes con mayor riesgo y facilitar decisiones proactivas."
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trending-up"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>}
              />
            </div>
          </div>
          <div>
            {/* Roadmap card removed — Plan de Acción included separately as the main section above. */}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Casos de Uso</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <UseCaseCard title="Evaluación Preoperatoria" description="Captura de dolor, ansiedad, historial farmacológico y PGx" icon={<svg width={14} height={14} viewBox="0 0 24 24" className="opacity-80"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM13 14h-2c-3 0-5.5 2.5-5.5 5.5 0 .3.22.5.5.5h12c.28 0 .5-.2.5-.5C18.5 16.5 16 14 13 14z" fill="#4F46E5"/></svg>} onExplore={() => onOpenPrototype && onOpenPrototype('usecase')} />
            <UseCaseCard title="Conciliación Farmacéutica" description="Criterios de reconciliación, identificación de interacciones y seguridad" icon={<svg width={14} height={14} viewBox="0 0 24 24" className="opacity-80"><path d="M12 2L3 7v6c0 5.5 3.8 10 9 11 5.2-1 9-5.5 9-11V7l-9-5z" fill="#06B6D4"/></svg>} onExplore={() => onOpenPrototype && onOpenPrototype('usecase')} />
            <UseCaseCard title="Optimización de Dosis" description="Recomendaciones personalizadas según función renal y PGx" icon={<svg width={14} height={14} viewBox="0 0 24 24" className="opacity-80"><path d="M3 3h18v2H3V3zm1 6h16v2H4V9zM3 15h18v6H3v-6z" fill="#10B981"/></svg>} onExplore={() => onOpenPrototype && onOpenPrototype('usecase')} />
            <UseCaseCard title="Seguimiento Postoperatorio" description="Monitoreo de analgesia y reportes de PROMs/PREMs" icon={<svg width={14} height={14} viewBox="0 0 24 24" className="opacity-80"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM8 14l3 3 5-7" fill="#EF4444"/></svg>} onExplore={() => onOpenPrototype && onOpenPrototype('usecase')} />
          </div>
        </div>

        {/* Team & KPI Row */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">Equipo</div>
            <div className="mt-2 font-semibold text-gray-900">Farmacia Clínica</div>
            <div className="text-xs text-gray-600 mt-1">Coordinador: Dra. López — ml@example.com</div>
            <div className="mt-2 font-semibold text-gray-900">Anestesia</div>
            <div className="text-xs text-gray-600 mt-1">Coordinador: Dr. Pérez — dp@example.com</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">KPIs Simulados</div>
                <div className="text-lg font-bold text-gray-900">Reducción de errores: {errorReduction}%</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Aceptación recomendaciones</div>
                <div className="font-bold text-gray-900">{acceptanceRate}%</div>
              </div>
            </div>
            <div className="mt-4 h-24 bg-gray-50 rounded-md p-3">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded mb-2 w-3/4"></div>
              <div className="h-2 bg-gradient-to-r from-teal-400 to-green-500 rounded mb-2 w-1/2"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 mt-6">
          <div />
          <div className="flex gap-2">
            {onBack && (
              <button onClick={onBack} className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">Volver</button>
            )}
            {onOpenPrototype && (
              <button onClick={() => onOpenPrototype('dashboard')} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Ver Prototipo</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectExplanation;