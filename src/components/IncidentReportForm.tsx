import React, { useState } from 'react';

interface IncidentReport {
  id: string;
  category: string;
  description: string;
  anonymous: boolean;
}

const IncidentReportForm: React.FC = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [reports, setReports] = useState<IncidentReport[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: IncidentReport = {
      id: Date.now().toString(),
      category,
      description,
      anonymous,
    };
    setReports((prev) => [...prev, newReport]);
    localStorage.setItem('incidentReports', JSON.stringify([...reports, newReport]));
    setCategory('');
    setDescription('');
    setAnonymous(false);
    alert('Reporte enviado con éxito');
  };

  const handleExport = () => {
    const csvContent = reports
      .map((report) => `${report.id},${report.category},${report.description},${report.anonymous}`)
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'incident_reports.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="incident-report-form">
      <h2>Reportar Incidencia</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Categoría:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            Reporte Anónimo
          </label>
        </div>
        <button type="submit">Enviar Reporte</button>
      </form>
      <button onClick={handleExport}>Exportar Reportes</button>
    </div>
  );
};

export default IncidentReportForm;